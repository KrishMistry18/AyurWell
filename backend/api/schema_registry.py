"""
AyurWell Schema Registry
Applies @extend_schema metadata to all @api_view functions.

For @api_view functions, drf-spectacular reads schema metadata from
view_func.cls.schema_class or from the _spectacular_annotation dict
stored on the view function itself. We use the latter approach.
"""
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample, inline_serializer
from drf_spectacular.types import OpenApiTypes
from rest_framework import serializers as s


def _tag(view_func, **kwargs):
    """
    Apply extend_schema metadata to an @api_view function.

    drf-spectacular checks for _spectacular_annotation on the view function.
    We also apply it to the underlying cls to cover both code paths.
    """
    # Apply to the function directly
    view_func._spectacular_annotation = kwargs

    # Apply to the cls (WrappedAPIView) — this is what the schema generator reads
    if hasattr(view_func, 'cls'):
        # extend_schema returns a new decorated class; we need to update initkwargs
        new_cls = extend_schema(**kwargs)(view_func.cls)
        view_func.cls = new_cls
        # Also store on initkwargs for the generator
        if hasattr(view_func, 'initkwargs'):
            view_func.initkwargs['_spectacular_annotation'] = kwargs

    return view_func


def apply_schemas():
    """Call this once after all views are imported."""
    from . import views as v
    from . import views_features as vf
    from . import views_admin as va

    # ── Auth ──────────────────────────────────────────────────────────────────
    _tag(v.health, tags=["auth"], summary="Health check",
         description="Returns API status. No authentication required.",
         responses={200: inline_serializer("HealthResp", fields={"status": s.CharField(), "app": s.CharField()})})

    _tag(v.register, tags=["auth"], summary="Register a new user",
         description="Creates a new user account and returns an authentication token. Rate limited to 3/min per IP.",
         request=inline_serializer("RegisterReq", fields={"email": s.EmailField(), "password": s.CharField(), "name": s.CharField(required=False)}),
         responses={200: inline_serializer("RegisterResp", fields={"token": s.CharField(), "username": s.CharField(), "name": s.CharField()}), 400: inline_serializer("Err400", fields={"detail": s.CharField()})},
         examples=[OpenApiExample("Example", value={"email": "user@example.com", "password": "pass123", "name": "Arjun"}, request_only=True)])

    _tag(v.login, tags=["auth"], summary="Login",
         description="Authenticates a user and returns a token. Rate limited to 5/min per IP.",
         request=inline_serializer("LoginReq", fields={"email": s.EmailField(), "password": s.CharField()}),
         responses={200: inline_serializer("LoginResp", fields={"token": s.CharField(), "username": s.CharField(), "name": s.CharField()}), 400: inline_serializer("LoginErr", fields={"detail": s.CharField()})},
         examples=[OpenApiExample("Example", value={"email": "user@example.com", "password": "pass123"}, request_only=True)])

    _tag(v.me, tags=["auth"], summary="Get current user",
         description="Returns the authenticated user's profile. Requires Token auth.",
         responses={200: inline_serializer("MeResp", fields={"username": s.CharField(), "name": s.CharField(), "onboarding_complete": s.BooleanField(), "activities": s.ListField()})})

    # ── Dosha ─────────────────────────────────────────────────────────────────
    _tag(v.onboarding_complete, tags=["dosha"], summary="Complete onboarding",
         description="Marks onboarding as complete and saves the user's dosha result.",
         request=inline_serializer("OnboardReq", fields={"dosha": s.ChoiceField(choices=["vata", "pitta", "kapha"])}),
         responses={200: inline_serializer("OkResp", fields={"status": s.CharField()})})

    # ── Coach ─────────────────────────────────────────────────────────────────
    _tag(v.coach_chat, tags=["coach"], summary="Chat with AI wellness coach",
         description="Send a message to Vaidya, the AI Ayurvedic wellness coach. Rate limited to 20/hour per user.",
         request=inline_serializer("CoachReq", fields={"message": s.CharField(), "dosha": s.CharField(required=False), "conversation_history": s.ListField(required=False)}),
         responses={200: inline_serializer("CoachResp", fields={"reply": s.CharField()})},
         examples=[OpenApiExample("Ask about energy", value={"message": "I feel low energy lately", "dosha": "vata"}, request_only=True)])

    _tag(v.coach_history, tags=["coach"], summary="Get chat history",
         description="Returns the last 40 messages from the AI coach conversation.")

    # ── Tips ──────────────────────────────────────────────────────────────────
    _tag(v.tips_today, tags=["tips"], summary="Get today's seasonal tips",
         description="Returns 3 seasonal Ayurvedic tips for the user's dosha and current season.",
         parameters=[OpenApiParameter("dosha", OpenApiTypes.STR, description="vata/pitta/kapha")])

    _tag(v.tips_all, tags=["tips"], summary="Get all seasonal tips",
         description="Returns all tips with optional season and dosha filters.",
         parameters=[OpenApiParameter("season", OpenApiTypes.STR), OpenApiParameter("dosha", OpenApiTypes.STR)])

    # ── Diet ──────────────────────────────────────────────────────────────────
    _tag(v.export_diet_pdf, tags=["diet"], summary="Export diet plan as PDF",
         description="Generates a multi-page PDF of the user's 7-day Ayurvedic meal plan.",
         request=inline_serializer("PDFReq", fields={"plan": s.ListField(), "dosha": s.CharField(), "user_name": s.CharField(required=False)}),
         responses={200: OpenApiTypes.BINARY})

    _tag(v.diet_swap_meal, tags=["diet"], summary="Swap a meal",
         description="AI-powered meal swap. Limited to 3 swaps per day.",
         request=inline_serializer("SwapReq", fields={"meal_type": s.ChoiceField(choices=["breakfast", "lunch", "dinner", "snack"]), "current_meal_name": s.CharField(), "dosha": s.CharField()}),
         responses={200: inline_serializer("SwapResp", fields={"name": s.CharField(), "ingredients": s.ListField(), "ayurvedic_benefit": s.CharField(), "swaps_remaining": s.IntegerField()})})

    # ── Pulse ─────────────────────────────────────────────────────────────────
    _tag(v.pulse_generate, tags=["pulse"], summary="Generate daily pulse check",
         description="AI-powered wellness score (0-100) based on recent logs. One check per day.",
         request=inline_serializer("PulseReq", fields={"dosha": s.CharField(), "logs": s.ListField()}),
         responses={200: inline_serializer("PulseResp", fields={"score": s.IntegerField(), "grade": s.CharField(), "summary": s.CharField(), "top_strength": s.CharField(), "top_concern": s.CharField(), "today_focus": s.CharField()})})

    _tag(v.pulse_today, tags=["pulse"], summary="Get today's pulse check",
         description="Returns today's pulse check if it exists, otherwise null.")
    _tag(v.pulse_history, tags=["pulse"], summary="Get pulse history",
         description="Returns the last 30 pulse checks.")

    # ── Herbs ─────────────────────────────────────────────────────────────────
    _tag(v.herbs_list, tags=["herbs"], summary="List herbs",
         description="Returns all herbs with optional search and filters.",
         parameters=[OpenApiParameter("search", OpenApiTypes.STR), OpenApiParameter("dosha", OpenApiTypes.STR), OpenApiParameter("taste", OpenApiTypes.STR)])

    _tag(v.herb_detail, tags=["herbs"], summary="Get herb details",
         description="Full herb details including benefits, dosha effects, and usage.")
    _tag(v.herb_toggle_preferred, tags=["herbs"], summary="Toggle preferred herb",
         description="Add or remove a herb from the user's preferred list.",
         responses={200: inline_serializer("ToggleResp", fields={"added": s.BooleanField(), "total": s.IntegerField()})})

    # ── Gamification ──────────────────────────────────────────────────────────
    _tag(v.gamification_profile, tags=["gamification"], summary="Get gamification profile",
         description="Returns user's streak, badges, and achievements.")
    _tag(v.gamification_log, tags=["gamification"], summary="Log wellness activity",
         description="Records a wellness log, updates streak, and checks for new badges.",
         request=inline_serializer("LogReq", fields={"energy": s.IntegerField(), "sleep": s.FloatField(), "water": s.IntegerField(), "mood": s.IntegerField()}),
         responses={200: inline_serializer("LogResp", fields={"streak": s.IntegerField(), "new_badges": s.ListField(), "total_logs": s.IntegerField()})})
    _tag(v.gamification_check, tags=["gamification"], summary="Check for new badges")

    # ── Symptoms ──────────────────────────────────────────────────────────────
    _tag(vf.symptoms_analyze, tags=["symptoms"], summary="Analyze symptoms",
         description="AI-powered Ayurvedic symptom analysis. Rate limited to 10/hour per user.",
         request=inline_serializer("SymptomReq", fields={"symptoms": s.ListField(child=s.CharField()), "duration": s.CharField(required=False), "severity": s.IntegerField(required=False, min_value=1, max_value=5), "affected_area": s.CharField(required=False), "user_dosha": s.CharField(required=False)}),
         responses={200: inline_serializer("SymptomResp", fields={"likely_imbalance": s.CharField(), "affected_dosha": s.CharField(), "explanation": s.CharField(), "home_remedies": s.ListField(), "herbs_to_try": s.ListField(), "lifestyle_tips": s.ListField(), "dietary_advice": s.CharField(), "when_to_see_doctor": s.CharField(), "disclaimer": s.CharField()})},
         examples=[OpenApiExample("Fatigue", value={"symptoms": ["fatigue", "bloating"], "duration": "1 week", "severity": 3, "user_dosha": "vata"}, request_only=True)])

    _tag(vf.symptoms_history, tags=["symptoms"], summary="Get symptom check history",
         description="Returns the user's last 20 symptom checks.")

    # ── Community ─────────────────────────────────────────────────────────────
    _tag(vf.community_feed, tags=["community"], summary="Get community feed",
         description="Paginated community feed. 10 posts per page.",
         parameters=[OpenApiParameter("page", OpenApiTypes.INT), OpenApiParameter("post_type", OpenApiTypes.STR), OpenApiParameter("dosha_tag", OpenApiTypes.STR)])

    _tag(vf.community_create_post, tags=["community"], summary="Create a post",
         description="Creates a new community post. Content is HTML-sanitized.",
         request=inline_serializer("PostReq", fields={"content": s.CharField(), "post_type": s.ChoiceField(choices=["recipe", "tip", "experience", "question", "achievement"]), "dosha_tag": s.ChoiceField(choices=["vata", "pitta", "kapha", "all"])}),
         responses={201: inline_serializer("PostResp", fields={"id": s.IntegerField(), "content": s.CharField(), "post_type": s.CharField(), "likes_count": s.IntegerField(), "time_ago": s.CharField()})},
         examples=[OpenApiExample("Share recipe", value={"content": "My favourite kitchari recipe...", "post_type": "recipe", "dosha_tag": "vata"}, request_only=True)])

    _tag(vf.community_like_post, tags=["community"], summary="Toggle like on a post",
         responses={200: inline_serializer("LikeResp", fields={"liked": s.BooleanField(), "likes_count": s.IntegerField()})})

    _tag(vf.community_comments, tags=["community"], summary="Get or add comments",
         description="GET: Returns all comments. POST: Adds a new comment.",
         request=inline_serializer("CommentReq", fields={"content": s.CharField()}))

    # ── Compatibility ─────────────────────────────────────────────────────────
    _tag(vf.compatibility_check, tags=["compatibility"], summary="Check dosha compatibility",
         description="Returns compatibility analysis for two doshas. Covers all 9 dosha pair combinations.",
         request=inline_serializer("CompatReq", fields={"dosha1": s.ChoiceField(choices=["vata", "pitta", "kapha"]), "dosha2": s.ChoiceField(choices=["vata", "pitta", "kapha"])}),
         responses={200: inline_serializer("CompatResp", fields={"score": s.IntegerField(), "rating": s.CharField(), "summary": s.CharField(), "strengths": s.ListField(), "challenges": s.ListField(), "meal_plan_tip": s.CharField(), "best_activities_together": s.ListField(), "communication_tip": s.CharField(), "share_code": s.CharField()})},
         examples=[OpenApiExample("Vata + Pitta", value={"dosha1": "vata", "dosha2": "pitta"}, request_only=True)])

    _tag(vf.compatibility_share, tags=["compatibility"], summary="Generate shareable link",
         request=inline_serializer("ShareReq", fields={"dosha1": s.ChoiceField(choices=["vata", "pitta", "kapha"]), "dosha2": s.ChoiceField(choices=["vata", "pitta", "kapha"])}),
         responses={200: inline_serializer("ShareResp", fields={"share_code": s.CharField(), "url": s.CharField()})})

    _tag(vf.compatibility_invite, tags=["compatibility"], summary="Get shared compatibility result",
         description="Public endpoint — retrieves a compatibility result by share code.",
         responses={200: inline_serializer("CompatInviteResp", fields={"score": s.IntegerField(), "rating": s.CharField(), "summary": s.CharField(), "dosha1": s.CharField(), "dosha2": s.CharField()})})

    # ── Reports ───────────────────────────────────────────────────────────────
    _tag(vf.report_generate, tags=["reports"], summary="Generate weekly wellness report",
         description="Generates a multi-page PDF wellness report with AI insights for the current week.",
         request=inline_serializer("ReportReq", fields={"logs": s.ListField(), "dosha": s.CharField(required=False)}),
         responses={200: inline_serializer("ReportResp", fields={"id": s.IntegerField(), "week_start": s.DateField(), "week_end": s.DateField(), "grade": s.CharField(), "avg_score": s.FloatField(), "ai_insights": s.ListField()})},
         examples=[OpenApiExample("Generate", value={"dosha": "vata", "logs": [{"date": "Mon", "energy": 7, "sleep": 7.5, "water": 2000, "mood": 4}]}, request_only=True)])

    _tag(vf.report_list, tags=["reports"], summary="List weekly reports",
         description="Returns all generated weekly reports, newest first.")
    _tag(vf.report_download, tags=["reports"], summary="Download report PDF",
         description="Streams the PDF for a specific weekly report.",
         responses={200: OpenApiTypes.BINARY})

    # ── Admin ─────────────────────────────────────────────────────────────────
    _tag(va.audit_logs, tags=["admin"], summary="List audit logs (staff only)",
         description="Paginated audit logs with filters. Requires staff token.",
         parameters=[OpenApiParameter("user", OpenApiTypes.STR), OpenApiParameter("event_type", OpenApiTypes.STR), OpenApiParameter("severity", OpenApiTypes.STR), OpenApiParameter("date_from", OpenApiTypes.DATE), OpenApiParameter("date_to", OpenApiTypes.DATE), OpenApiParameter("page", OpenApiTypes.INT)])

    _tag(va.platform_stats, tags=["admin"], summary="Platform statistics (staff only)",
         description="High-level platform stats. Requires staff token.")
