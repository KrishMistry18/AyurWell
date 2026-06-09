"""
AyurWell API Schemas
OpenAPI schema decorators for all endpoints.
"""
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample, inline_serializer
from drf_spectacular.types import OpenApiTypes
from rest_framework import serializers as s


# ── Auth ──────────────────────────────────────────────────────────────────────

register_schema = extend_schema(
    tags=["auth"],
    summary="Register a new user",
    description="Creates a new user account and returns an authentication token.",
    request=inline_serializer("RegisterRequest", fields={
        "email": s.EmailField(),
        "password": s.CharField(),
        "name": s.CharField(required=False),
    }),
    responses={
        200: inline_serializer("RegisterResponse", fields={
            "token": s.CharField(),
            "username": s.CharField(),
            "name": s.CharField(),
        }),
        400: inline_serializer("ErrorResponse", fields={"detail": s.CharField()}),
    },
    examples=[
        OpenApiExample("Register example", value={"email": "user@example.com", "password": "securepass123", "name": "Arjun Sharma"}, request_only=True),
    ],
)

login_schema = extend_schema(
    tags=["auth"],
    summary="Login",
    description="Authenticates a user and returns a token. Rate limited to 5 attempts/minute per IP.",
    request=inline_serializer("LoginRequest", fields={
        "email": s.EmailField(),
        "password": s.CharField(),
    }),
    responses={
        200: inline_serializer("LoginResponse", fields={
            "token": s.CharField(),
            "username": s.CharField(),
            "name": s.CharField(),
        }),
        400: inline_serializer("LoginError", fields={"detail": s.CharField()}),
    },
    examples=[
        OpenApiExample("Login example", value={"email": "user@example.com", "password": "securepass123"}, request_only=True),
    ],
)


# ── Tips ──────────────────────────────────────────────────────────────────────

tips_all_schema = extend_schema(
    tags=["tips"],
    summary="Get all seasonal tips",
    description="Returns all seasonal tips with optional filters.",
    parameters=[
        OpenApiParameter("season", OpenApiTypes.STR, description="Filter by season (winter/spring/summer/autumn)"),
        OpenApiParameter("dosha", OpenApiTypes.STR, description="Filter by dosha (vata/pitta/kapha/all)"),
    ],
)


# ── Diet ──────────────────────────────────────────────────────────────────────

export_diet_pdf_schema = extend_schema(
    tags=["diet"],
    summary="Export diet plan as PDF",
    description="Generates a beautifully formatted PDF of the user's 7-day meal plan with Ayurvedic principles.",
    request=inline_serializer("ExportPDFRequest", fields={
        "plan": s.ListField(),
        "dosha": s.CharField(),
        "user_name": s.CharField(required=False),
        "pref": s.CharField(required=False),
        "goal": s.CharField(required=False),
    }),
    responses={200: OpenApiTypes.BINARY},
)

diet_swap_meal_schema = extend_schema(
    tags=["diet"],
    summary="Swap a meal",
    description="AI-powered meal swap. Limited to 3 swaps per day. Returns an alternative meal suggestion.",
    request=inline_serializer("SwapMealRequest", fields={
        "meal_type": s.ChoiceField(choices=["breakfast", "lunch", "dinner", "snack"]),
        "current_meal_name": s.CharField(),
        "dosha": s.CharField(),
        "season": s.CharField(required=False),
        "dietary_preference": s.CharField(required=False),
        "reason": s.CharField(required=False),
    }),
    responses={
        200: inline_serializer("SwapMealResponse", fields={
            "name": s.CharField(),
            "ingredients": s.ListField(),
            "ayurvedic_benefit": s.CharField(),
            "nutritional_info": s.DictField(),
            "dosha_alignment": s.CharField(),
            "why_better_than_original": s.CharField(),
            "swaps_remaining": s.IntegerField(),
        }),
        429: inline_serializer("RateLimitError", fields={"detail": s.CharField(), "swaps_remaining": s.IntegerField()}),
    },
)


# ── Pulse ─────────────────────────────────────────────────────────────────────

pulse_generate_schema = extend_schema(
    tags=["pulse"],
    summary="Generate daily pulse check",
    description="AI-powered wellness score (0-100) based on recent logs. One check per day.",
    request=inline_serializer("PulseGenerateRequest", fields={
        "dosha": s.CharField(),
        "logs": s.ListField(),
    }),
    responses={200: inline_serializer("PulseResponse", fields={
        "score": s.IntegerField(),
        "grade": s.ChoiceField(choices=["Excellent", "Good", "Fair", "Needs Attention"]),
        "summary": s.CharField(),
        "top_strength": s.CharField(),
        "top_concern": s.CharField(),
        "today_focus": s.CharField(),
        "dosha_balance": s.CharField(),
    })},
)

pulse_today_schema = extend_schema(
    tags=["pulse"],
    summary="Get today's pulse check",
    description="Returns today's pulse check if it exists, otherwise null.",
)

pulse_history_schema = extend_schema(
    tags=["pulse"],
    summary="Get pulse history",
    description="Returns the last 30 pulse checks.",
)


# ── Herbs ─────────────────────────────────────────────────────────────────────

herbs_list_schema = extend_schema(
    tags=["herbs"],
    summary="List herbs",
    description="Returns all herbs with optional search and filters.",
    parameters=[
        OpenApiParameter("search", OpenApiTypes.STR, description="Search by name or Sanskrit name"),
        OpenApiParameter("dosha", OpenApiTypes.STR, description="Filter by dosha (vata/pitta/kapha)"),
        OpenApiParameter("taste", OpenApiTypes.STR, description="Filter by taste"),
    ],
)

herb_detail_schema = extend_schema(
    tags=["herbs"],
    summary="Get herb details",
    description="Returns full details for a specific herb including benefits, dosha effects, and usage.",
)

herb_toggle_preferred_schema = extend_schema(
    tags=["herbs"],
    summary="Toggle preferred herb",
    description="Add or remove a herb from the user's preferred list.",
    responses={200: inline_serializer("ToggleResponse", fields={
        "added": s.BooleanField(),
        "total": s.IntegerField(),
    })},
)


# ── Gamification ──────────────────────────────────────────────────────────────

gamification_profile_schema = extend_schema(
    tags=["gamification"],
    summary="Get gamification profile",
    description="Returns user's streak, badges, and achievements.",
)

gamification_log_schema = extend_schema(
    tags=["gamification"],
    summary="Log wellness activity",
    description="Records a wellness log, updates streak, and checks for new badges.",
    request=inline_serializer("LogRequest", fields={
        "energy": s.IntegerField(),
        "sleep": s.FloatField(),
        "water": s.IntegerField(),
        "mood": s.IntegerField(),
    }),
    responses={200: inline_serializer("LogResponse", fields={
        "streak": s.IntegerField(),
        "new_badges": s.ListField(),
        "total_logs": s.IntegerField(),
    })},
)

gamification_check_schema = extend_schema(
    tags=["gamification"],
    summary="Check for new badges",
    description="Manually triggers badge check and returns any newly earned badges.",
)
