"""
AyurWell Custom Admin
Rich admin classes for all models + custom dashboard.
"""
import csv
import datetime
from django.contrib import admin, messages
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.db.models import Count, Avg
from django.http import HttpResponse
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.urls import path
from django.template.response import TemplateResponse
from django.db import connection

from .models import (
    Activity, ChatMessage, SeasonalTip, UserProfile,
    PulseCheck, Herb, UserStreak, Badge, UserBadge,
    SymptomCheck, Post, Comment, Like,
    CompatibilityResult, WeeklyReport, AuditLog,
)

User = get_user_model()


# ─────────────────────────────────────────────────────────────────────────────
# Custom Admin Site
# ─────────────────────────────────────────────────────────────────────────────

class AyurWellAdminSite(admin.AdminSite):
    site_header = "🌿 AyurWell Admin"
    site_title = "AyurWell"
    index_title = "Wellness Platform Dashboard"

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path("dashboard/", self.admin_view(self.dashboard_view), name="ayurwell_dashboard"),
        ]
        return custom + urls

    def dashboard_view(self, request):
        """Custom analytics dashboard."""
        today = datetime.date.today()
        week_ago = today - datetime.timedelta(days=7)

        # Today's stats
        new_signups_today = User.objects.filter(date_joined__date=today).count()
        active_today = AuditLog.objects.filter(
            created_at__date=today
        ).values("user").distinct().count()
        logs_today = Activity.objects.filter(created_at__date=today).count()
        total_users = User.objects.count()
        total_posts = Post.objects.count()
        total_symptom_checks = SymptomCheck.objects.count()

        # Dosha distribution
        dosha_dist = (
            UserProfile.objects.exclude(dosha="")
            .values("dosha")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        dosha_total = sum(d["count"] for d in dosha_dist) or 1
        dosha_data = [
            {
                "dosha": d["dosha"].capitalize(),
                "count": d["count"],
                "pct": round(d["count"] / dosha_total * 100),
                "color": {"vata": "#7B9CBF", "pitta": "#E07A5F", "kapha": "#6B8F71"}.get(
                    d["dosha"], "#2D6A4F"
                ),
            }
            for d in dosha_dist
        ]

        # Last 7 days activity
        daily_activity = []
        for i in range(6, -1, -1):
            day = today - datetime.timedelta(days=i)
            count = AuditLog.objects.filter(created_at__date=day).count()
            daily_activity.append({"day": day.strftime("%a"), "count": count})

        max_activity = max((d["count"] for d in daily_activity), default=1) or 1

        # Recent audit logs
        recent_logs = AuditLog.objects.select_related("user").order_by("-created_at")[:20]

        # Top badges
        top_badges = (
            UserBadge.objects.values("badge__name", "badge__icon_emoji")
            .annotate(earned_count=Count("id"))
            .order_by("-earned_count")[:5]
        )

        # DB size estimate
        db_stats = {}
        for model in [User, UserProfile, Activity, PulseCheck, Post, Comment,
                      SymptomCheck, WeeklyReport, AuditLog, Herb, Badge]:
            db_stats[model.__name__] = model.objects.count()

        context = {
            **self.each_context(request),
            "title": "AyurWell Dashboard",
            "new_signups_today": new_signups_today,
            "active_today": active_today,
            "logs_today": logs_today,
            "total_users": total_users,
            "total_posts": total_posts,
            "total_symptom_checks": total_symptom_checks,
            "dosha_data": dosha_data,
            "daily_activity": daily_activity,
            "max_activity": max_activity,
            "recent_logs": recent_logs,
            "top_badges": top_badges,
            "db_stats": db_stats,
        }
        return TemplateResponse(request, "admin/ayurwell_dashboard.html", context)


ayurwell_admin = AyurWellAdminSite(name="ayurwell_admin")


# ─────────────────────────────────────────────────────────────────────────────
# Admin Actions
# ─────────────────────────────────────────────────────────────────────────────

@admin.action(description="📥 Export selected users to CSV")
def export_users_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="ayurwell_users.csv"'
    writer = csv.writer(response)
    writer.writerow(["Username", "Email", "Name", "Date Joined", "Last Login", "Dosha", "Streak"])
    for user in queryset.select_related("profile", "streak"):
        dosha = getattr(user, "profile", None)
        streak = getattr(user, "streak", None)
        writer.writerow([
            user.username,
            user.email,
            user.get_full_name(),
            user.date_joined.strftime("%Y-%m-%d"),
            user.last_login.strftime("%Y-%m-%d") if user.last_login else "Never",
            dosha.dosha if dosha else "",
            streak.current_streak if streak else 0,
        ])
    return response


@admin.action(description="📧 Log wellness reminder (simulated send)")
def send_wellness_reminder(modeladmin, request, queryset):
    count = queryset.count()
    for user in queryset:
        AuditLog.objects.create(
            user=user,
            event_type="api_request",
            request_path="/admin/send-reminder/",
            request_method="POST",
            severity="info",
            metadata={"action": "wellness_reminder", "triggered_by": request.user.username},
        )
    messages.success(request, f"Wellness reminder logged for {count} user(s).")


@admin.action(description="🔄 Reset streak for selected users")
def reset_streak(modeladmin, request, queryset):
    count = 0
    for user in queryset:
        try:
            streak = user.streak
            streak.current_streak = 0
            streak.last_log_date = None
            streak.save()
            count += 1
        except UserStreak.DoesNotExist:
            pass
    messages.success(request, f"Reset streak for {count} user(s).")


@admin.action(description="🏆 Award 'Early Adopter' badge to selected users")
def award_early_adopter_badge(modeladmin, request, queryset):
    try:
        badge = Badge.objects.get(slug="early-adopter")
    except Badge.DoesNotExist:
        messages.error(request, "Badge 'early-adopter' not found.")
        return
    count = 0
    for user in queryset:
        _, created = UserBadge.objects.get_or_create(user=user, badge=badge)
        if created:
            count += 1
    messages.success(request, f"Awarded badge to {count} new user(s).")


@admin.action(description="📥 Export audit logs to CSV")
def export_audit_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="ayurwell_audit.csv"'
    writer = csv.writer(response)
    writer.writerow(["Timestamp", "User", "Event", "Method", "Path", "Status", "IP", "Response ms", "Severity"])
    for log in queryset:
        writer.writerow([
            log.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            log.user.username if log.user else "anonymous",
            log.event_type,
            log.request_method,
            log.request_path,
            log.status_code,
            log.ip_address,
            log.response_time_ms,
            log.severity,
        ])
    return response


@admin.action(description="📥 Export posts to CSV")
def export_posts_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="ayurwell_posts.csv"'
    writer = csv.writer(response)
    writer.writerow(["ID", "User", "Type", "Dosha", "Likes", "Comments", "Created"])
    for post in queryset.annotate(comment_count=Count("comments")):
        writer.writerow([
            post.id, post.user.username, post.post_type,
            post.dosha_tag, post.likes_count, post.comment_count,
            post.created_at.strftime("%Y-%m-%d"),
        ])
    return response


# ─────────────────────────────────────────────────────────────────────────────
# Inlines
# ─────────────────────────────────────────────────────────────────────────────

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = "Profile"
    fields = ("dosha", "onboarding_complete", "preferred_herbs", "meal_swaps_today")
    readonly_fields = ("meal_swaps_today",)


class UserStreakInline(admin.StackedInline):
    model = UserStreak
    can_delete = False
    verbose_name_plural = "Streak"
    fields = ("current_streak", "longest_streak", "total_logs", "last_log_date")
    readonly_fields = ("current_streak", "longest_streak", "total_logs", "last_log_date")


class ActivityInline(admin.TabularInline):
    model = Activity
    extra = 0
    readonly_fields = ("action", "created_at")
    can_delete = False
    max_num = 10
    ordering = ("-created_at",)


class UserBadgeInline(admin.TabularInline):
    model = UserBadge
    extra = 0
    readonly_fields = ("badge", "earned_at")
    can_delete = False
    max_num = 20


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    readonly_fields = ("user", "content", "created_at")
    can_delete = True
    max_num = 10


# ─────────────────────────────────────────────────────────────────────────────
# Model Admins
# ─────────────────────────────────────────────────────────────────────────────

@admin.register(User, site=ayurwell_admin)
class AyurWellUserAdmin(BaseUserAdmin):
    list_display = (
        "username", "email", "get_full_name", "get_dosha",
        "get_streak", "get_total_logs", "date_joined", "last_login", "is_staff",
    )
    list_filter = ("is_staff", "is_active", "profile__dosha", "date_joined")
    search_fields = ("username", "email", "first_name", "last_name")
    ordering = ("-date_joined",)
    inlines = [UserProfileInline, UserStreakInline, ActivityInline, UserBadgeInline]
    actions = [export_users_csv, send_wellness_reminder, reset_streak, award_early_adopter_badge]

    def get_dosha(self, obj):
        try:
            dosha = obj.profile.dosha
            colors = {"vata": "#7B9CBF", "pitta": "#E07A5F", "kapha": "#6B8F71"}
            color = colors.get(dosha, "#2D6A4F")
            return format_html(
                '<span style="background:{};color:white;padding:2px 8px;border-radius:12px;font-size:11px">{}</span>',
                color, dosha.capitalize() if dosha else "—"
            )
        except Exception:
            return "—"
    get_dosha.short_description = "Dosha"

    def get_streak(self, obj):
        try:
            s = obj.streak.current_streak
            return format_html('<strong style="color:#2D6A4F">🔥 {}</strong>', s)
        except Exception:
            return "0"
    get_streak.short_description = "Streak"

    def get_total_logs(self, obj):
        try:
            return obj.streak.total_logs
        except Exception:
            return 0
    get_total_logs.short_description = "Total Logs"


@admin.register(UserProfile, site=ayurwell_admin)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "dosha_badge", "onboarding_complete", "meal_swaps_today", "updated_at")
    list_filter = ("dosha", "onboarding_complete")
    search_fields = ("user__username", "user__email")
    readonly_fields = ("created_at", "updated_at")

    def dosha_badge(self, obj):
        colors = {"vata": "#7B9CBF", "pitta": "#E07A5F", "kapha": "#6B8F71"}
        color = colors.get(obj.dosha, "#999")
        return format_html(
            '<span style="background:{};color:white;padding:2px 8px;border-radius:12px;font-size:11px">{}</span>',
            color, obj.dosha.capitalize() if obj.dosha else "—"
        )
    dosha_badge.short_description = "Dosha"


