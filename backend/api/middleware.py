"""
AyurWell Middleware
- AuditLogMiddleware: logs every authenticated request
- SecurityHeadersMiddleware: adds security headers to every response
"""
import time
import logging
from django.conf import settings

logger = logging.getLogger("ayurwell.audit")

# Paths that map to specific event types
_EVENT_MAP = {
    "/api/auth/register/": "signup",
    "/api/auth/login/": "login",
    "/api/coach/chat/": "ai_chat",
    "/api/symptoms/analyze/": "symptom_check",
    "/api/diet/export-pdf/": "export_pdf",
    "/api/pulse/generate/": "pulse_check",
    "/api/community/posts/": "community_post",
    "/api/compatibility/check/": "compatibility_check",
    "/api/reports/generate/": "report_generate",
}


def _get_client_ip(request):
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    if xff:
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "")


def _get_event_type(path, method):
    for prefix, event in _EVENT_MAP.items():
        if path.startswith(prefix) and method == "POST":
            return event
    return "api_request"


class AuditLogMiddleware:
    """
    Logs every authenticated API request to the AuditLog model.
    Skips paths listed in settings.AUDIT_LOG_SKIP_PATHS.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.enabled = getattr(settings, "AUDIT_LOG_ENABLED", True)
        self.skip_paths = getattr(settings, "AUDIT_LOG_SKIP_PATHS", [])

    def __call__(self, request):
        start = time.monotonic()
        response = self.get_response(request)
        elapsed_ms = int((time.monotonic() - start) * 1000)

        if not self.enabled:
            return response

        path = request.path
        if any(path.startswith(skip) for skip in self.skip_paths):
            return response

        # Only log API paths
        if not path.startswith("/api/"):
            return response

        try:
            from .models import AuditLog

            user = getattr(request, "user", None)
            if user and not user.is_authenticated:
                user = None

            status = response.status_code
            severity = "info"
            if status >= 500:
                severity = "error"
            elif status >= 400:
                severity = "warning"

            event_type = _get_event_type(path, request.method)

            AuditLog.objects.create(
                user=user,
                event_type=event_type,
                ip_address=_get_client_ip(request),
                user_agent=request.META.get("HTTP_USER_AGENT", "")[:512],
                request_path=path[:512],
                request_method=request.method,
                status_code=status,
                response_time_ms=elapsed_ms,
                severity=severity,
                metadata={
                    "query_string": request.META.get("QUERY_STRING", "")[:256],
                },
            )
        except Exception as exc:
            # Never let audit logging break the request
            logger.warning("AuditLog write failed: %s", exc)

        return response


class SecurityHeadersMiddleware:
    """Adds security headers to every response."""

    def __init__(self, get_response):
        self.get_response = get_response
        self.headers = getattr(settings, "SECURITY_HEADERS", {})

    def __call__(self, request):
        response = self.get_response(request)
        for header, value in self.headers.items():
            response[header] = value
        return response
