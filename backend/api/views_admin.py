"""
AyurWell Admin API Views
Staff-only endpoints for audit logs and platform stats.
"""
from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from .models import AuditLog, UserProfile, Post, SymptomCheck, WeeklyReport

User = get_user_model()


@extend_schema(
    tags=["admin"],
    summary="List audit logs (staff only)",
    description="Returns paginated audit logs with filters. Requires staff/admin token.",
    parameters=[
        OpenApiParameter("user", OpenApiTypes.STR, description="Filter by username"),
        OpenApiParameter("event_type", OpenApiTypes.STR, description="Filter by event type"),
        OpenApiParameter("severity", OpenApiTypes.STR, description="Filter by severity (info/warning/error)"),
        OpenApiParameter("date_from", OpenApiTypes.DATE, description="Filter from date (YYYY-MM-DD)"),
        OpenApiParameter("date_to", OpenApiTypes.DATE, description="Filter to date (YYYY-MM-DD)"),
        OpenApiParameter("page", OpenApiTypes.INT, description="Page number"),
    ],
)
@api_view(["GET"])
@permission_classes([IsAdminUser])
def audit_logs(request):
    qs = AuditLog.objects.select_related("user").order_by("-created_at")

    # Filters
    username = request.query_params.get("user")
    event_type = request.query_params.get("event_type")
    severity = request.query_params.get("severity")
    date_from = request.query_params.get("date_from")
    date_to = request.query_params.get("date_to")

    if username:
        qs = qs.filter(user__username__icontains=username)
    if event_type:
        qs = qs.filter(event_type=event_type)
    if severity:
        qs = qs.filter(severity=severity)
    if date_from:
        qs = qs.filter(created_at__date__gte=date_from)
    if date_to:
        qs = qs.filter(created_at__date__lte=date_to)

    # Pagination
    page = int(request.query_params.get("page", 1))
    page_size = 50
    total = qs.count()
    start = (page - 1) * page_size
    logs = qs[start: start + page_size]

    return Response({
        "count": total,
        "page": page,
        "has_next": (start + page_size) < total,
        "results": [
            {
                "id": log.id,
                "user": log.user.username if log.user else None,
                "event_type": log.event_type,
                "ip_address": log.ip_address,
                "request_method": log.request_method,
                "request_path": log.request_path,
                "status_code": log.status_code,
                "response_time_ms": log.response_time_ms,
                "severity": log.severity,
                "metadata": log.metadata,
                "created_at": log.created_at.isoformat(),
            }
            for log in logs
        ],
    })


@extend_schema(
    tags=["admin"],
    summary="Platform statistics (staff only)",
    description="Returns high-level platform stats. Requires staff/admin token.",
)
@api_view(["GET"])
@permission_classes([IsAdminUser])
def platform_stats(request):
    import datetime
    today = datetime.date.today()

    dosha_dist = (
        UserProfile.objects.exclude(dosha="")
        .values("dosha")
        .annotate(count=Count("id"))
        .order_by("-count")
    )

    return Response({
        "users": {
            "total": User.objects.count(),
            "new_today": User.objects.filter(date_joined__date=today).count(),
            "with_dosha": UserProfile.objects.exclude(dosha="").count(),
        },
        "dosha_distribution": {d["dosha"]: d["count"] for d in dosha_dist},
        "content": {
            "posts": Post.objects.count(),
            "symptom_checks": SymptomCheck.objects.count(),
            "weekly_reports": WeeklyReport.objects.count(),
        },
        "audit": {
            "total_logs": AuditLog.objects.count(),
            "errors_today": AuditLog.objects.filter(created_at__date=today, severity="error").count(),
            "warnings_today": AuditLog.objects.filter(created_at__date=today, severity="warning").count(),
        },
    })