@admin.register(Activity, site=ayurwell_admin)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("user", "action", "created_at")
    list_filter = ("action", "created_at")
    search_fields = ("user__username", "action")
    date_hierarchy = "created_at"
    readonly_fields = ("user", "action", "created_at")


@admin.register(PulseCheck, site=ayurwell_admin)
class PulseCheckAdmin(admin.ModelAdmin):
    list_display = ("user", "date", "score_badge", "grade", "created_at")
    list_filter = ("grade", "date")
    search_fields = ("user__username",)
    date_hierarchy = "date"
    readonly_fields = ("user", "date", "score", "grade", "json_data", "created_at")

    def score_badge(self, obj):
        color = "#059669" if obj.score >= 80 else "#0D9488" if obj.score >= 60 else "#D97706" if obj.score >= 40 else "#DC2626"
        return format_html(
            '<span style="background:{};color:white;padding:2px 8px;border-radius:12px;font-weight:bold">{}</span>',
            color, obj.score
        )
    score_badge.short_description = "Score"


@admin.register(Herb, site=ayurwell_admin)
class HerbAdmin(admin.ModelAdmin):
    list_display = ("emoji", "name", "sanskrit_name", "taste", "best_form", "created_at")
    search_fields = ("name", "sanskrit_name", "description")
    list_filter = ("taste", "best_form")
    readonly_fields = ("created_at",)


