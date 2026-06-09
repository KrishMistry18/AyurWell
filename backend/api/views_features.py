"""
AyurWell — Feature Views
Symptom Checker, Community Feed, Dosha Compatibility, Weekly Reports
"""
import io
import json
import datetime
import secrets

from django.http import HttpResponse
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import (
    extend_schema, OpenApiParameter, OpenApiExample, inline_serializer,
)
from drf_spectacular.types import OpenApiTypes
from rest_framework import serializers as s

from .models import (
    SymptomCheck, Post, Comment, Like,
    CompatibilityResult, WeeklyReport, UserProfile, UserStreak,
)
from .security import (
    rl_symptoms, rl_general,
    apply_rate_limit, sanitize_text, sanitize_list,
    validate_wellness_log, validate_severity, clamp,
)


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _call_claude(system_prompt, user_message, max_tokens=800):
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


def _parse_json_response(text):
    """Strip markdown fences and parse JSON."""
    clean = text.strip()
    if clean.startswith("```"):
        parts = clean.split("```")
        clean = parts[1] if len(parts) > 1 else clean
        if clean.startswith("json"):
            clean = clean[4:]
    return json.loads(clean.strip())


def _time_ago(dt):
    now = datetime.datetime.now(datetime.timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=datetime.timezone.utc)
    diff = now - dt
    s = int(diff.total_seconds())
    if s < 60:
        return "just now"
    if s < 3600:
        return f"{s // 60}m ago"
    if s < 86400:
        return f"{s // 3600}h ago"
    return f"{s // 86400}d ago"


# ─────────────────────────────────────────────────────────────────────────────
# Symptom Checker
# ─────────────────────────────────────────────────────────────────────────────

SYMPTOM_FALLBACKS = {
    "fatigue": {
        "likely_imbalance": "Vata-Kapha Imbalance — Low Ojas (Vital Energy)",
        "affected_dosha": "vata",
        "explanation": "Fatigue in Ayurveda often signals depleted Ojas (vital essence) and weakened Agni (digestive fire). Vata imbalance disrupts the nervous system while Kapha accumulation creates heaviness and lethargy.",
        "home_remedies": [
            {"remedy": "Ashwagandha Milk", "instructions": "Mix 1 tsp Ashwagandha powder in warm milk with honey and cardamom", "frequency": "Every night before bed"},
            {"remedy": "Ginger-Lemon Morning Tonic", "instructions": "Squeeze half a lemon into warm water with a slice of fresh ginger and a pinch of rock salt", "frequency": "Every morning on empty stomach"},
            {"remedy": "Sesame Oil Abhyanga", "instructions": "Warm sesame oil and massage entire body for 10-15 minutes before bathing", "frequency": "3-4 times per week"},
        ],
        "herbs_to_try": ["Ashwagandha", "Shatavari", "Triphala"],
        "lifestyle_tips": ["Maintain consistent sleep and wake times", "Eat warm, nourishing meals at regular intervals", "Practice 10 minutes of Pranayama (Nadi Shodhana) daily"],
        "dietary_advice": "Favor warm, cooked, easily digestible foods. Include ghee, sesame seeds, dates, and warm soups. Avoid cold, raw, and processed foods that dampen digestive fire.",
        "when_to_see_doctor": "If fatigue persists for more than 2 weeks, is accompanied by unexplained weight loss, fever, or shortness of breath.",
        "disclaimer": "This is not medical advice. AyurWell provides general Ayurvedic wellness guidance only. Always consult a qualified healthcare provider for medical concerns.",
    },
    "bloating": {
        "likely_imbalance": "Vata Imbalance — Disturbed Apana Vayu",
        "affected_dosha": "vata",
        "explanation": "Bloating and gas are classic signs of Vata imbalance in the colon, specifically disturbed Apana Vayu (downward-moving energy). Weak digestive fire (Agni) leads to incomplete digestion and gas formation.",
        "home_remedies": [
            {"remedy": "CCF Tea", "instructions": "Boil equal parts cumin, coriander, and fennel seeds (1 tsp each) in 2 cups water for 5 minutes, strain and drink", "frequency": "After each meal"},
            {"remedy": "Ginger Digestive Aid", "instructions": "Chew a small piece of fresh ginger with a pinch of rock salt and a squeeze of lemon before meals", "frequency": "15 minutes before each meal"},
            {"remedy": "Warm Castor Oil Compress", "instructions": "Apply warm castor oil to the abdomen and cover with a warm cloth for 20 minutes", "frequency": "Once daily in the evening"},
        ],
        "herbs_to_try": ["Fennel", "Ginger", "Triphala"],
        "lifestyle_tips": ["Eat slowly and chew thoroughly", "Avoid drinking cold water with meals", "Take a short 10-minute walk after meals"],
        "dietary_advice": "Avoid beans, raw vegetables, carbonated drinks, and cold foods. Favor warm soups, kitchari, cooked vegetables with digestive spices like cumin, ginger, and asafoetida.",
        "when_to_see_doctor": "If bloating is severe, persistent, accompanied by pain, blood in stool, or significant weight loss.",
        "disclaimer": "This is not medical advice. AyurWell provides general Ayurvedic wellness guidance only. Always consult a qualified healthcare provider for medical concerns.",
    },
    "headache": {
        "likely_imbalance": "Pitta Imbalance — Excess Heat in the Head",
        "affected_dosha": "pitta",
        "explanation": "Headaches in Ayurveda most commonly indicate Pitta imbalance with excess heat accumulating in the head and neck region. Vata-type headaches are throbbing and related to tension, while Pitta headaches are burning and intense.",
        "home_remedies": [
            {"remedy": "Brahmi Oil Head Massage", "instructions": "Warm Brahmi or coconut oil and gently massage the scalp, temples, and back of neck for 10 minutes", "frequency": "Daily or at onset of headache"},
            {"remedy": "Sandalwood Paste", "instructions": "Mix sandalwood powder with rose water to form a paste and apply to forehead and temples", "frequency": "At onset of headache, leave for 20 minutes"},
            {"remedy": "Peppermint-Ginger Tea", "instructions": "Steep fresh peppermint leaves and a slice of ginger in hot water for 5 minutes", "frequency": "2-3 times daily during headache"},
        ],
        "herbs_to_try": ["Brahmi", "Shankhpushpi", "Shatavari"],
        "lifestyle_tips": ["Avoid direct sun exposure and overheating", "Practice Sheetali pranayama (cooling breath)", "Reduce screen time and eye strain"],
        "dietary_advice": "Avoid spicy, sour, and fermented foods. Favor cooling foods like cucumber, coconut water, coriander, and mint. Stay well hydrated with room-temperature water.",
        "when_to_see_doctor": "If headache is sudden and severe ('thunderclap'), accompanied by fever, stiff neck, vision changes, or neurological symptoms.",
        "disclaimer": "This is not medical advice. AyurWell provides general Ayurvedic wellness guidance only. Always consult a qualified healthcare provider for medical concerns.",
    },
    "anxiety": {
        "likely_imbalance": "Vata Imbalance — Disturbed Prana Vayu",
        "affected_dosha": "vata",
        "explanation": "Anxiety and worry are hallmark signs of aggravated Vata dosha, particularly disturbed Prana Vayu (life force in the mind). Excess Vata creates mental instability, fear, and racing thoughts.",
        "home_remedies": [
            {"remedy": "Ashwagandha Tonic", "instructions": "Mix 1 tsp Ashwagandha powder in warm milk with honey before bed", "frequency": "Nightly"},
            {"remedy": "Brahmi Tea", "instructions": "Steep 1 tsp dried Brahmi leaves in hot water for 5 minutes, add honey", "frequency": "Morning and evening"},
            {"remedy": "Warm Oil Head Massage", "instructions": "Massage warm sesame or Brahmi oil into scalp and temples for 10 minutes", "frequency": "Daily before shower"},
        ],
        "herbs_to_try": ["Ashwagandha", "Brahmi", "Jatamansi"],
        "lifestyle_tips": ["Practice Nadi Shodhana pranayama for 10 minutes daily", "Establish a grounding morning routine", "Limit caffeine and screen time before bed"],
        "dietary_advice": "Eat warm, grounding, nourishing foods. Favor sweet, sour, and salty tastes. Include ghee, warm milk, root vegetables, and whole grains. Avoid stimulants.",
        "when_to_see_doctor": "If anxiety is severe, persistent, interfering with daily life, or accompanied by panic attacks or physical symptoms.",
        "disclaimer": "This is not medical advice. AyurWell provides general Ayurvedic wellness guidance only. Always consult a qualified healthcare provider for medical concerns.",
    },
    "default": {
        "likely_imbalance": "General Dosha Imbalance",
        "affected_dosha": "vata",
        "explanation": "Your symptoms suggest a general imbalance that may be affecting your digestive fire (Agni) and overall vitality (Ojas). Ayurveda recommends returning to foundational practices to restore balance.",
        "home_remedies": [
            {"remedy": "Triphala Tonic", "instructions": "Mix 1 tsp Triphala powder in warm water and drink", "frequency": "Before bed daily"},
            {"remedy": "Golden Milk", "instructions": "Mix 1 tsp turmeric, pinch of black pepper, and honey in warm milk", "frequency": "Once daily"},
            {"remedy": "Warm Water Therapy", "instructions": "Sip warm water throughout the day — start morning with 2 glasses of warm water", "frequency": "Throughout the day"},
        ],
        "herbs_to_try": ["Triphala", "Ashwagandha", "Tulsi"],
        "lifestyle_tips": ["Establish a consistent daily routine (Dinacharya)", "Eat meals at the same time each day", "Get 7-8 hours of sleep at consistent times"],
        "dietary_advice": "Favor warm, freshly cooked, easily digestible foods. Eat your largest meal at noon. Avoid processed, cold, and leftover foods.",
        "when_to_see_doctor": "If symptoms persist for more than 1-2 weeks, worsen significantly, or are accompanied by fever, severe pain, or other concerning symptoms.",
        "disclaimer": "This is not medical advice. AyurWell provides general Ayurvedic wellness guidance only. Always consult a qualified healthcare provider for medical concerns.",
    },
}


