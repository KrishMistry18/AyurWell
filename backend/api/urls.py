from django.urls import path
from .views import (
    health, register, login, me,
    onboarding_complete,
    coach_chat, coach_history,
    tips_today, tips_all,
    export_diet_pdf,
    pulse_generate, pulse_today, pulse_history,
    herbs_list, herb_detail, herb_toggle_preferred,
    diet_swap_meal,
    gamification_profile, gamification_log, gamification_check,
)
from .views_features import (
    symptoms_analyze, symptoms_history,
    community_feed, community_create_post, community_like_post, community_comments,
    compatibility_check, compatibility_share, compatibility_invite,
    report_generate, report_list, report_download,
)
from .views_admin import audit_logs, platform_stats

# Apply OpenAPI schema metadata to all views (must happen after all imports)
from .schema_registry import apply_schemas
apply_schemas()

urlpatterns = [
    # Auth
    path('health/', health),
    path('auth/register/', register),
    path('auth/login/', login),
    path('auth/me/', me),
    path('users/onboarding-complete/', onboarding_complete),
    # Coach
    path('coach/chat/', coach_chat),
    path('coach/history/', coach_history),
    # Tips
    path('tips/today/', tips_today),
    path('tips/all/', tips_all),
    # Diet
    path('diet/export-pdf/', export_diet_pdf),
    path('diet/swap-meal/', diet_swap_meal),
    # Pulse
    path('pulse/generate/', pulse_generate),
    path('pulse/today/', pulse_today),
    path('pulse/history/', pulse_history),
    # Herbs
    path('herbs/', herbs_list),
    path('herbs/<int:herb_id>/', herb_detail),
    path('herbs/<int:herb_id>/toggle-preferred/', herb_toggle_preferred),
    # Gamification
    path('gamification/profile/', gamification_profile),
    path('gamification/log/', gamification_log),
    path('gamification/check/', gamification_check),
    # Symptom Checker
    path('symptoms/analyze/', symptoms_analyze),
    path('symptoms/history/', symptoms_history),
    # Community Feed
    path('community/feed/', community_feed),
    path('community/posts/', community_create_post),
    path('community/posts/<int:post_id>/like/', community_like_post),
    path('community/posts/<int:post_id>/comments/', community_comments),
    # Dosha Compatibility
    path('compatibility/check/', compatibility_check),
    path('compatibility/share/', compatibility_share),
    path('compatibility/invite/<str:code>/', compatibility_invite),
    # Weekly Reports
    path('reports/generate/', report_generate),
    path('reports/', report_list),
    path('reports/<int:report_id>/download/', report_download),
    # Admin API (staff only)
    path('admin/audit-logs/', audit_logs),
    path('admin/stats/', platform_stats),
]