@admin.register(Badge, site=ayurwell_admin)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ("icon_emoji", "name", "category", "is_rare", "earned_count", "slug")
    list_filter = ("category", "is_rare")
    search_fields = ("name", "slug", "description")
    readonly_fields = ("earned_count",)

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            _earned_count=Count("userbadge")
        )

    def earned_count(self, obj):
        count = getattr(obj, "_earned_count", 0)
        return format_html('<strong style="color:#2D6A4F">👥 {}</strong>', count)
    earned_count.short_description = "Times Earned"
    earned_count.admin_order_field = "_earned_count"


@admin.register(UserBadge, site=ayurwell_admin)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ("user", "badge", "earned_at")
    list_filter = ("badge__category", "earned_at")
    search_fields = ("user__username", "badge__name")
    date_hierarchy = "earned_at"


@admin.register(UserStreak, site=ayurwell_admin)
class UserStreakAdmin(admin.ModelAdmin):
    list_display = ("user", "current_streak_display", "longest_streak", "total_logs", "last_log_date")
    list_filter = ("last_log_date",)
    search_fields = ("user__username",)
    readonly_fields = ("user", "current_streak", "longest_streak", "total_logs", "last_log_date", "updated_at")
    actions = [reset_streak]

    def current_streak_display(self, obj):
        return format_html('<strong style="color:#2D6A4F">🔥 {} days</strong>', obj.current_streak)
    current_streak_display.short_description = "Current Streak"


