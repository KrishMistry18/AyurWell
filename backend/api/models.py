from django.db import models
from django.contrib.auth import get_user_model
import json
import datetime


class Activity(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="activities")
    action = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} - {self.action}"


class ChatMessage(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="chat_messages")
    role = models.CharField(max_length=16, choices=[("user", "User"), ("assistant", "Assistant")])
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]


class SeasonalTip(models.Model):
    SEASON_CHOICES = [("winter","Winter"),("spring","Spring"),("summer","Summer"),("autumn","Autumn")]
    DOSHA_CHOICES = [("vata","Vata"),("pitta","Pitta"),("kapha","Kapha"),("all","All Doshas")]
    CATEGORY_CHOICES = [("diet","Diet"),("lifestyle","Lifestyle"),("yoga","Yoga"),("herbs","Herbs")]

    season = models.CharField(max_length=16, choices=SEASON_CHOICES)
    dosha = models.CharField(max_length=16, choices=DOSHA_CHOICES)
    category = models.CharField(max_length=16, choices=CATEGORY_CHOICES)
    tip_text = models.TextField()
    source = models.CharField(max_length=256, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["season", "dosha", "category"]


class UserProfile(models.Model):
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE, related_name="profile")
    onboarding_complete = models.BooleanField(default=False)
    dosha = models.CharField(max_length=16, blank=True)
    preferred_herbs = models.JSONField(default=list, blank=True)
    meal_swaps_today = models.IntegerField(default=0)
    last_swap_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - Profile"

    def get_swaps_remaining(self):
        today = datetime.date.today()
        if self.last_swap_date != today:
            return 3
        return max(0, 3 - self.meal_swaps_today)

    def use_swap(self):
        today = datetime.date.today()
        if self.last_swap_date != today:
            self.meal_swaps_today = 1
            self.last_swap_date = today
        else:
            self.meal_swaps_today += 1
        self.save()


# ── Pulse Check ───────────────────────────────────────────────────────────────

class PulseCheck(models.Model):
    GRADE_CHOICES = [
        ("Excellent", "Excellent"),
        ("Good", "Good"),
        ("Fair", "Fair"),
        ("Needs Attention", "Needs Attention"),
    ]
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="pulse_checks")
    date = models.DateField(default=datetime.date.today)
    score = models.IntegerField()
    grade = models.CharField(max_length=20, choices=GRADE_CHOICES)
    json_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]
        unique_together = [("user", "date")]

    def __str__(self):
        return f"{self.user} - {self.date} - {self.score}"


# ── Herb Encyclopedia ─────────────────────────────────────────────────────────

class Herb(models.Model):
    name = models.CharField(max_length=100)
    sanskrit_name = models.CharField(max_length=100, blank=True)
    emoji = models.CharField(max_length=8, default="🌿")
    description = models.TextField()
    benefits = models.JSONField(default=list)
    dosha_effects = models.JSONField(default=dict)  # {vata, pitta, kapha: balances|aggravates|neutral}
    best_form = models.CharField(max_length=50, blank=True)
    avoid_if = models.TextField(blank=True)
    taste = models.CharField(max_length=100, blank=True)
    common_uses = models.JSONField(default=list)
    image_placeholder_color = models.CharField(max_length=20, default="#2D6A4F")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


# ── Gamification ──────────────────────────────────────────────────────────────

class UserStreak(models.Model):
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE, related_name="streak")
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_log_date = models.DateField(null=True, blank=True)
    total_logs = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} - {self.current_streak} days"

    def record_log(self):
        today = datetime.date.today()
        if self.last_log_date == today:
            return  # already logged today
        yesterday = today - datetime.timedelta(days=1)
        if self.last_log_date == yesterday:
            self.current_streak += 1
        else:
            self.current_streak = 1
        self.last_log_date = today
        self.total_logs += 1
        if self.current_streak > self.longest_streak:
            self.longest_streak = self.current_streak
        self.save()


class Badge(models.Model):
    CATEGORY_CHOICES = [
        ("streak", "Streak"),
        ("wellness", "Wellness"),
        ("diet", "Diet"),
        ("dosha", "Dosha"),
        ("special", "Special"),
    ]
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon_emoji = models.CharField(max_length=8)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    requirement_description = models.CharField(max_length=200)
    is_rare = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)

    class Meta:
        ordering = ["category", "sort_order"]

    def __str__(self):
        return self.name