@extend_schema(
    tags=["symptoms"],
    summary="Analyze symptoms",
    description=(
        "AI-powered Ayurvedic symptom analysis using Claude. "
        "Returns dosha imbalance, home remedies, herbs, lifestyle tips, and dietary advice. "
        "Falls back to curated data when AI is unavailable. Rate limited to 10/hour per user."
    ),
    request=inline_serializer("SymptomAnalyzeRequest", fields={
        "symptoms": s.ListField(child=s.CharField(), help_text="List of symptom strings"),
        "duration": s.ChoiceField(choices=["today", "2-3 days", "1 week", "2+ weeks"], required=False),
        "severity": s.IntegerField(min_value=1, max_value=5, required=False),
        "affected_area": s.CharField(required=False, allow_blank=True),
        "user_dosha": s.CharField(required=False, allow_blank=True),
    }),
    responses={
        200: inline_serializer("SymptomAnalyzeResponse", fields={
            "likely_imbalance": s.CharField(),
            "affected_dosha": s.ChoiceField(choices=["vata", "pitta", "kapha"]),
            "explanation": s.CharField(),
            "home_remedies": s.ListField(),
            "herbs_to_try": s.ListField(child=s.CharField()),
            "lifestyle_tips": s.ListField(child=s.CharField()),
            "dietary_advice": s.CharField(),
            "when_to_see_doctor": s.CharField(),
            "disclaimer": s.CharField(),
        }),
        400: inline_serializer("SymptomError", fields={"detail": s.CharField()}),
    },
    examples=[
        OpenApiExample(
            "Fatigue example",
            value={"symptoms": ["fatigue", "low energy"], "duration": "1 week", "severity": 3, "user_dosha": "vata"},
            request_only=True,
        ),
    ],
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def symptoms_analyze(request):
    rl = apply_rate_limit(request, "symptoms", 10, 3600)
    if rl:
        return rl
    user = request.user
    # Sanitize all inputs
    raw_symptoms = request.data.get("symptoms", [])
    symptoms = sanitize_list(raw_symptoms, max_items=15, max_item_length=100)
    duration = sanitize_text(request.data.get("duration", ""), max_length=20)
    severity = validate_severity(request.data.get("severity", 3))
    affected_area = sanitize_text(request.data.get("affected_area", ""), max_length=200)
    user_dosha = sanitize_text(request.data.get("user_dosha", ""), max_length=20)

    if not symptoms:
        return Response({"detail": "At least one symptom is required."}, status=400)

    system_prompt = (
        "You are an Ayurvedic health advisor. Based on symptoms, suggest Ayurvedic remedies, "
        "lifestyle changes, and herbs. ALWAYS include the disclaimer. Never diagnose diseases. "
        "Return ONLY valid JSON with no extra text:\n"
        '{"likely_imbalance": "string", '
        '"affected_dosha": "vata|pitta|kapha", '
        '"explanation": "string (2-3 sentences)", '
        '"home_remedies": [{"remedy": "string", "instructions": "string", "frequency": "string"}] (max 3), '
        '"herbs_to_try": ["herb_name"] (max 3), '
        '"lifestyle_tips": ["string"] (max 3), '
        '"dietary_advice": "string", '
        '"when_to_see_doctor": "string", '
        '"disclaimer": "This is not medical advice. AyurWell provides general Ayurvedic wellness guidance only. Always consult a qualified healthcare provider for medical concerns."}'
    )

    user_message = (
        f"Symptoms: {', '.join(symptoms)}. "
        f"Duration: {duration}. "
        f"Severity: {severity}/5. "
        f"Affected area: {affected_area or 'not specified'}. "
        f"User dosha: {user_dosha or 'unknown'}."
    )

    text, error = _call_claude(system_prompt, user_message, max_tokens=900)

    if error == "no_api_key" or text is None:
        # Pick best fallback based on first symptom
        symptom_lower = symptoms[0].lower() if symptoms else ""
        result = None
        for key in SYMPTOM_FALLBACKS:
            if key != "default" and key in symptom_lower:
                result = SYMPTOM_FALLBACKS[key]
                break
        if result is None:
            result = SYMPTOM_FALLBACKS["default"]
    else:
        try:
            result = _parse_json_response(text)
        except Exception:
            symptom_lower = symptoms[0].lower() if symptoms else ""
            result = None
            for key in SYMPTOM_FALLBACKS:
                if key != "default" and key in symptom_lower:
                    result = SYMPTOM_FALLBACKS[key]
                    break
            if result is None:
                result = SYMPTOM_FALLBACKS["default"]

    # Ensure disclaimer is always present
    result["disclaimer"] = (
        "This is not medical advice. AyurWell provides general Ayurvedic wellness guidance only. "
        "Always consult a qualified healthcare provider for medical concerns."
    )

    # Save to DB
    SymptomCheck.objects.create(
        user=user,
        symptoms_json=symptoms,
        result_json=result,
    )

    return Response(result)


@extend_schema(
    tags=["symptoms"],
    summary="Get symptom check history",
    description="Returns the user's last 20 symptom checks.",
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def symptoms_history(request):
    checks = SymptomCheck.objects.filter(user=request.user)[:20]
    return Response([
        {
            "id": c.id,
            "symptoms": c.symptoms_json,
            "result": c.result_json,
            "date": c.date.isoformat(),
        }
        for c in checks
    ])


# ─────────────────────────────────────────────────────────────────────────────
# Community Feed
# ─────────────────────────────────────────────────────────────────────────────

def _serialize_post(post, request_user=None):
    liked = False
    if request_user and request_user.is_authenticated:
        liked = Like.objects.filter(user=request_user, post=post).exists()
    post_count = Post.objects.filter(user=post.user).count()
    return {
        "id": post.id,
        "user": {
            "username": post.user.username,
            "name": getattr(post.user, "first_name", "") or post.user.username,
            "initials": (getattr(post.user, "first_name", "") or post.user.username)[:2].upper(),
            "post_count": post_count,
            "is_top_contributor": post_count >= 10,
        },
        "content": post.content,
        "post_type": post.post_type,
        "dosha_tag": post.dosha_tag,
        "image_url": post.image_url,
        "likes_count": post.likes_count,
        "comments_count": post.comments.count(),
        "liked": liked,
        "created_at": post.created_at.isoformat(),
        "time_ago": _time_ago(post.created_at),
    }


@extend_schema(
    tags=["community"],
    summary="Get community feed",
    description="Paginated community feed with filters by post type and dosha tag. Returns 10 posts per page.",
    parameters=[
        OpenApiParameter("page", OpenApiTypes.INT, description="Page number (default: 1)"),
        OpenApiParameter("post_type", OpenApiTypes.STR, description="Filter by type (recipe/tip/experience/question/achievement)"),
        OpenApiParameter("dosha_tag", OpenApiTypes.STR, description="Filter by dosha (vata/pitta/kapha/all)"),
    ],
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def community_feed(request):
    qs = Post.objects.select_related("user").prefetch_related("comments")
    dosha_tag = request.query_params.get("dosha_tag", "")
    post_type = request.query_params.get("post_type", "")
    page = int(request.query_params.get("page", 1))
    page_size = 10

    if dosha_tag and dosha_tag != "all":
        qs = qs.filter(dosha_tag=dosha_tag)
    if post_type and post_type != "all":
        qs = qs.filter(post_type=post_type)

    total = qs.count()
    start = (page - 1) * page_size
    posts = qs[start: start + page_size]

    return Response({
        "count": total,
        "page": page,
        "has_next": (start + page_size) < total,
        "results": [_serialize_post(p, request.user) for p in posts],
    })


@extend_schema(
    tags=["community"],
    summary="Create a post",
    description="Creates a new community post. Content is sanitized to strip HTML.",
    request=inline_serializer("CreatePostRequest", fields={
        "content": s.CharField(),
        "post_type": s.ChoiceField(choices=["recipe", "tip", "experience", "question", "achievement"]),
        "dosha_tag": s.ChoiceField(choices=["vata", "pitta", "kapha", "all"]),
        "image_url": s.URLField(required=False, allow_blank=True),
    }),
    responses={201: inline_serializer("PostResponse", fields={
        "id": s.IntegerField(),
        "content": s.CharField(),
        "post_type": s.CharField(),
        "dosha_tag": s.CharField(),
        "likes_count": s.IntegerField(),
        "comments_count": s.IntegerField(),
        "time_ago": s.CharField(),
    })},
    examples=[
        OpenApiExample("Share a recipe", value={"content": "My favourite Vata-balancing kitchari recipe...", "post_type": "recipe", "dosha_tag": "vata"}, request_only=True),
    ],
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def community_create_post(request):
    content = sanitize_text(request.data.get("content", "").strip(), max_length=2000)
    if not content:
        return Response({"detail": "Content is required."}, status=400)

    post = Post.objects.create(
        user=request.user,
        content=content,
        post_type=request.data.get("post_type", "experience"),
        dosha_tag=request.data.get("dosha_tag", "all"),
        image_url=request.data.get("image_url") or None,
    )
    return Response(_serialize_post(post, request.user), status=201)


@extend_schema(
    tags=["community"],
    summary="Toggle like on a post",
    description="Likes or unlikes a post. Returns the new like state and count.",
    responses={200: inline_serializer("LikeResponse", fields={
        "liked": s.BooleanField(),
        "likes_count": s.IntegerField(),
    })},
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def community_like_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"detail": "Post not found."}, status=404)

    like, created = Like.objects.get_or_create(user=request.user, post=post)
    if created:
        post.likes_count += 1
        post.save(update_fields=["likes_count"])
        liked = True
    else:
        like.delete()
        post.likes_count = max(0, post.likes_count - 1)
        post.save(update_fields=["likes_count"])
        liked = False

    return Response({"liked": liked, "likes_count": post.likes_count})


@extend_schema(
    tags=["community"],
    summary="Get or add comments",
    description="GET: Returns all comments for a post. POST: Adds a new comment.",
    request=inline_serializer("AddCommentRequest", fields={"content": s.CharField()}),
)
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def community_comments(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"detail": "Post not found."}, status=404)

    if request.method == "GET":
        comments = Comment.objects.filter(post=post).select_related("user")
        return Response([
            {
                "id": c.id,
                "user": {
                    "username": c.user.username,
                    "name": getattr(c.user, "first_name", "") or c.user.username,
                    "initials": (getattr(c.user, "first_name", "") or c.user.username)[:2].upper(),
                },
                "content": c.content,
                "created_at": c.created_at.isoformat(),
                "time_ago": _time_ago(c.created_at),
            }
            for c in comments
        ])

    # POST — add comment
    content = sanitize_text(request.data.get("content", "").strip(), max_length=1000)
    if not content:
        return Response({"detail": "Content is required."}, status=400)

    comment = Comment.objects.create(user=request.user, post=post, content=content)
    return Response({
        "id": comment.id,
        "user": {
            "username": request.user.username,
            "name": getattr(request.user, "first_name", "") or request.user.username,
            "initials": (getattr(request.user, "first_name", "") or request.user.username)[:2].upper(),
        },
        "content": comment.content,
        "created_at": comment.created_at.isoformat(),
        "time_ago": "just now",
    }, status=201)


# ─────────────────────────────────────────────────────────────────────────────
# Dosha Compatibility
# ─────────────────────────────────────────────────────────────────────────────

COMPATIBILITY_DATA = {
    ("vata", "vata"): {
        "score": 72, "rating": "Good",
        "summary": "Two Vata types share a deep creative and spontaneous connection. You understand each other's need for freedom and change, but may struggle with grounding and stability together.",
        "strengths": ["Shared love of creativity and new experiences", "Deep intellectual and spiritual connection", "Mutual understanding of sensitivity and intuition"],
        "challenges": ["Both may struggle with routine and consistency", "Financial and practical matters may be neglected"],
        "meal_plan_tip": "Cook warm, grounding meals together — kitchari, root vegetable soups, and warm spiced milk. Establish regular meal times to ground your shared Vata energy.",
        "best_activities_together": ["Creative arts and music", "Travel and exploration", "Yoga and meditation retreats"],
        "communication_tip": "Both of you tend to have racing thoughts — practice active listening and slow down conversations. Write down important decisions to avoid forgetting them.",
    },
    ("vata", "pitta"): {
        "score": 85, "rating": "Excellent",
        "summary": "Vata and Pitta create a dynamic and complementary partnership. Pitta's focus and drive grounds Vata's creativity, while Vata's flexibility softens Pitta's intensity.",
        "strengths": ["Complementary strengths — creativity meets execution", "Pitta provides direction for Vata's ideas", "Vata brings lightness to Pitta's seriousness"],
        "challenges": ["Pitta's directness can overwhelm sensitive Vata", "Vata's inconsistency can frustrate goal-oriented Pitta"],
        "meal_plan_tip": "Balance warming Vata foods with cooling Pitta foods. Try coconut-based curries, cooling coriander rice, and warm but not spicy meals that satisfy both constitutions.",
        "best_activities_together": ["Hiking and nature walks", "Cooking and trying new cuisines", "Strategic games and creative projects"],
        "communication_tip": "Pitta should soften their directness, while Vata should practice following through on commitments. Schedule regular check-ins to stay aligned.",
    },
    ("vata", "kapha"): {
        "score": 78, "rating": "Good",
        "summary": "Vata and Kapha are opposites in many ways, which creates both attraction and friction. Kapha's stability grounds Vata, while Vata's energy and enthusiasm motivates Kapha.",
        "strengths": ["Kapha provides the stability and security Vata needs", "Vata brings excitement and new experiences to Kapha's life", "Natural balance of movement and stillness"],
        "challenges": ["Very different energy levels and pace of life", "Vata's need for change conflicts with Kapha's love of routine"],
        "meal_plan_tip": "Find middle ground with warm, moderately spiced meals. Avoid Kapha-heavy foods like dairy and sweets, while ensuring Vata gets enough nourishment. Lentil soups and grain bowls work well.",
        "best_activities_together": ["Gentle hiking and nature walks", "Cooking and gardening", "Community service and nurturing activities"],
        "communication_tip": "Vata should slow down and give Kapha time to process. Kapha should be open to spontaneity. Respect each other's different rhythms.",
    },
    ("pitta", "pitta"): {
        "score": 68, "rating": "Moderate",
        "summary": "Two Pitta types share incredible drive, passion, and ambition. However, two fires together can create intense heat — both in passion and conflict. Success requires conscious cooling practices.",
        "strengths": ["Shared ambition and drive toward goals", "Deep mutual respect for competence and achievement", "Passionate and intense connection"],
        "challenges": ["Power struggles and competition can arise", "Both may be too critical and demanding of each other"],
        "meal_plan_tip": "Prioritize cooling, anti-inflammatory meals together. Coconut water, cucumber salads, mint chutneys, and sweet fruits help balance the double-Pitta heat. Avoid spicy food dates.",
        "best_activities_together": ["Swimming and water sports", "Intellectual debates and learning", "Charitable and leadership activities"],
        "communication_tip": "Establish a rule: no important discussions when either person is hungry or overheated. Practice taking turns leading and following. Celebrate each other's wins generously.",
    },
    ("pitta", "kapha"): {
        "score": 82, "rating": "Excellent",
        "summary": "Pitta and Kapha form a powerful and stable partnership. Pitta's fire and drive is beautifully balanced by Kapha's calm, nurturing nature. This is one of the most complementary pairings.",
        "strengths": ["Pitta's vision combined with Kapha's endurance creates lasting success", "Kapha's patience balances Pitta's intensity", "Deep loyalty and commitment from both sides"],
        "challenges": ["Pitta may find Kapha too slow or resistant to change", "Kapha may feel overwhelmed by Pitta's high standards"],
        "meal_plan_tip": "Enjoy warming but not overly spicy meals. Pitta benefits from Kapha's love of cooking — let Kapha prepare nourishing meals while Pitta brings the spice and variety.",
        "best_activities_together": ["Building and creating together (home, business)", "Cooking and hosting gatherings", "Outdoor activities in nature"],
        "communication_tip": "Pitta should appreciate Kapha's steady support without taking it for granted. Kapha should express needs clearly rather than silently accommodating. Regular appreciation rituals strengthen this bond.",
    },
    ("kapha", "kapha"): {
        "score": 75, "rating": "Good",
        "summary": "Two Kapha types create a deeply stable, loyal, and nurturing relationship. You share a love of comfort, routine, and deep connection. The main challenge is motivating each other toward growth and change.",
        "strengths": ["Exceptional loyalty and long-term commitment", "Deep emotional understanding and empathy", "Shared love of home, family, and comfort"],
        "challenges": ["Both may resist necessary change and growth", "Risk of becoming too comfortable and stagnant together"],
        "meal_plan_tip": "Motivate each other to eat lighter, more stimulating meals. Incorporate warming spices, bitter greens, and light grains. Avoid the temptation to indulge in heavy, sweet comfort foods together.",
        "best_activities_together": ["Vigorous exercise and fitness challenges", "Travel to new places", "Learning new skills and taking classes together"],
        "communication_tip": "Gently challenge each other to step outside comfort zones. Create shared goals that require growth. Celebrate small wins to build momentum for bigger changes.",
    },
}

# Add reverse pairs
for (d1, d2), data in list(COMPATIBILITY_DATA.items()):
    if (d2, d1) not in COMPATIBILITY_DATA:
        COMPATIBILITY_DATA[(d2, d1)] = data


@extend_schema(
    tags=["compatibility"],
    summary="Check dosha compatibility",
    description=(
        "Returns a detailed compatibility analysis for two doshas. "
        "Rule-based — covers all 9 dosha pair combinations. "
        "Saves result with a shareable code."
    ),
    request=inline_serializer("CompatibilityRequest", fields={
        "dosha1": s.ChoiceField(choices=["vata", "pitta", "kapha"]),
        "dosha2": s.ChoiceField(choices=["vata", "pitta", "kapha"]),
    }),
    responses={200: inline_serializer("CompatibilityResponse", fields={
        "score": s.IntegerField(help_text="Compatibility score 60-95"),
        "rating": s.ChoiceField(choices=["Excellent", "Good", "Moderate", "Challenging"]),
        "summary": s.CharField(),
        "strengths": s.ListField(child=s.CharField()),
        "challenges": s.ListField(child=s.CharField()),
        "meal_plan_tip": s.CharField(),
        "best_activities_together": s.ListField(child=s.CharField()),
        "communication_tip": s.CharField(),
        "share_code": s.CharField(),
    })},
    examples=[
        OpenApiExample("Vata + Pitta", value={"dosha1": "vata", "dosha2": "pitta"}, request_only=True),
    ],
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def compatibility_check(request):
    dosha1 = request.data.get("dosha1", "").lower().strip()
    dosha2 = request.data.get("dosha2", "").lower().strip()

    valid = {"vata", "pitta", "kapha"}
    if dosha1 not in valid or dosha2 not in valid:
        return Response({"detail": "Invalid dosha values. Use vata, pitta, or kapha."}, status=400)

    result = COMPATIBILITY_DATA.get((dosha1, dosha2)) or COMPATIBILITY_DATA.get((dosha2, dosha1))
    if not result:
        return Response({"detail": "Compatibility data not found."}, status=404)

    # Generate share code and save
    share_code = secrets.token_urlsafe(8)
    CompatibilityResult.objects.create(
        user=request.user,
        dosha1=dosha1,
        dosha2=dosha2,
        result_json=result,
        share_code=share_code,
    )

    return Response({**result, "share_code": share_code, "dosha1": dosha1, "dosha2": dosha2})


@extend_schema(
    tags=["compatibility"],
    summary="Generate shareable link",
    description="Generates a shareable URL for a dosha compatibility result.",
    request=inline_serializer("ShareRequest", fields={
        "dosha1": s.ChoiceField(choices=["vata", "pitta", "kapha"]),
        "dosha2": s.ChoiceField(choices=["vata", "pitta", "kapha"]),
    }),
    responses={200: inline_serializer("ShareResponse", fields={
        "share_code": s.CharField(),
        "url": s.CharField(),
    })},
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def compatibility_share(request):
    dosha1 = request.data.get("dosha1", "").lower().strip()
    dosha2 = request.data.get("dosha2", "").lower().strip()
    share_code = secrets.token_urlsafe(8)

    result = COMPATIBILITY_DATA.get((dosha1, dosha2)) or COMPATIBILITY_DATA.get((dosha2, dosha1))
    if not result:
        return Response({"detail": "Invalid doshas."}, status=400)

    CompatibilityResult.objects.create(
        user=request.user,
        dosha1=dosha1,
        dosha2=dosha2,
        result_json=result,
        share_code=share_code,
    )
    return Response({"share_code": share_code, "url": f"/compatibility?you={dosha1}&friend={dosha2}"})


@extend_schema(
    tags=["compatibility"],
    summary="Get shared compatibility result",
    description="Public endpoint — retrieves a compatibility result by share code. No auth required.",
)
@api_view(["GET"])
def compatibility_invite(request, code):
    try:
        cr = CompatibilityResult.objects.get(share_code=code)
        return Response({
            **cr.result_json,
            "dosha1": cr.dosha1,
            "dosha2": cr.dosha2,
            "share_code": code,
        })
    except CompatibilityResult.DoesNotExist:
        return Response({"detail": "Not found."}, status=404)


# ─────────────────────────────────────────────────────────────────────────────
# Weekly Wellness Report
# ─────────────────────────────────────────────────────────────────────────────

def _generate_pdf(user, week_start, week_end, logs, ai_insights, dosha, streak_count, grade, avg_score):
    """Generate a multi-page wellness report PDF using ReportLab."""
    from reportlab.lib.pagesizes import A4
    from reportlab.lib import colors
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import cm
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
        HRFlowable, PageBreak,
    )
    from reportlab.lib.enums import TA_CENTER, TA_LEFT

    PRIMARY = colors.HexColor("#2D6A4F")
    PRIMARY_LIGHT = colors.HexColor("#52B788")
    ACCENT = colors.HexColor("#E9C46A")
    SURFACE = colors.HexColor("#FEFAE0")
    TEXT = colors.HexColor("#1A1A2E")
    MUTED = colors.HexColor("#6B7280")
    AMBER = colors.HexColor("#D97706")

    dosha_colors = {
        "vata": colors.HexColor("#7B9CBF"),
        "pitta": colors.HexColor("#E07A5F"),
        "kapha": colors.HexColor("#6B8F71"),
    }
    dosha_color = dosha_colors.get(dosha.lower(), PRIMARY)

    grade_colors = {
        "Excellent": colors.HexColor("#059669"),
        "Good": colors.HexColor("#0D9488"),
        "Fair": colors.HexColor("#D97706"),
        "Needs Attention": colors.HexColor("#DC2626"),
    }
    grade_color = grade_colors.get(grade, PRIMARY)

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=2*cm, leftMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm,
    )

    styles = getSampleStyleSheet()
    h1 = ParagraphStyle("H1", fontSize=26, textColor=PRIMARY, fontName="Helvetica-Bold", alignment=TA_CENTER, spaceAfter=8)
    h2 = ParagraphStyle("H2", fontSize=16, textColor=PRIMARY, fontName="Helvetica-Bold", spaceAfter=6, spaceBefore=10)
    h3 = ParagraphStyle("H3", fontSize=12, textColor=TEXT, fontName="Helvetica-Bold", spaceAfter=4, spaceBefore=6)
    body = ParagraphStyle("Body", fontSize=10, textColor=TEXT, fontName="Helvetica", spaceAfter=4, leading=14)
    muted_s = ParagraphStyle("Muted", fontSize=9, textColor=MUTED, fontName="Helvetica-Oblique", spaceAfter=3)
    center = ParagraphStyle("Center", fontSize=11, textColor=MUTED, fontName="Helvetica", alignment=TA_CENTER, spaceAfter=4)
    footer_s = ParagraphStyle("Footer", fontSize=8, textColor=MUTED, fontName="Helvetica", alignment=TA_CENTER)

    user_name = getattr(user, "first_name", "") or user.username
    week_str = f"{week_start.strftime('%B %d')} – {week_end.strftime('%B %d, %Y')}"

    story = []

    # ── PAGE 1: COVER ──────────────────────────────────────────
    story.append(Spacer(1, 2.5*cm))
    story.append(Paragraph("🌿 AyurWell", h1))
    story.append(Paragraph("Weekly Wellness Report", ParagraphStyle("Sub", fontSize=18, textColor=MUTED, fontName="Helvetica", alignment=TA_CENTER, spaceAfter=6)))
    story.append(Spacer(1, 0.8*cm))
    story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY_LIGHT))
    story.append(Spacer(1, 0.8*cm))
    story.append(Paragraph(f"Prepared for: <b>{user_name}</b>", center))
    story.append(Paragraph(f"Week of: <b>{week_str}</b>", center))
    story.append(Paragraph(f"Dosha: <b>{dosha.capitalize()}</b>  |  Current Streak: <b>{streak_count} days</b>", center))
    story.append(Spacer(1, 1.5*cm))

    # Grade badge
    grade_data = [[Paragraph(f"<b>Overall Grade: {grade}</b>", ParagraphStyle("Grade", fontSize=14, textColor=colors.white, fontName="Helvetica-Bold", alignment=TA_CENTER))]]
    grade_table = Table(grade_data, colWidths=[12*cm])
    grade_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), grade_color),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
        ("ROUNDEDCORNERS", [8]),
    ]))
    story.append(grade_table)
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph(f"Wellness Score: <b>{avg_score:.0f}/100</b>", center))
    story.append(PageBreak())

    # ── PAGE 2: WEEK AT A GLANCE ───────────────────────────────
    story.append(Paragraph("Week at a Glance", h2))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY_LIGHT))
    story.append(Spacer(1, 0.4*cm))

    if logs:
        energies = [l.get("energy", 0) for l in logs if l.get("energy")]
        sleeps = [l.get("sleep", 0) for l in logs if l.get("sleep")]
        waters = [l.get("water", 0) for l in logs if l.get("water")]
        moods = [l.get("mood", 0) for l in logs if l.get("mood")]

        avg_e = round(sum(energies) / len(energies), 1) if energies else 0
        avg_s = round(sum(sleeps) / len(sleeps), 1) if sleeps else 0
        avg_w = round(sum(waters) / len(waters)) if waters else 0
        avg_m = round(sum(moods) / len(moods), 1) if moods else 0

        metrics = [
            ("⚡ Energy", f"{avg_e}/10", "Avg daily energy"),
            ("😴 Sleep", f"{avg_s}h", "Avg nightly sleep"),
            ("💧 Water", f"{avg_w}ml", "Avg daily intake"),
            ("😊 Mood", f"{avg_m}/5", "Avg daily mood"),
        ]
        metric_data = [[
            Paragraph(f"<b>{m[0]}</b><br/><font size=18><b>{m[1]}</b></font><br/><font size=8>{m[2]}</font>", body)
            for m in metrics
        ]]
        metric_table = Table(metric_data, colWidths=[4.25*cm]*4)
        metric_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), SURFACE),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
            ("TOPPADDING", (0, 0), (-1, -1), 12),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("ROUNDEDCORNERS", [4]),
        ]))
        story.append(metric_table)
        story.append(Spacer(1, 0.6*cm))

        # 7-day log table
        story.append(Paragraph("7-Day Log", h3))
        header = ["Date", "Energy", "Sleep", "Water", "Mood"]
        rows = [header]
        for l in logs[-7:]:
            rows.append([
                l.get("date", "—"),
                f"{l.get('energy', '—')}/10",
                f"{l.get('sleep', '—')}h",
                f"{l.get('water', '—')}ml",
                f"{l.get('mood', '—')}/5",
            ])
        log_table = Table(rows, colWidths=[3.5*cm, 3*cm, 3*cm, 3*cm, 3*cm])
        log_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [SURFACE, colors.white]),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ]))
        story.append(log_table)
    else:
        story.append(Paragraph("No wellness logs found for this week.", muted_s))

    story.append(PageBreak())

    # ── PAGE 3: AI INSIGHTS ────────────────────────────────────
    story.append(Paragraph("AI Wellness Insights", h2))
    story.append(HRFlowable(width="100%", thickness=1, color=ACCENT))
    story.append(Spacer(1, 0.4*cm))
    story.append(Paragraph(f"Personalized insights for your {dosha.capitalize()} constitution:", muted_s))
    story.append(Spacer(1, 0.3*cm))

    for i, insight in enumerate(ai_insights, 1):
        story.append(Paragraph(f"<b>{i}. {insight}</b>", body))
        story.append(Spacer(1, 0.2*cm))

    story.append(PageBreak())

    # ── PAGE 4 & 5: RECOMMENDATIONS ───────────────────────────
    story.append(Paragraph("Next Week Recommendations", h2))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY_LIGHT))
    story.append(Spacer(1, 0.4*cm))

    dosha_recs = {
        "vata": [
            "Establish a consistent daily routine — wake, eat, and sleep at the same times each day to ground Vata energy.",
            "Prioritize warm, nourishing foods like kitchari, root vegetable soups, and warm herbal teas throughout the week.",
            "Practice Abhyanga (self-oil massage) with warm sesame oil 3-4 mornings before showering to calm the nervous system.",
        ],
        "pitta": [
            "Incorporate cooling foods and practices — coconut water, cucumber, mint, and moonlit walks to balance Pitta heat.",
            "Schedule at least 3 sessions of cooling exercise like swimming or evening yoga to release accumulated heat.",
            "Practice Sheetali pranayama (cooling breath) for 5 minutes each morning to calm the mind and cool the body.",
        ],
        "kapha": [
            "Start each morning with vigorous exercise for at least 20 minutes to stimulate Kapha and boost metabolism.",
            "Favor light, dry, and warming foods — reduce dairy, sweets, and heavy meals that increase Kapha sluggishness.",
            "Try dry brushing (Garshana) before your morning shower to stimulate lymphatic flow and energize the body.",
        ],
    }
    recs = dosha_recs.get(dosha.lower(), dosha_recs["vata"])
    for i, rec in enumerate(recs, 1):
        story.append(Paragraph(f"<b>Recommendation {i}:</b>", h3))
        story.append(Paragraph(rec, body))
        story.append(Spacer(1, 0.3*cm))

    story.append(Spacer(1, 1*cm))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e5e7eb")))
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph("Generated by AyurWell • Ancient Wisdom, Modern Wellness", footer_s))

    doc.build(story)
    buffer.seek(0)
    return buffer.read()


