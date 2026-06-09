"""
AyurWell Security Utilities
- Rate limiting helpers
- Input sanitization
- Numeric validation
"""
import re
import json
import functools
import time
from django.core.cache import cache
from django.http import JsonResponse
from django.conf import settings


# ─────────────────────────────────────────────────────────────────────────────
# Rate Limiting
# ─────────────────────────────────────────────────────────────────────────────

def _get_client_ip(request):
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    if xff:
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "unknown")


def _rate_limit_key(scope: str, identifier: str) -> str:
    return f"rl:{scope}:{identifier}"


def check_rate_limit(scope: str, identifier: str, limit: int, window_seconds: int):
    """
    Returns (allowed: bool, retry_after: int).
    Uses Django cache as a sliding window counter.
    """
    key = _rate_limit_key(scope, identifier)
    now = int(time.time())
    window_key = f"{key}:{now // window_seconds}"

    count = cache.get(window_key, 0)
    if count >= limit:
        # Calculate seconds until window resets
        retry_after = window_seconds - (now % window_seconds)
        return False, retry_after

    # Increment with TTL = window_seconds + 5 buffer
    cache.set(window_key, count + 1, timeout=window_seconds + 5)
    return True, 0


def rate_limit(scope: str, limit: int, window_seconds: int, key_func=None):
    """
    Decorator for DRF @api_view functions.
    key_func(request) -> str identifier. Defaults to IP for anon, user_id for auth.

    NOTE: Apply this decorator BEFORE @api_view so drf-spectacular can still
    introspect the view. The @extend_schema decorator should be outermost.
    """
    def decorator(view_func):
        @functools.wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if key_func:
                identifier = key_func(request)
            elif request.user and request.user.is_authenticated:
                identifier = f"user:{request.user.id}"
            else:
                identifier = f"ip:{_get_client_ip(request)}"

            allowed, retry_after = check_rate_limit(scope, identifier, limit, window_seconds)
            if not allowed:
                return JsonResponse(
                    {
                        "error": "Rate limit exceeded",
                        "retry_after": retry_after,
                        "message": f"Please wait {retry_after} seconds before trying again.",
                    },
                    status=429,
                )
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


def apply_rate_limit(request, scope: str, limit: int, window_seconds: int, key_func=None):
    """
    Inline rate limit check — call inside a view function.
    Returns a JsonResponse(429) if limited, else None.
    Usage:
        rl = apply_rate_limit(request, 'login', 5, 60)
        if rl: return rl
    """
    if key_func:
        identifier = key_func(request)
    elif request.user and request.user.is_authenticated:
        identifier = f"user:{request.user.id}"
    else:
        identifier = f"ip:{_get_client_ip(request)}"

    allowed, retry_after = check_rate_limit(scope, identifier, limit, window_seconds)
    if not allowed:
        return JsonResponse(
            {
                "error": "Rate limit exceeded",
                "retry_after": retry_after,
                "message": f"Please wait {retry_after} seconds before trying again.",
            },
            status=429,
        )
    return None


# Pre-built rate limit decorators
def rl_login(view_func):
    """5 attempts per minute per IP."""
    return rate_limit("login", 5, 60, key_func=lambda r: f"ip:{_get_client_ip(r)}")(view_func)


def rl_register(view_func):
    """3 registrations per minute per IP."""
    return rate_limit("register", 3, 60, key_func=lambda r: f"ip:{_get_client_ip(r)}")(view_func)


def rl_coach_chat(view_func):
    """20 AI coach messages per hour per user."""
    return rate_limit("coach_chat", 20, 3600)(view_func)


def rl_symptoms(view_func):
    """10 symptom analyses per hour per user."""
    return rate_limit("symptoms", 10, 3600)(view_func)


def rl_diet_generate(view_func):
    """5 diet generations per hour per user."""
    return rate_limit("diet_generate", 5, 3600)(view_func)


def rl_general(view_func):
    """100 requests per minute per user."""
    return rate_limit("general", 100, 60)(view_func)


# ─────────────────────────────────────────────────────────────────────────────
# Input Sanitization
# ─────────────────────────────────────────────────────────────────────────────

try:
    import bleach
    _BLEACH_AVAILABLE = True
except ImportError:
    _BLEACH_AVAILABLE = False


def sanitize_text(text: str, max_length: int = 5000) -> str:
    """Strip all HTML tags and limit length."""
    if not isinstance(text, str):
        return ""
    if _BLEACH_AVAILABLE:
        text = bleach.clean(text, tags=[], strip=True)
    else:
        # Fallback: simple regex strip
        text = re.sub(r"<[^>]+>", "", text)
    return text[:max_length].strip()


def sanitize_list(items, max_items: int = 20, max_item_length: int = 200) -> list:
    """Sanitize a list of strings."""
    if not isinstance(items, list):
        return []
    return [sanitize_text(str(item), max_item_length) for item in items[:max_items] if item]


# ─────────────────────────────────────────────────────────────────────────────
# Numeric Validation
# ─────────────────────────────────────────────────────────────────────────────

def clamp(value, min_val, max_val, default=None):
    """Clamp a numeric value to [min_val, max_val]. Returns default if invalid."""
    try:
        v = float(value)
        return max(min_val, min(max_val, v))
    except (TypeError, ValueError):
        return default if default is not None else min_val


def validate_wellness_log(log: dict) -> dict:
    """Validate and clamp a wellness log entry."""
    return {
        "date": sanitize_text(str(log.get("date", "")), 20),
        "energy": int(clamp(log.get("energy", 5), 1, 10, 5)),
        "sleep": float(clamp(log.get("sleep", 7), 0, 24, 7)),
        "water": int(clamp(log.get("water", 1500), 0, 10000, 1500)),
        "mood": int(clamp(log.get("mood", 3), 1, 5, 3)),
    }


def validate_severity(value) -> int:
    return int(clamp(value, 1, 5, 3))