@admin.register(SeasonalTip, site=ayurwell_admin)
class SeasonalTipAdmin(admin.ModelAdmin):
    list_display = ("season", "dosha", "category", "tip_preview", "created_at")
    list_filter = ("season", "dosha", "category")
    search_fields = ("tip_text",)

    def tip_preview(self, obj):
        return obj.tip_text[:80] + "..." if len(obj.tip_text) > 80 else obj.tip_text
    tip_preview.short_description = "Tip"


@admin.register(SymptomCheck, site=ayurwell_admin)
class SymptomCheckAdmin(admin.ModelAdmin):
    list_display = ("user", "symptoms_preview", "affected_dosha", "date", "created_at")
    list_filter = ("date",)
    search_fields = ("user__username",)
    date_hierarchy = "date"
    readonly_fields = ("user", "symptoms_json", "result_json", "date", "created_at")

    def symptoms_preview(self, obj):
        symptoms = obj.symptoms_json
        if isinstance(symptoms, list):
            return ", ".join(symptoms[:3]) + ("..." if len(symptoms) > 3 else "")
        return str(symptoms)[:60]
    symptoms_preview.short_description = "Symptoms"

    def affected_dosha(self, obj):
        dosha = obj.result_json.get("affected_dosha", "") if isinstance(obj.result_json, dict) else ""
        colors = {"vata": "#7B9CBF", "pitta": "#E07A5F", "kapha": "#6B8F71"}
        color = colors.get(dosha, "#999")
        return format_html(
            '<span style="background:{};color:white;padding:2px 8px;border-radius:12px;font-size:11px">{}</span>',
            color, dosha.capitalize() if dosha else "—"
        )
    affected_dosha.short_description = "Dosha"


@admin.register(Post, site=ayurwell_admin)
class PostAdmin(admin.ModelAdmin):
    list_display = ("user", "post_type_badge", "dosha_tag", "content_preview", "likes_count", "comment_count", "created_at")
    list_filter = ("post_type", "dosha_tag", "created_at")
    search_fields = ("user__username", "content")
    date_hierarchy = "created_at"
    readonly_fields = ("likes_count", "created_at")
    inlines = [CommentInline]
    actions = [export_posts_csv]

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_comment_count=Count("comments"))

    def content_preview(self, obj):
        return obj.content[:80] + "..." if len(obj.content) > 80 else obj.content
    content_preview.short_description = "Content"

    def post_type_badge(self, obj):
        colors = {
            "recipe": "#EA580C", "tip": "#CA8A04", "experience": "#7C3AED",
            "question": "#2563EB", "achievement": "#059669",
        }
        color = colors.get(obj.post_type, "#6B7280")
        return format_html(
            '<span style="background:{};color:white;padding:2px 8px;border-radius:12px;font-size:11px">{}</span>',
            color, obj.post_type
        )
    post_type_badge.short_description = "Type"

    def comment_count(self, obj):
        return getattr(obj, "_comment_count", 0)
    comment_count.short_description = "Comments"
    comment_count.admin_order_field = "_comment_count"


@admin.register(Comment, site=ayurwell_admin)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("user", "post", "content_preview", "created_at")
    list_filter = ("created_at",)
    search_fields = ("user__username", "content")
    date_hierarchy = "created_at"

    def content_preview(self, obj):
        return obj.content[:60] + "..." if len(obj.content) > 60 else obj.content
    content_preview.short_description = "Content"


@admin.register(Like, site=ayurwell_admin)
class LikeAdmin(admin.ModelAdmin):
    list_display = ("user", "post")
    search_fields = ("user__username",)