def _generate_ai_insights(user, logs, dosha):
    """Generate AI insights from wellness logs."""
    if not logs:
        return [
            f"Start logging your daily wellness metrics to receive personalized {dosha.capitalize()} insights.",
            "Consistent tracking helps identify patterns in your energy, sleep, and mood.",
            "Your first week of data will unlock detailed Ayurvedic analysis.",
        ]

    energies = [l.get("energy", 0) for l in logs if l.get("energy")]
    sleeps = [l.get("sleep", 0) for l in logs if l.get("sleep")]
    waters = [l.get("water", 0) for l in logs if l.get("water")]
    moods = [l.get("mood", 0) for l in logs if l.get("mood")]

    avg_e = round(sum(energies) / len(energies), 1) if energies else 0
    avg_s = round(sum(sleeps) / len(sleeps), 1) if sleeps else 0
    avg_w = round(sum(waters) / len(waters)) if waters else 0
    avg_m = round(sum(moods) / len(moods), 1) if moods else 0

    system_prompt = (
        "You are an Ayurvedic wellness analyst. Generate 3-4 specific, personalized insights "
        "based on the user's weekly wellness data. Each insight should be 1-2 sentences, "
        "specific to the data (mention actual numbers), and include an Ayurvedic perspective. "
        "Return ONLY a JSON array of strings: [\"insight1\", \"insight2\", \"insight3\"]"
    )
    user_message = (
        f"User dosha: {dosha}. Week data: "
        f"Avg energy: {avg_e}/10, Avg sleep: {avg_s}h, Avg water: {avg_w}ml, Avg mood: {avg_m}/5. "
        f"Daily logs: {json.dumps(logs[-7:])}"
    )

    text, error = _call_claude(system_prompt, user_message, max_tokens=400)

    if error or text is None:
        # Fallback insights
        insights = []
        if avg_e >= 7:
            insights.append(f"Your energy averaged {avg_e}/10 this week — excellent for your {dosha.capitalize()} constitution. Keep up your current morning routine.")
        else:
            insights.append(f"Your energy averaged {avg_e}/10 this week. For {dosha.capitalize()} types, try Ashwagandha milk before bed to boost Ojas (vital energy).")

        if avg_s >= 7:
            insights.append(f"You averaged {avg_s} hours of sleep — well within the Ayurvedic ideal of 7-8 hours for optimal Ojas restoration.")
        else:
            insights.append(f"Sleep averaged {avg_s}h this week. Aim for 7-8 hours — try warm milk with nutmeg and a consistent 10pm bedtime.")

        if avg_w >= 1500:
            insights.append(f"Hydration was strong at {avg_w}ml average. Warm water with lemon in the morning is especially beneficial for {dosha.capitalize()} types.")
        else:
            insights.append(f"Water intake averaged {avg_w}ml — below the 2000ml Ayurvedic recommendation. Sip warm water throughout the day.")

        return insights

    try:
        return _parse_json_response(text)
    except Exception:
        return [
            f"Your wellness data shows patterns consistent with {dosha.capitalize()} constitution.",
            "Continue tracking daily to receive more personalized insights.",
            "Focus on your Ayurvedic daily routine (Dinacharya) for optimal balance.",
        ]