class UserBadge(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="badges")
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [("user", "badge")]
        ordering = ["-earned_at"]

    def __str__(self):
        return f"{self.user} - {self.badge.name}"


# ── Symptom Checker ───────────────────────────────────────────────────────────

class SymptomCheck(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="symptom_checks")
    symptoms_json = models.JSONField()   # list of symptom strings
    result_json = models.JSONField()     # full AI response
    date = models.DateField(default=datetime.date.today)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} - {self.date}"


# ── Community Feed ────────────────────────────────────────────────────────────

class Post(models.Model):
    POST_TYPE_CHOICES = [
        ("recipe", "Recipe"),
        ("tip", "Tip"),
        ("experience", "Experience"),
        ("question", "Question"),
        ("achievement", "Achievement"),
    ]
    DOSHA_TAG_CHOICES = [
        ("vata", "Vata"), ("pitta", "Pitta"), ("kapha", "Kapha"), ("all", "All"),
    ]
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    post_type = models.CharField(max_length=20, choices=POST_TYPE_CHOICES, default="experience")
    dosha_tag = models.CharField(max_length=10, choices=DOSHA_TAG_CHOICES, default="all")
    image_url = models.URLField(blank=True, null=True)
    likes_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} - {self.post_type}"


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.user} on {self.post_id}"


class Like(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="likes")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_likes")

    class Meta:
        unique_together = [("user", "post")]

    def __str__(self):
        return f"{self.user} likes {self.post_id}"


# ── Dosha Compatibility ───────────────────────────────────────────────────────

class CompatibilityResult(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="compatibility_checks")
    dosha1 = models.CharField(max_length=10)
    dosha2 = models.CharField(max_length=10)
    result_json = models.JSONField()
    share_code = models.CharField(max_length=16, blank=True, unique=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.dosha1} x {self.dosha2}"


# ── Weekly Report ─────────────────────────────────────────────────────────────

class WeeklyReport(models.Model):
    GRADE_CHOICES = [
        ("Excellent", "Excellent"), ("Good", "Good"),
        ("Fair", "Fair"), ("Needs Attention", "Needs Attention"),
    ]
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="weekly_reports")
    week_start = models.DateField()
    week_end = models.DateField()
    pdf_content = models.BinaryField(null=True, blank=True)
    ai_insights = models.JSONField(default=list)
    grade = models.CharField(max_length=20, choices=GRADE_CHOICES, default="Good")
    avg_score = models.FloatField(default=0)
    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-week_start"]
        unique_together = [("user", "week_start")]

    def __str__(self):
        return f"{self.user} - Week of {self.week_start}"


# ── Audit Log ─────────────────────────────────────────────────────────────────

class AuditLog(models.Model):
    EVENT_CHOICES = [
        ("signup", "Sign Up"),
        ("login", "Login"),
        ("logout", "Logout"),
        ("password_change", "Password Change"),
        ("dosha_quiz", "Dosha Quiz"),
        ("diet_generate", "Diet Generate"),
        ("ai_chat", "AI Chat"),
        ("symptom_check", "Symptom Check"),
        ("export_pdf", "Export PDF"),
        ("pulse_check", "Pulse Check"),
        ("herb_view", "Herb View"),
        ("community_post", "Community Post"),
        ("compatibility_check", "Compatibility Check"),
        ("report_generate", "Report Generate"),
        ("api_request", "API Request"),
        ("rate_limit_exceeded", "Rate Limit Exceeded"),
        ("validation_error", "Validation Error"),
    ]
    SEVERITY_CHOICES = [
        ("info", "Info"),
        ("warning", "Warning"),
        ("error", "Error"),
    ]

    user = models.ForeignKey(
        get_user_model(), on_delete=models.SET_NULL,
        null=True, blank=True, related_name="audit_logs",
    )
    event_type = models.CharField(max_length=32, choices=EVENT_CHOICES, default="api_request")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=512, blank=True)
    request_path = models.CharField(max_length=512, blank=True)
    request_method = models.CharField(max_length=10, blank=True)
    status_code = models.IntegerField(null=True, blank=True)
    response_time_ms = models.IntegerField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default="info")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["event_type", "-created_at"]),
            models.Index(fields=["severity", "-created_at"]),
            models.Index(fields=["-created_at"]),
        ]

    def __str__(self):
        user_str = self.user.username if self.user else "anonymous"
        return f"[{self.severity.upper()}] {user_str} — {self.event_type} — {self.created_at:%Y-%m-%d %H:%M}"
