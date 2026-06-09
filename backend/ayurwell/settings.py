"""
Django settings for AyurWell project.
"""

from pathlib import Path
from decouple import config, Csv
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# ── Secrets (read from .env, fall back to env vars) ───────────────────────────
SECRET_KEY = config(
    "SECRET_KEY",
    default="django-insecure-0v=-8@*ahgr&bof-2v#f8_#9!i_m%mh04_hs5_t%dsvtmbhpmz",
)
ANTHROPIC_API_KEY = config("ANTHROPIC_API_KEY", default="")
DEBUG = config("DEBUG", default=True, cast=bool)
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="*", cast=Csv())

# ── Application definition ────────────────────────────────────────────────────
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "drf_spectacular",
    # Local
    "api",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    # AyurWell custom middleware
    "api.middleware.SecurityHeadersMiddleware",
    "api.middleware.AuditLogMiddleware",
]

ROOT_URLCONF = "ayurwell.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "ayurwell.wsgi.application"

# ── Database ──────────────────────────────────────────────────────────────────
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ── Auth ──────────────────────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ── i18n ──────────────────────────────────────────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ── Static files ──────────────────────────────────────────────────────────────
STATIC_URL = "static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ── CORS ──────────────────────────────────────────────────────────────────────
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS",
    default="http://localhost:8080,http://localhost:8081,http://localhost:5173",
    cast=Csv(),
)

# ── REST Framework ────────────────────────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_AUTHENTICATION_CLASSES": ["rest_framework.authentication.TokenAuthentication"],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

# ── drf-spectacular (OpenAPI / Swagger) ───────────────────────────────────────
SPECTACULAR_SETTINGS = {
    "TITLE": "AyurWell API",
    "DESCRIPTION": (
        "## Personalized Ayurvedic Wellness Platform API\n\n"
        "Built for national hackathon. Provides endpoints for dosha assessment, "
        "personalized diet generation, AI-powered wellness coaching, symptom analysis, "
        "community features, and weekly wellness reports.\n\n"
        "### Authentication\n"
        "Most endpoints require a Token in the `Authorization` header:\n"
        "```\nAuthorization: Token <your-token>\n```\n\n"
        "Obtain a token via `POST /api/auth/login/` or `POST /api/auth/register/`.\n\n"
        "### Rate Limits\n"
        "- Login: 5/min per IP\n"
        "- Register: 3/min per IP\n"
        "- AI Coach: 20/hour per user\n"
        "- Symptom Analysis: 10/hour per user\n"
        "- General: 100/min per user"
    ),
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "CONTACT": {"name": "AyurWell Team", "email": "team@ayurwell.com"},
    "LICENSE": {"name": "MIT"},
    "TAGS": [
        {"name": "auth", "description": "Register, login, and manage user sessions"},
        {"name": "dosha", "description": "Dosha assessment, onboarding, and profile"},
        {"name": "diet", "description": "AI-powered personalized diet plan generation and meal swaps"},
        {"name": "analytics", "description": "Wellness tracking — energy, sleep, water, mood logs"},
        {"name": "coach", "description": "AI Ayurvedic wellness coaching (powered by Claude)"},
        {"name": "tips", "description": "Seasonal Ayurvedic wellness tips"},
        {"name": "pulse", "description": "Daily wellness pulse check and scoring"},
        {"name": "herbs", "description": "Ayurvedic herb encyclopedia"},
        {"name": "gamification", "description": "Streaks, badges, and achievements"},
        {"name": "symptoms", "description": "AI-powered Ayurvedic symptom analysis"},
        {"name": "community", "description": "Community feed — posts, likes, comments"},
        {"name": "compatibility", "description": "Dosha compatibility checker"},
        {"name": "reports", "description": "Weekly wellness reports with PDF export"},
        {"name": "admin", "description": "Staff-only audit logs and admin endpoints"},
    ],
    "SWAGGER_UI_SETTINGS": {
        "deepLinking": True,
        "persistAuthorization": True,
        "displayOperationId": False,
        "defaultModelsExpandDepth": 1,
        "defaultModelExpandDepth": 2,
        "docExpansion": "list",
        "filter": True,
        "tryItOutEnabled": True,
    },
    "SERVE_PUBLIC": True,
    "SWAGGER_UI_FAVICON_HREF": "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f33f.svg",
    "COMPONENT_SPLIT_REQUEST": True,
    "SORT_OPERATIONS": False,
    "ENUM_GENERATE_CHOICE_DESCRIPTION": True,
    "ENUM_NAME_OVERRIDES": {
        "DoshaEnum": ["vata", "pitta", "kapha"],
        "DoshaTagEnum": ["vata", "pitta", "kapha", "all"],
        "PostTypeEnum": ["recipe", "tip", "experience", "question", "achievement"],
        "GradeEnum": ["Excellent", "Good", "Fair", "Needs Attention"],
        "SeverityEnum": ["info", "warning", "error"],
    },
    "POSTPROCESSING_HOOKS": [
        "drf_spectacular.hooks.postprocess_schema_enums",
    ],
    "DISABLE_ERRORS_AND_WARNINGS": False,
}

# ── Security Headers ──────────────────────────────────────────────────────────
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_BROWSER_XSS_FILTER = True

# Custom security headers added via middleware
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}

# ── Rate Limiting ─────────────────────────────────────────────────────────────
RATELIMIT_USE_CACHE = "default"
RATELIMIT_FAIL_OPEN = False

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "ayurwell-ratelimit",
    }
}

# ── Audit Logging ─────────────────────────────────────────────────────────────
AUDIT_LOG_ENABLED = config("AUDIT_LOG_ENABLED", default=True, cast=bool)
AUDIT_LOG_SKIP_PATHS = ["/api/health/", "/static/", "/admin/jsi18n/"]
