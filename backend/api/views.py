import io
import json
import datetime
import secrets
from django.http import HttpResponse
from django.contrib.auth import authenticate, get_user_model
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from drf_spectacular.utils import (
    extend_schema, OpenApiParameter, OpenApiExample, OpenApiResponse,
    inline_serializer,
)
from drf_spectacular.types import OpenApiTypes
from rest_framework import serializers as drf_serializers
from .models import (
    Activity, ChatMessage, SeasonalTip, UserProfile,
    PulseCheck, Herb, UserStreak, Badge, UserBadge,
    SymptomCheck, Post, Comment, Like, CompatibilityResult, WeeklyReport,
)
from .security import (
    rl_login, rl_register, rl_coach_chat, rl_general,
    apply_rate_limit, sanitize_text, sanitize_list,
    validate_wellness_log, clamp, _get_client_ip,
)


# ── Helpers ───────────────────────────────────────────────────────────────────

def _get_or_create_profile(user):
    profile, _ = UserProfile.objects.get_or_create(user=user)
    return profile


def _get_or_create_streak(user):
    streak, _ = UserStreak.objects.get_or_create(user=user)
    return streak


def _current_season():
    month = datetime.date.today().month
    if month in (12, 1, 2):
        return "winter"
    elif month in (3, 4, 5):
        return "spring"
    elif month in (6, 7, 8):
        return "summer"
    else:
        return "autumn"


def _call_claude(system_prompt, user_message, max_tokens=400):
    """Call Claude API; returns (text, error)."""
    api_key = getattr(settings, "ANTHROPIC_API_KEY", "")
    if not api_key:
        return None, "no_api_key"
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=max_tokens,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}],
        )
        return response.content[0].text, None
    except Exception as e:
        return None, str(e)


def _award_badge(user, slug):
    """Award a badge if not already earned. Returns (badge, newly_earned)."""
    try:
        badge = Badge.objects.get(slug=slug)
        _, created = UserBadge.objects.get_or_create(user=user, badge=badge)
        return badge, created
    except Badge.DoesNotExist:
        return None, False


def _check_and_award_badges(user):
    """Check all badge conditions and award any newly earned badges. Returns list of new badge names."""
    new_badges = []
    streak = _get_or_create_streak(user)

    # Streak badges
    streak_milestones = [(1, "first-step"), (7, "week-warrior"), (14, "fortnight-champion"),
                         (30, "30-day-sage"), (100, "100-day-yogi")]
    for days, slug in streak_milestones:
        if streak.current_streak >= days:
            badge, earned = _award_badge(user, slug)
            if earned and badge:
                new_badges.append(badge.name)

    # Early adopter — award to all users
    badge, earned = _award_badge(user, "early-adopter")
    if earned and badge:
        new_badges.append(badge.name)

    return new_badges


# ── Auth ──────────────────────────────────────────────────────────────────────

@extend_schema(
    tags=["auth"],
    summary="Health check",
    description="Returns API status. No authentication required.",
    responses={200: inline_serializer("HealthResponse", fields={"status": drf_serializers.CharField(), "app": drf_serializers.CharField()})},
)
@api_view(["GET"])
def health(request):
    return Response({"status": "ok", "app": "AyurWell API"})


def index(request):
    return HttpResponse(
        "<h1>AyurWell API</h1><p>Backend is running.</p>"
        "<ul><li><a href='/admin/'>Admin</a></li>"
        "<li><a href='/api/health/'>API Health</a></li></ul>",
        content_type="text/html",
    )


@extend_schema(
    tags=["auth"],
    summary="Register a new user",
    description="Creates a new user account and returns an authentication token.",
    request=inline_serializer("RegisterRequest", fields={
        "email": drf_serializers.EmailField(),
        "password": drf_serializers.CharField(),
        "name": drf_serializers.CharField(required=False),
    }),
    responses={
        200: inline_serializer("RegisterResponse", fields={
            "token": drf_serializers.CharField(),
            "username": drf_serializers.CharField(),
            "name": drf_serializers.CharField(),
        }),
        400: inline_serializer("ErrorResponse", fields={"detail": drf_serializers.CharField()}),
    },
    examples=[
        OpenApiExample("Register example", value={"email": "user@example.com", "password": "securepass123", "name": "Arjun Sharma"}, request_only=True),
    ],
)
@api_view(["POST"])
def register(request):
    rl = apply_rate_limit(request, "register", 3, 60, key_func=lambda r: f"ip:{_get_client_ip(r)}")
    if rl:
        return rl
    data = request.data
    username = data.get("email") or data.get("username")
    password = data.get("password")
    name = data.get("name", "")
    if not username or not password:
        return Response({"detail": "username/email and password required"}, status=400)
    User = get_user_model()
    if User.objects.filter(username=username).exists():
        return Response({"detail": "User already exists"}, status=400)
    user = User.objects.create_user(username=username, email=username)
    if hasattr(user, "first_name") and name:
        user.first_name = name
        user.save()
    user.set_password(password)
    user.save()
    token, _ = Token.objects.get_or_create(user=user)
    Activity.objects.create(user=user, action="signup")
    _get_or_create_profile(user)
    return Response({"token": token.key, "username": user.username, "name": user.first_name})


