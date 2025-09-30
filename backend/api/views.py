from django.http import HttpResponse
from django.contrib.auth import authenticate, get_user_model
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from .models import Activity


@api_view(["GET"])
def health(request):
    return Response({"status": "ok", "app": "AyurWell API"})


def index(request):
    return HttpResponse(
        "<h1>AyurWell API</h1>"
        "<p>Backend is running.</p>"
        "<ul>"
        "<li><a href='/admin/'>Admin</a></li>"
        "<li><a href='/api/health/'>API Health</a></li>"
        "</ul>",
        content_type="text/html",
    )


@api_view(["POST"])
def register(request):
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
    return Response({"token": token.key, "username": user.username, "name": user.first_name})


@api_view(["POST"])
def login(request):
    data = request.data
    username = data.get("email") or data.get("username")
    password = data.get("password")
    user = authenticate(username=username, password=password)
    if not user:
        return Response({"detail": "Invalid credentials"}, status=400)
    token, _ = Token.objects.get_or_create(user=user)
    Activity.objects.create(user=user, action="login")
    return Response({"token": token.key, "username": user.username, "name": getattr(user, "first_name", "")})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response({
        "username": user.username,
        "name": getattr(user, "first_name", ""),
        "activities": [{"action": a.action, "created_at": a.created_at.isoformat()} for a in Activity.objects.filter(user=user)[:10]],
    })

# Create your views here.