@admin.register(CompatibilityResult, site=ayurwell_admin)
class CompatibilityResultAdmin(admin.ModelAdmin):
    list_display = ("user", "dosha_pair", "score_display", "rating_display", "share_code", "created_at")
    list_filter = ("dosha1", "dosha2", "created_at")
    search_fields = ("user__username", "share_code")
    date_hierarchy = "created_at"
    readonly_fields = ("user", "dosha1", "dosha2", "result_json", "share_code", "created_at")

    def dosha_pair(self, obj):
        return f"{obj.dosha1.capitalize()} × {obj.dosha2.capitalize()}"
    dosha_pair.short_description = "Pair"

    def score_display(self, obj):
        score = obj.result_json.get("score", 0) if isinstance(obj.result_json, dict) else 0
        return format_html('<strong>{}/100</strong>', score)
    score_display.short_description = "Score"

    def rating_display(self, obj):
        rating = obj.result_json.get("rating", "") if isinstance(obj.result_json, dict) else ""
        colors = {"Excellent": "#059669", "Good": "#0D9488", "Moderate": "#D97706", "Challenging": "#DC2626"}
        color = colors.get(rating, "#6B7280")
        return format_html(
            '<span style="color:{};font-weight:bold">{}</span>', color, rating
        )
    rating_display.short_description = "Rating"


@admin.register(WeeklyReport, site=ayurwell_admin)
class WeeklyReportAdmin(admin.ModelAdmin):
    list_display = ("user", "week_range", "grade_badge", "avg_score_display", "generated_at")
    list_filter = ("grade", "week_start")
    search_fields = ("user__username",)
    date_hierarchy = "week_start"
    readonly_fields = ("user", "week_start", "week_end", "ai_insights", "grade", "avg_score", "generated_at")

    def week_range(self, obj):
        return f"{obj.week_start} → {obj.week_end}"
    week_range.short_description = "Week"

    def grade_badge(self, obj):
        colors = {"Excellent": "#059669", "Good": "#0D9488", "Fair": "#D97706", "Needs Attention": "#DC2626"}
        color = colors.get(obj.grade, "#6B7280")
        return format_html(
            '<span style="background:{};color:white;padding:2px 8px;border-radius:12px;font-size:11px">{}</span>',
            color, obj.grade
        )
    grade_badge.short_description = "Grade"

    def avg_score_display(self, obj):
        return format_html('<strong>{:.0f}/100</strong>', obj.avg_score)
    avg_score_display.short_description = "Avg Score"


@admin.register(AuditLog, site=ayurwell_admin)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = (
        "created_at", "severity_badge", "user", "event_type",
        "request_method", "request_path", "status_code_badge", "response_time_ms",
    )
    list_filter = ("severity", "event_type", "request_method", "created_at")
    search_fields = ("user__username", "request_path", "ip_address")
    date_hierarchy = "created_at"
    readonly_fields = (
        "user", "event_type", "ip_address", "user_agent",
        "request_path", "request_method", "status_code",
        "response_time_ms", "metadata", "severity", "created_at",
    )
    actions = [export_audit_csv]

    def severity_badge(self, obj):
        colors = {"info": "#2D6A4F", "warning": "#D97706", "error": "#DC2626"}
        color = colors.get(obj.severity, "#6B7280")
        return format_html(
            '<span style="background:{};color:white;padding:2px 6px;border-radius:8px;font-size:10px;font-weight:bold">{}</span>',
            color, obj.severity.upper()
        )
    severity_badge.short_description = "Severity"

    def status_code_badge(self, obj):
        if obj.status_code is None:
            return "—"
        color = "#059669" if obj.status_code < 300 else "#D97706" if obj.status_code < 500 else "#DC2626"
        return format_html('<span style="color:{};font-weight:bold">{}</span>', color, obj.status_code)
    status_code_badge.short_description = "Status"

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


# ─────────────────────────────────────────────────────────────────────────────
# Also register with default admin site for /admin/ access
# ─────────────────────────────────────────────────────────────────────────────

# Register key models on the default admin site too
admin.site.site_header = "🌿 AyurWell Admin"
admin.site.site_title = "AyurWell"
admin.site.index_title = "Wellness Platform Dashboard"

for model, admin_class in [
    (UserProfile, UserProfileAdmin),
    (Activity, ActivityAdmin),
    (PulseCheck, PulseCheckAdmin),
    (Herb, HerbAdmin),
    (Badge, BadgeAdmin),
    (UserBadge, UserBadgeAdmin),
    (UserStreak, UserStreakAdmin),
    (SeasonalTip, SeasonalTipAdmin),
    (SymptomCheck, SymptomCheckAdmin),
    (Post, PostAdmin),
    (Comment, CommentAdmin),
    (Like, LikeAdmin),
    (CompatibilityResult, CompatibilityResultAdmin),
    (WeeklyReport, WeeklyReportAdmin),
    (AuditLog, AuditLogAdmin),
]:
    try:
        admin.site.register(model, admin_class)
    except admin.sites.AlreadyRegistered:
        pass