@extend_schema(
    tags=["auth"],
    summary="Login",
    description="Authenticates a user and returns a token. Rate limited to 5 attempts/minute per IP.",
    request=inline_serializer("LoginRequest", fields={
        "email": drf_serializers.EmailField(),
        "password": drf_serializers.CharField(),
    }),
    responses={
        200: inline_serializer("LoginResponse", fields={
            "token": drf_serializers.CharField(),
            "username": drf_serializers.CharField(),
            "name": drf_serializers.CharField(),
        }),
        400: inline_serializer("LoginError", fields={"detail": drf_serializers.CharField()}),
    },
    examples=[
        OpenApiExample("Login example", value={"email": "user@example.com", "password": "securepass123"}, request_only=True),
    ],
)
@api_view(["POST"])
def login(request):
    rl = apply_rate_limit(request, "login", 5, 60, key_func=lambda r: f"ip:{_get_client_ip(r)}")
    if rl:
        return rl
    data = request.data
    username = data.get("email") or data.get("username")
    password = data.get("password")
    user = authenticate(username=username, password=password)
    if not user:
        return Response({"detail": "Invalid credentials"}, status=400)
    token, _ = Token.objects.get_or_create(user=user)
    Activity.objects.create(user=user, action="login")
    return Response({"token": token.key, "username": user.username, "name": getattr(user, "first_name", "")})