@extend_schema(
    tags=["reports"],
    summary="Generate weekly wellness report",
    description=(
        "Generates a multi-page PDF wellness report for the current week. "
        "Includes AI insights from Claude, metric summaries, 7-day log table, "
        "and personalized Ayurvedic recommendations. Saves to database."
    ),
    request=inline_serializer("ReportGenerateRequest", fields={
        "logs": s.ListField(help_text="Array of daily log objects [{date, energy, sleep, water, mood}]"),
        "dosha": s.ChoiceField(choices=["vata", "pitta", "kapha"], required=False),
    }),
    responses={200: inline_serializer("ReportGenerateResponse", fields={
        "id": s.IntegerField(),
        "week_start": s.DateField(),
        "week_end": s.DateField(),
        "grade": s.ChoiceField(choices=["Excellent", "Good", "Fair", "Needs Attention"]),
        "avg_score": s.FloatField(),
        "ai_insights": s.ListField(child=s.CharField()),
        "generated_at": s.CharField(),
    })},
    examples=[
        OpenApiExample(
            "Generate report",
            value={
                "dosha": "vata",
                "logs": [
                    {"date": "Mon", "energy": 7, "sleep": 7.5, "water": 2000, "mood": 4},
                    {"date": "Tue", "energy": 6, "sleep": 8, "water": 1800, "mood": 3},
                ],
            },
            request_only=True,
        ),
    ],
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def report_generate(request):
    user = request.user
    logs = request.data.get("logs", [])  # [{date, energy, sleep, water, mood}]
    dosha = request.data.get("dosha", "vata")

    today = datetime.date.today()
    # Week starts on Monday
    week_start = today - datetime.timedelta(days=today.weekday())
    week_end = week_start + datetime.timedelta(days=6)

    # Calculate metrics
    energies = [l.get("energy", 0) for l in logs if l.get("energy")]
    sleeps = [l.get("sleep", 0) for l in logs if l.get("sleep")]
    waters = [l.get("water", 0) for l in logs if l.get("water")]
    moods = [l.get("mood", 0) for l in logs if l.get("mood")]

    avg_e = sum(energies) / len(energies) if energies else 0
    avg_s = sum(sleeps) / len(sleeps) if sleeps else 0
    avg_w = sum(waters) / len(waters) if waters else 0
    avg_m = sum(moods) / len(moods) if moods else 0

    avg_score = min(100, max(0, int(
        (avg_e / 10) * 30 + (min(avg_s, 9) / 9) * 25 +
        (min(avg_w, 2500) / 2500) * 20 + (avg_m / 5) * 25
    ))) if logs else 50

    grade = "Excellent" if avg_score >= 80 else "Good" if avg_score >= 60 else "Fair" if avg_score >= 40 else "Needs Attention"

    # Get streak
    try:
        streak = user.streak
        streak_count = streak.current_streak
    except Exception:
        streak_count = 0

    # Generate AI insights
    ai_insights = _generate_ai_insights(user, logs, dosha)

    # Generate PDF
    pdf_bytes = _generate_pdf(
        user, week_start, week_end, logs, ai_insights,
        dosha, streak_count, grade, avg_score
    )

    # Save or update report
    report, _ = WeeklyReport.objects.update_or_create(
        user=user,
        week_start=week_start,
        defaults={
            "week_end": week_end,
            "pdf_content": pdf_bytes,
            "ai_insights": ai_insights,
            "grade": grade,
            "avg_score": avg_score,
        }
    )

    return Response({
        "id": report.id,
        "week_start": week_start.isoformat(),
        "week_end": week_end.isoformat(),
        "grade": grade,
        "avg_score": avg_score,
        "ai_insights": ai_insights,
        "generated_at": report.generated_at.isoformat(),
    })


@extend_schema(
    tags=["reports"],
    summary="List weekly reports",
    description="Returns all generated weekly reports for the authenticated user, newest first.",
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def report_list(request):
    reports = WeeklyReport.objects.filter(user=request.user)
    return Response([
        {
            "id": r.id,
            "week_start": r.week_start.isoformat(),
            "week_end": r.week_end.isoformat(),
            "grade": r.grade,
            "avg_score": r.avg_score,
            "ai_insights": r.ai_insights[:3],
            "generated_at": r.generated_at.isoformat(),
        }
        for r in reports
    ])


@extend_schema(
    tags=["reports"],
    summary="Download report PDF",
    description="Streams the generated PDF for a specific weekly report as a file download.",
    responses={200: OpenApiTypes.BINARY},
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def report_download(request, report_id):
    try:
        report = WeeklyReport.objects.get(id=report_id, user=request.user)
    except WeeklyReport.DoesNotExist:
        return Response({"detail": "Report not found."}, status=404)

    if not report.pdf_content:
        return Response({"detail": "PDF not yet generated."}, status=404)

    filename = f"AyurWell-Report-{report.week_start}.pdf"
    response = HttpResponse(bytes(report.pdf_content), content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    return response