@extend_schema(
    tags=["auth"],
    summary="Get current user",
    description="Returns the authenticated user's profile and recent activity. Requires Token auth.",
    responses={200: inline_serializer("MeResponse", fields={
        "username": drf_serializers.CharField(),
        "name": drf_serializers.CharField(),
        "onboarding_complete": drf_serializers.BooleanField(),
        "activities": drf_serializers.ListField(),
    })},
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    profile = _get_or_create_profile(user)
    return Response({
        "username": user.username,
        "name": getattr(user, "first_name", ""),
        "onboarding_complete": profile.onboarding_complete,
        "activities": [
            {"action": a.action, "created_at": a.created_at.isoformat()}
            for a in Activity.objects.filter(user=user)[:10]
        ],
    })


# ── Onboarding ────────────────────────────────────────────────────────────────

@extend_schema(
    tags=["dosha"],
    summary="Complete onboarding",
    description="Marks onboarding as complete and saves the user's dosha result.",
    request=inline_serializer("OnboardingRequest", fields={"dosha": drf_serializers.ChoiceField(choices=["vata", "pitta", "kapha"])}),
    responses={200: inline_serializer("OkResponse", fields={"status": drf_serializers.CharField()})},
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def onboarding_complete(request):
    profile = _get_or_create_profile(request.user)
    profile.onboarding_complete = True
    dosha = request.data.get("dosha", "")
    if dosha:
        profile.dosha = dosha
    profile.save()
    return Response({"status": "ok"})


# ── AI Coach ──────────────────────────────────────────────────────────────────

@extend_schema(
    tags=["coach"],
    summary="Chat with AI wellness coach",
    description="Send a message to Vaidya, the AI Ayurvedic wellness coach powered by Claude. Rate limited to 20/hour per user.",
    request=inline_serializer("CoachChatRequest", fields={
        "message": drf_serializers.CharField(),
        "dosha": drf_serializers.CharField(required=False),
        "conversation_history": drf_serializers.ListField(required=False),
        "energy_avg": drf_serializers.FloatField(required=False),
        "sleep_avg": drf_serializers.FloatField(required=False),
        "mood_avg": drf_serializers.FloatField(required=False),
    }),
    responses={200: inline_serializer("CoachChatResponse", fields={"reply": drf_serializers.CharField()})},
    examples=[
        OpenApiExample("Ask about energy", value={"message": "I feel low energy lately", "dosha": "vata"}, request_only=True),
    ],
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def coach_chat(request):
    rl = apply_rate_limit(request, "coach_chat", 20, 3600)
    if rl:
        return rl
    user = request.user
    message = sanitize_text(request.data.get("message", "").strip(), max_length=2000)
    conversation_history = request.data.get("conversation_history", [])
    dosha = sanitize_text(request.data.get("dosha", "Unknown"), max_length=20)
    energy_avg = clamp(request.data.get("energy_avg"), 1, 10)
    sleep_avg = clamp(request.data.get("sleep_avg"), 0, 24)
    mood_avg = clamp(request.data.get("mood_avg"), 1, 5)

    if not message:
        return Response({"detail": "message is required"}, status=400)

    api_key = getattr(settings, "ANTHROPIC_API_KEY", "")

    # Build context string
    context_parts = [f"User's dominant dosha: {dosha}"]
    if energy_avg is not None:
        context_parts.append(f"Average energy level (last 7 days): {energy_avg}/10")
    if sleep_avg is not None:
        context_parts.append(f"Average sleep (last 7 days): {sleep_avg} hours")
    if mood_avg is not None:
        context_parts.append(f"Average mood (last 7 days): {mood_avg}/5")
    context_str = ". ".join(context_parts)

    system_prompt = (
        "You are Vaidya, an expert Ayurvedic wellness coach in AyurWell. "
        f"User context: {context_str}. "
        "Give personalized, warm, practical advice rooted in Ayurveda. "
        "Keep responses concise (under 150 words). "
        "Never give medical diagnoses. "
        "Always recommend consulting a doctor for serious health issues. "
        "End every response with one actionable tip prefixed with '🌿 Tip:'."
    )

    if not api_key:
        # Graceful fallback when no API key is configured
        fallback_responses = {
            "energy": f"As a {dosha} type, low energy often signals Vata imbalance. Try warm sesame oil self-massage (Abhyanga) in the morning, eat warm cooked foods, and maintain a consistent sleep schedule. Avoid cold, raw foods and irregular meal times.\n\n🌿 Tip: Drink warm ginger tea with honey 30 minutes before breakfast to kindle your digestive fire.",
            "sleep": f"For better sleep as a {dosha} type, establish a calming bedtime routine. Drink warm milk with nutmeg and cardamom, practice gentle yoga nidra, and avoid screens 1 hour before bed. Keep your bedroom cool and dark.\n\n🌿 Tip: Massage your feet with warm sesame oil before bed — it grounds Vata and promotes deep sleep.",
            "eat": f"For your {dosha} constitution today, favor warm, freshly cooked meals. Start with warm lemon water, have kitchari for lunch (the ultimate Ayurvedic balancing meal), and a light soup for dinner. Avoid cold, processed, or leftover foods.\n\n🌿 Tip: Eat your largest meal at noon when your digestive fire (Agni) is strongest.",
            "imbalanced": f"When your {dosha} feels imbalanced, return to basics: regular meal times, adequate sleep, and gentle movement. Reduce stress through pranayama breathing — try Nadi Shodhana (alternate nostril breathing) for 5 minutes daily.\n\n🌿 Tip: Spend 10 minutes in nature daily — even a short walk barefoot on grass can help rebalance your dosha.",
        }
        reply = fallback_responses.get(
            next((k for k in fallback_responses if k in message.lower()), "energy"),
            f"Namaste! As a {dosha} type, I recommend focusing on your daily routine (Dinacharya). Consistency in wake time, meals, and sleep is the foundation of Ayurvedic wellness. Listen to your body's natural rhythms.\n\n🌿 Tip: Start each morning with a glass of warm water with lemon to cleanse your system and awaken your digestive fire."
        )
    else:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=api_key)

            messages = []
            for h in conversation_history[-10:]:  # last 10 messages for context
                if h.get("role") in ("user", "assistant"):
                    messages.append({"role": h["role"], "content": h["content"]})
            messages.append({"role": "user", "content": message})

            response = client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=300,
                system=system_prompt,
                messages=messages,
            )
            reply = response.content[0].text
        except Exception as e:
            return Response({"detail": f"AI service error: {str(e)}"}, status=500)

    # Save to DB
    ChatMessage.objects.create(user=user, role="user", content=message)
    ChatMessage.objects.create(user=user, role="assistant", content=reply)

    return Response({"reply": reply})


@extend_schema(
    tags=["coach"],
    summary="Get chat history",
    description="Returns the last 40 messages from the user's AI coach conversation.",
    responses={200: inline_serializer("ChatHistoryItem", fields={
        "role": drf_serializers.CharField(),
        "content": drf_serializers.CharField(),
        "created_at": drf_serializers.CharField(),
    }, many=True)},
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def coach_history(request):
    messages = ChatMessage.objects.filter(user=request.user).order_by("created_at")[:40]
    return Response([
        {"role": m.role, "content": m.content, "created_at": m.created_at.isoformat()}
        for m in messages
    ])


# ── Seasonal Tips ─────────────────────────────────────────────────────────────

@extend_schema(
    tags=["tips"],
    summary="Get today's seasonal tips",
    description="Returns 3 seasonal Ayurvedic tips personalized to the user's dosha and current season.",
    parameters=[OpenApiParameter("dosha", OpenApiTypes.STR, description="User's dosha (vata/pitta/kapha)")],
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tips_today(request):
    dosha = request.query_params.get("dosha", "").lower()
    season = _current_season()

    # Get tips matching dosha + season, or "all" dosha
    qs = SeasonalTip.objects.filter(season=season)
    if dosha and dosha in ("vata", "pitta", "kapha"):
        qs = qs.filter(dosha__in=[dosha, "all"])
    else:
        qs = qs.filter(dosha="all")

    tips = list(qs.order_by("?")[:3])
    if len(tips) < 3:
        # Fill with general tips
        extra = SeasonalTip.objects.filter(dosha="all").exclude(
            id__in=[t.id for t in tips]
        ).order_by("?")[: 3 - len(tips)]
        tips += list(extra)

    return Response({
        "season": season,
        "tips": [
            {
                "id": t.id,
                "season": t.season,
                "dosha": t.dosha,
                "category": t.category,
                "tip_text": t.tip_text,
                "source": t.source,
            }
            for t in tips
        ],
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tips_all(request):
    season = request.query_params.get("season", "").lower()
    dosha = request.query_params.get("dosha", "").lower()

    qs = SeasonalTip.objects.all()
    if season:
        qs = qs.filter(season=season)
    if dosha and dosha != "all":
        qs = qs.filter(dosha__in=[dosha, "all"])

    return Response([
        {
            "id": t.id,
            "season": t.season,
            "dosha": t.dosha,
            "category": t.category,
            "tip_text": t.tip_text,
            "source": t.source,
        }
        for t in qs
    ])


# ── PDF Export ────────────────────────────────────────────────────────────────

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def export_diet_pdf(request):
    from reportlab.lib.pagesizes import A4
    from reportlab.lib import colors
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import cm
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
        HRFlowable, PageBreak,
    )
    from reportlab.lib.enums import TA_CENTER, TA_LEFT

    plan_data = request.data.get("plan", [])
    dosha = request.data.get("dosha", "Vata")
    user_name = request.data.get("user_name", request.user.first_name or request.user.username)
    pref = request.data.get("pref", "Vegetarian")
    goal = request.data.get("goal", "Energy")

    # Colors
    PRIMARY = colors.HexColor("#2D6A4F")
    PRIMARY_LIGHT = colors.HexColor("#52B788")
    ACCENT = colors.HexColor("#E9C46A")
    SURFACE = colors.HexColor("#FEFAE0")
    SURFACE_DARK = colors.HexColor("#F5ECD7")
    TEXT = colors.HexColor("#1A1A2E")
    MUTED = colors.HexColor("#6B7280")

    dosha_colors = {"Vata": colors.HexColor("#7B9CBF"), "Pitta": colors.HexColor("#E07A5F"), "Kapha": colors.HexColor("#6B8F71")}
    dosha_color = dosha_colors.get(dosha, PRIMARY)

    dosha_info = {
        "Vata": {
            "desc": "Air & Space element. Creative, quick-thinking, and light. Vata types thrive with warmth, routine, and grounding practices.",
            "favor": ["Warm, cooked foods", "Sweet, sour, salty tastes", "Ghee and healthy oils", "Root vegetables", "Warm herbal teas"],
            "avoid": ["Cold, raw foods", "Bitter, astringent tastes", "Dry, light foods", "Caffeine excess", "Irregular meal times"],
        },
        "Pitta": {
            "desc": "Fire & Water element. Focused, driven, and natural leaders. Pitta types thrive with cooling foods and stress management.",
            "favor": ["Cool, refreshing foods", "Sweet, bitter, astringent tastes", "Coconut water", "Leafy greens", "Cooling herbs like coriander"],
            "avoid": ["Spicy, hot foods", "Sour, salty excess", "Alcohol and caffeine", "Fermented foods", "Eating when angry"],
        },
        "Kapha": {
            "desc": "Earth & Water element. Stable, nurturing, and deeply loyal. Kapha types thrive with stimulation and light, warming foods.",
            "favor": ["Light, dry foods", "Pungent, bitter, astringent tastes", "Warming spices", "Honey (in moderation)", "Legumes and vegetables"],
            "avoid": ["Heavy, oily foods", "Sweet, sour, salty excess", "Cold dairy", "Excessive sleep", "Sedentary lifestyle"],
        },
    }
    info = dosha_info.get(dosha, dosha_info["Vata"])

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=2*cm, leftMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm,
        title=f"AyurWell Diet Plan — {user_name}",
    )

    styles = getSampleStyleSheet()
    h1 = ParagraphStyle("H1", fontSize=28, textColor=PRIMARY, fontName="Helvetica-Bold", alignment=TA_CENTER, spaceAfter=8)
    h2 = ParagraphStyle("H2", fontSize=18, textColor=PRIMARY, fontName="Helvetica-Bold", spaceAfter=6, spaceBefore=12)
    h3 = ParagraphStyle("H3", fontSize=13, textColor=TEXT, fontName="Helvetica-Bold", spaceAfter=4, spaceBefore=8)
    body = ParagraphStyle("Body", fontSize=10, textColor=TEXT, fontName="Helvetica", spaceAfter=4, leading=14)
    muted = ParagraphStyle("Muted", fontSize=9, textColor=MUTED, fontName="Helvetica-Oblique", spaceAfter=3)
    center = ParagraphStyle("Center", fontSize=11, textColor=MUTED, fontName="Helvetica", alignment=TA_CENTER, spaceAfter=4)
    footer_style = ParagraphStyle("Footer", fontSize=8, textColor=MUTED, fontName="Helvetica", alignment=TA_CENTER)

    story = []

    # ── COVER PAGE ──────────────────────────────────────────────
    story.append(Spacer(1, 3*cm))
    story.append(Paragraph("🌿 AyurWell", h1))
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph("7-Day Personalized Meal Plan", ParagraphStyle("Sub", fontSize=16, textColor=MUTED, fontName="Helvetica", alignment=TA_CENTER, spaceAfter=6)))
    story.append(Spacer(1, 1*cm))
    story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY_LIGHT))
    story.append(Spacer(1, 0.8*cm))
    story.append(Paragraph(f"Prepared for: <b>{user_name}</b>", center))
    story.append(Paragraph(f"Dosha Constitution: <b>{dosha}</b>", center))
    story.append(Paragraph(f"Dietary Preference: <b>{pref}</b>  |  Health Goal: <b>{goal}</b>", center))
    story.append(Paragraph(f"Generated: {datetime.date.today().strftime('%B %d, %Y')}", center))
    story.append(Spacer(1, 2*cm))
    story.append(Paragraph("Ancient Wisdom • Modern Wellness", ParagraphStyle("Tag", fontSize=12, textColor=PRIMARY_LIGHT, fontName="Helvetica-Oblique", alignment=TA_CENTER)))
    story.append(PageBreak())

    # ── DOSHA PROFILE PAGE ──────────────────────────────────────
    story.append(Paragraph(f"Your Dosha Profile: {dosha}", h2))
    story.append(HRFlowable(width="100%", thickness=1, color=dosha_color))
    story.append(Spacer(1, 0.4*cm))
    story.append(Paragraph(info["desc"], body))
    story.append(Spacer(1, 0.5*cm))

    profile_data = [
        [Paragraph("<b>Foods to Favor</b>", h3), Paragraph("<b>Foods to Avoid</b>", h3)],
        *[
            [Paragraph(f"✓ {f}", body), Paragraph(f"✗ {a}", body)]
            for f, a in zip(info["favor"], info["avoid"])
        ],
    ]
    profile_table = Table(profile_data, colWidths=[8.5*cm, 8.5*cm])
    profile_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), SURFACE_DARK),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [SURFACE, colors.white]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("ROUNDEDCORNERS", [4]),
    ]))
    story.append(profile_table)
    story.append(PageBreak())

    # ── DAILY MEAL PAGES ────────────────────────────────────────
    meal_emojis = {"breakfast": "🌅", "lunch": "☀️", "dinner": "🌙", "snack": "🍵"}

    for day_plan in plan_data:
        day_name = day_plan.get("day", "Day")
        total_cal = day_plan.get("totalCal", 0)

        story.append(Paragraph(f"{day_name}", h2))
        story.append(Paragraph(f"Total: {total_cal} kcal  |  {dosha} Balancing  |  {pref}", muted))
        story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY_LIGHT))
        story.append(Spacer(1, 0.3*cm))

        for meal_key in ["breakfast", "lunch", "dinner", "snack"]:
            meal = day_plan.get(meal_key, {})
            if not meal:
                continue
            emoji = meal_emojis.get(meal_key, "🍽️")
            story.append(Paragraph(f"{emoji} {meal_key.capitalize()} — {meal.get('cal', 0)} kcal", h3))
            story.append(Paragraph(f"<b>{meal.get('name', '')}</b>", body))

            ingredients = meal.get("ingredients", [])
            if ingredients:
                story.append(Paragraph(f"Ingredients: {', '.join(ingredients)}", muted))

            benefit = meal.get("benefit", "")
            if benefit:
                story.append(Paragraph(f"🌿 Ayurvedic Benefit: {benefit}", muted))

            # Nutrition row
            nutrition = f"Protein: {meal.get('protein','—')}  |  Carbs: {meal.get('carbs','—')}  |  Fat: {meal.get('fat','—')}"
            story.append(Paragraph(nutrition, muted))
            story.append(Spacer(1, 0.2*cm))

        story.append(PageBreak())

    # ── AYURVEDIC PRINCIPLES PAGE ───────────────────────────────
    story.append(Paragraph("Ayurvedic Wellness Principles", h2))
    story.append(HRFlowable(width="100%", thickness=1, color=ACCENT))
    story.append(Spacer(1, 0.4*cm))

    principles = [
        ("Eat with Awareness", "Ayurveda teaches that how you eat is as important as what you eat. Sit down, eat slowly, and chew thoroughly. Avoid eating while distracted or emotionally upset."),
        ("Honor Your Digestive Fire (Agni)", "Your digestive fire is the cornerstone of health. Eat your largest meal at noon when Agni is strongest. Avoid cold water with meals as it dampens digestion."),
        ("Follow Nature's Rhythms", "Rise with the sun, eat at regular times, and sleep by 10pm. Aligning with nature's cycles keeps your doshas in balance."),
        ("Seasonal Eating", "Adjust your diet with the seasons. Eat warming, grounding foods in winter; cooling, hydrating foods in summer. Nature provides what each season requires."),
        ("Rest and Rejuvenation", "Adequate sleep is essential for cellular repair and dosha balance. Establish a calming bedtime routine and aim for 7-8 hours of quality sleep."),
    ]

    for title, desc in principles:
        story.append(Paragraph(f"<b>{title}</b>", body))
        story.append(Paragraph(desc, muted))
        story.append(Spacer(1, 0.3*cm))

    story.append(Spacer(1, 1*cm))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e5e7eb")))
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph("Generated by AyurWell • ayurwell.com • Ancient Wisdom, Modern Wellness", footer_style))

    doc.build(story)
    buffer.seek(0)

    filename = f"AyurWell-DietPlan-{datetime.date.today().strftime('%Y-%m-%d')}.pdf"
    response = HttpResponse(buffer.read(), content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    return response


# ── Pulse Check ───────────────────────────────────────────────────────────────

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def pulse_generate(request):
    user = request.user
    dosha = request.data.get("dosha", "Unknown")
    logs = request.data.get("logs", [])  # last 7 days [{energy,sleep,water,mood,date}]
    season = _current_season()

    if len(logs) < 3:
        return Response({"detail": "Need at least 3 days of logs to generate pulse check."}, status=400)

    # Build analytics summary
    energies = [l.get("energy", 0) for l in logs if l.get("energy")]
    sleeps = [l.get("sleep", 0) for l in logs if l.get("sleep")]
    waters = [l.get("water", 0) for l in logs if l.get("water")]
    moods = [l.get("mood", 0) for l in logs if l.get("mood")]

    avg_e = round(sum(energies) / len(energies), 1) if energies else 0
    avg_s = round(sum(sleeps) / len(sleeps), 1) if sleeps else 0
    avg_w = round(sum(waters) / len(waters)) if waters else 0
    avg_m = round(sum(moods) / len(moods), 1) if moods else 0

    user_message = (
        f"User data: Dosha={dosha}, Season={season}, Days analyzed={len(logs)}, "
        f"Avg energy={avg_e}/10, Avg sleep={avg_s}h, Avg water={avg_w}ml, Avg mood={avg_m}/5. "
        f"Raw logs: {json.dumps(logs[-7:])}"
    )

    system_prompt = (
        'You are an Ayurvedic health analyst. Analyze the user\'s wellness data and return ONLY valid JSON '
        'in this exact format with no extra text: '
        '{"score": <number 0-100>, "grade": "<Excellent|Good|Fair|Needs Attention>", '
        '"summary": "<2 sentences max>", "top_strength": "<1 sentence>", '
        '"top_concern": "<1 sentence>", "today_focus": "<1 actionable sentence>", '
        '"dosha_balance": "<Balanced|Mildly Imbalanced|Imbalanced>"}'
    )

    text, error = _call_claude(system_prompt, user_message, max_tokens=300)

    if error == "no_api_key" or text is None:
        # Smart fallback based on averages
        score = min(100, max(0, int(
            (avg_e / 10) * 30 + (min(avg_s, 9) / 9) * 25 +
            (min(avg_w, 2500) / 2500) * 20 + (avg_m / 5) * 25
        )))
        grade = "Excellent" if score >= 80 else "Good" if score >= 60 else "Fair" if score >= 40 else "Needs Attention"
        pulse_data = {
            "score": score, "grade": grade,
            "summary": f"Your wellness score of {score} reflects your recent {len(logs)}-day tracking. "
                       f"Your {dosha} constitution is {'well-supported' if score >= 60 else 'showing signs of imbalance'} by your current routine.",
            "top_strength": f"Your {'energy levels are strong' if avg_e >= 7 else 'sleep consistency' if avg_s >= 7 else 'hydration habits'} stand out as your biggest wellness asset.",
            "top_concern": f"{'Sleep duration needs attention — aim for 7-8 hours' if avg_s < 6.5 else 'Water intake could be higher — target 2000ml daily' if avg_w < 1500 else 'Energy levels have room to improve with better routine'}.",
            "today_focus": f"Focus on {'getting to bed 30 minutes earlier tonight' if avg_s < 7 else 'drinking a glass of water every 2 hours' if avg_w < 1500 else 'a 10-minute morning meditation to sustain your momentum'}.",
            "dosha_balance": "Balanced" if score >= 70 else "Mildly Imbalanced" if score >= 45 else "Imbalanced",
        }
    else:
        try:
            # Strip markdown code fences if present
            clean = text.strip()
            if clean.startswith("```"):
                clean = clean.split("```")[1]
                if clean.startswith("json"):
                    clean = clean[4:]
            pulse_data = json.loads(clean.strip())
        except Exception:
            return Response({"detail": "Failed to parse AI response."}, status=500)

    # Save to DB (upsert for today)
    today = datetime.date.today()
    pulse, _ = PulseCheck.objects.update_or_create(
        user=user, date=today,
        defaults={"score": pulse_data["score"], "grade": pulse_data["grade"], "json_data": pulse_data},
    )

    # Award pulse pioneer badge
    _award_badge(user, "pulse-pioneer")
    if pulse_data["score"] >= 80:
        _award_badge(user, "excellent-pulse")

    return Response(pulse_data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def pulse_today(request):
    today = datetime.date.today()
    try:
        pulse = PulseCheck.objects.get(user=request.user, date=today)
        return Response(pulse.json_data)
    except PulseCheck.DoesNotExist:
        return Response(None)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def pulse_history(request):
    pulses = PulseCheck.objects.filter(user=request.user).order_by("date")[:30]
    return Response([
        {"date": p.date.isoformat(), "score": p.score, "grade": p.grade}
        for p in pulses
    ])


# ── Herb Encyclopedia ─────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def herbs_list(request):
    qs = Herb.objects.all()
    search = request.query_params.get("search", "").strip()
    dosha = request.query_params.get("dosha", "").lower()
    taste = request.query_params.get("taste", "").lower()

    if search:
        qs = qs.filter(name__icontains=search) | Herb.objects.filter(sanskrit_name__icontains=search)
        qs = qs.distinct()

    if dosha and dosha in ("vata", "pitta", "kapha"):
        # Filter herbs that balance the given dosha
        filtered_ids = [h.id for h in qs if h.dosha_effects.get(dosha) == "balances"]
        qs = Herb.objects.filter(id__in=filtered_ids)

    if taste:
        qs = qs.filter(taste__icontains=taste)

    return Response([
        {
            "id": h.id, "name": h.name, "sanskrit_name": h.sanskrit_name,
            "emoji": h.emoji, "description": h.description[:150] + "...",
            "benefits": h.benefits[:3], "dosha_effects": h.dosha_effects,
            "best_form": h.best_form, "taste": h.taste,
            "common_uses": h.common_uses[:4],
            "image_placeholder_color": h.image_placeholder_color,
        }
        for h in qs
    ])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def herb_detail(request, herb_id):
    try:
        h = Herb.objects.get(id=herb_id)
    except Herb.DoesNotExist:
        return Response({"detail": "Not found"}, status=404)

    profile = _get_or_create_profile(request.user)
    is_preferred = h.id in (profile.preferred_herbs or [])

    return Response({
        "id": h.id, "name": h.name, "sanskrit_name": h.sanskrit_name,
        "emoji": h.emoji, "description": h.description,
        "benefits": h.benefits, "dosha_effects": h.dosha_effects,
        "best_form": h.best_form, "avoid_if": h.avoid_if,
        "taste": h.taste, "common_uses": h.common_uses,
        "image_placeholder_color": h.image_placeholder_color,
        "is_preferred": is_preferred,
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def herb_toggle_preferred(request, herb_id):
    profile = _get_or_create_profile(request.user)
    preferred = list(profile.preferred_herbs or [])
    if herb_id in preferred:
        preferred.remove(herb_id)
        added = False
    else:
        preferred.append(herb_id)
        added = True
    profile.preferred_herbs = preferred
    profile.save()

    # Award herb explorer badge at 5 herbs
    if len(preferred) >= 5:
        _award_badge(request.user, "herb-explorer")

    return Response({"added": added, "total": len(preferred)})


# ── Meal Swap ─────────────────────────────────────────────────────────────────

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def diet_swap_meal(request):
    user = request.user
    profile = _get_or_create_profile(user)

    swaps_remaining = profile.get_swaps_remaining()
    if swaps_remaining <= 0:
        return Response({"detail": "Daily swap limit reached (3 per day).", "swaps_remaining": 0}, status=429)

    meal_type = request.data.get("meal_type", "lunch")
    current_meal = request.data.get("current_meal_name", "")
    dosha = request.data.get("dosha", "Vata")
    season = request.data.get("season", _current_season())
    dietary_pref = request.data.get("dietary_preference", "Vegetarian")
    reason = request.data.get("reason", "Want something different")

    system_prompt = (
        'You are an expert Ayurvedic nutritionist. Suggest ONE alternative meal. '
        'Return ONLY valid JSON with no extra text in this exact format: '
        '{"name": "<meal name>", "ingredients": ["<ingredient1>", "<ingredient2>", ...], '
        '"ayurvedic_benefit": "<1-2 sentences>", '
        '"nutritional_info": {"calories": <number>, "protein": "<Xg>", "carbs": "<Xg>", "fat": "<Xg>"}, '
        '"dosha_alignment": "<Balances X>", "why_better_than_original": "<1 sentence>"}'
    )

    user_message = (
        f"Suggest ONE alternative {meal_type} for a {dosha} person in {season} season "
        f"with {dietary_pref} diet. Current meal: {current_meal}. Reason for swap: {reason}."
    )

    text, error = _call_claude(system_prompt, user_message, max_tokens=350)

    if error == "no_api_key" or text is None:
        # Fallback alternatives by meal type
        fallbacks = {
            "breakfast": {"name": "Warm Spiced Quinoa Bowl", "ingredients": ["Quinoa", "Almond milk", "Cinnamon", "Cardamom", "Honey", "Banana"], "ayurvedic_benefit": "Quinoa is a complete protein that grounds Vata and provides sustained energy. Warming spices kindle Agni.", "nutritional_info": {"calories": 310, "protein": "10g", "carbs": "48g", "fat": "8g"}, "dosha_alignment": f"Balances {dosha}", "why_better_than_original": "Lighter and easier to digest while still providing complete nutrition."},
            "lunch": {"name": "Red Lentil Dal with Basmati Rice", "ingredients": ["Red lentils", "Basmati rice", "Turmeric", "Cumin", "Coriander", "Ghee"], "ayurvedic_benefit": "Red lentils are easier to digest than other legumes and provide complete protein with rice. Spices support Agni.", "nutritional_info": {"calories": 390, "protein": "18g", "carbs": "62g", "fat": "8g"}, "dosha_alignment": f"Balances {dosha}", "why_better_than_original": "More digestible and better spiced for your dosha constitution."},
            "dinner": {"name": "Vegetable Soup with Ginger", "ingredients": ["Seasonal vegetables", "Ginger", "Cumin", "Coriander", "Ghee", "Rock salt"], "ayurvedic_benefit": "Light soups are ideal for dinner as they are easy to digest and do not burden the system overnight.", "nutritional_info": {"calories": 280, "protein": "10g", "carbs": "40g", "fat": "7g"}, "dosha_alignment": f"Balances {dosha}", "why_better_than_original": "Lighter for evening digestion, supporting restful sleep."},
            "snack": {"name": "Warm Turmeric Milk with Dates", "ingredients": ["Whole milk", "Turmeric", "Cardamom", "Dates", "Honey"], "ayurvedic_benefit": "Golden milk is deeply nourishing and anti-inflammatory. Dates provide natural sweetness and grounding energy.", "nutritional_info": {"calories": 160, "protein": "5g", "carbs": "24g", "fat": "5g"}, "dosha_alignment": f"Balances {dosha}", "why_better_than_original": "More nourishing and Ayurvedically aligned than the original snack."},
        }
        meal_data = fallbacks.get(meal_type, fallbacks["lunch"])
    else:
        try:
            clean = text.strip()
            if clean.startswith("```"):
                clean = clean.split("```")[1]
                if clean.startswith("json"):
                    clean = clean[4:]
            meal_data = json.loads(clean.strip())
        except Exception:
            return Response({"detail": "Failed to parse AI response."}, status=500)

    # Use a swap
    profile.use_swap()
    swaps_remaining = profile.get_swaps_remaining()

    # Award meal swapper badge
    Activity.objects.create(user=user, action="meal_swap")
    swap_count = Activity.objects.filter(user=user, action="meal_swap").count()
    if swap_count >= 5:
        _award_badge(user, "meal-swapper")

    return Response({**meal_data, "swaps_remaining": swaps_remaining})


# ── Gamification ──────────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def gamification_profile(request):
    user = request.user
    streak = _get_or_create_streak(user)
    earned_badges = UserBadge.objects.filter(user=user).select_related("badge")
    earned_slugs = {ub.badge.slug for ub in earned_badges}
    all_badges = Badge.objects.all()

    # Next streak milestone
    milestones = [1, 7, 14, 30, 100]
    next_milestone = next((m for m in milestones if m > streak.current_streak), None)

    # Last 7 days log presence (from Activity)
    today = datetime.date.today()
    logged_days = set()
    for i in range(7):
        day = today - datetime.timedelta(days=i)
        if streak.last_log_date and streak.last_log_date >= day:
            logged_days.add(day.isoformat())

    return Response({
        "streak": {
            "current": streak.current_streak,
            "longest": streak.longest_streak,
            "total_logs": streak.total_logs,
            "last_log_date": streak.last_log_date.isoformat() if streak.last_log_date else None,
            "next_milestone": next_milestone,
            "logged_today": streak.last_log_date == today,
        },
        "badges": [
            {
                "slug": b.slug, "name": b.name, "description": b.description,
                "icon_emoji": b.icon_emoji, "category": b.category,
                "requirement_description": b.requirement_description,
                "is_rare": b.is_rare,
                "earned": b.slug in earned_slugs,
                "earned_at": next(
                    (ub.earned_at.isoformat() for ub in earned_badges if ub.badge.slug == b.slug), None
                ),
            }
            for b in all_badges
        ],
        "total_earned": len(earned_slugs),
        "total_badges": all_badges.count(),
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def gamification_log(request):
    """Record a wellness log, update streak, check badges."""
    user = request.user
    streak = _get_or_create_streak(user)
    streak.record_log()

    # Check time-based badges
    now = datetime.datetime.now()
    if now.hour < 7:
        _award_badge(user, "dawn-riser")
    if now.hour >= 22:
        _award_badge(user, "night-owl")

    new_badges = _check_and_award_badges(user)

    return Response({
        "streak": streak.current_streak,
        "new_badges": new_badges,
        "total_logs": streak.total_logs,
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def gamification_check(request):
    """Manually trigger badge check."""
    new_badges = _check_and_award_badges(request.user)
    return Response({"new_badges": new_badges})
