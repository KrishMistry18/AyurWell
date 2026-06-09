"""
AyurWell Security Checklist Management Command
Run: python manage.py check_security
"""
import os
import sys
from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = "Validates security configuration and prints a checklist"

    # ANSI colors
    GREEN = "\033[92m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    CYAN = "\033[96m"
    BOLD = "\033[1m"
    RESET = "\033[0m"

    def ok(self, msg):
        self.stdout.write(f"  {self.GREEN}✓{self.RESET}  {msg}")

    def fail(self, msg):
        self.stdout.write(f"  {self.RED}✗{self.RESET}  {msg}")
        self._failures += 1

    def warn(self, msg):
        self.stdout.write(f"  {self.YELLOW}⚠{self.RESET}  {msg}")
        self._warnings += 1

    def section(self, title):
        self.stdout.write(f"\n{self.BOLD}{self.CYAN}── {title} {'─' * (50 - len(title))}{self.RESET}")

    def handle(self, *args, **options):
        self._failures = 0
        self._warnings = 0

        self.stdout.write(f"\n{self.BOLD}🌿 AyurWell Security Checklist{self.RESET}")
        self.stdout.write("=" * 55)

        # ── Environment Variables ─────────────────────────────
        self.section("Environment Variables")

        required_vars = {
            "SECRET_KEY": "Django secret key",
            "ANTHROPIC_API_KEY": "Claude AI API key",
        }
        optional_vars = {
            "DEBUG": "Debug mode (should be False in production)",
            "ALLOWED_HOSTS": "Allowed hosts",
            "CORS_ALLOWED_ORIGINS": "CORS allowed origins",
            "AUDIT_LOG_ENABLED": "Audit logging",
        }

        for var, desc in required_vars.items():
            val = os.environ.get(var) or getattr(settings, var, "")
            if val and val != f"your-{var.lower().replace('_', '-')}-here":
                self.ok(f"{var} — {desc}")
            else:
                self.fail(f"{var} — {desc} (NOT SET or using placeholder)")

        for var, desc in optional_vars.items():
            val = os.environ.get(var) or str(getattr(settings, var, ""))
            if val:
                self.ok(f"{var} = {val[:40]} — {desc}")
            else:
                self.warn(f"{var} — {desc} (not set, using default)")

        # ── Django Security Settings ──────────────────────────
        self.section("Django Security Settings")

        if not settings.DEBUG:
            self.ok("DEBUG = False")
        else:
            self.warn("DEBUG = True (set to False in production)")

        secret = getattr(settings, "SECRET_KEY", "")
        if len(secret) >= 50 and "insecure" not in secret:
            self.ok("SECRET_KEY is strong")
        else:
            self.fail("SECRET_KEY is weak or uses default insecure value")

        allowed = getattr(settings, "ALLOWED_HOSTS", [])
        if "*" not in allowed:
            self.ok(f"ALLOWED_HOSTS is restricted: {allowed}")
        else:
            self.warn("ALLOWED_HOSTS = ['*'] — restrict in production")

        if getattr(settings, "SECURE_CONTENT_TYPE_NOSNIFF", False):
            self.ok("SECURE_CONTENT_TYPE_NOSNIFF = True")
        else:
            self.fail("SECURE_CONTENT_TYPE_NOSNIFF not set")

        if getattr(settings, "X_FRAME_OPTIONS", "") == "DENY":
            self.ok("X_FRAME_OPTIONS = DENY")
        else:
            self.fail("X_FRAME_OPTIONS not set to DENY")

        # ── Security Headers ──────────────────────────────────
        self.section("Security Headers Middleware")

        headers = getattr(settings, "SECURITY_HEADERS", {})
        expected = [
            "X-Content-Type-Options",
            "X-Frame-Options",
            "X-XSS-Protection",
            "Referrer-Policy",
            "Permissions-Policy",
        ]
        for h in expected:
            if h in headers:
                self.ok(f"{h}: {headers[h]}")
            else:
                self.fail(f"{h} — missing from SECURITY_HEADERS")

        # ── Middleware ────────────────────────────────────────
        self.section("Middleware")

        middleware = getattr(settings, "MIDDLEWARE", [])
        checks = {
            "corsheaders.middleware.CorsMiddleware": "CORS middleware",
            "api.middleware.AuditLogMiddleware": "Audit log middleware",
            "django.middleware.security.SecurityMiddleware": "Security middleware",
        }
        for mw, desc in checks.items():
            if mw in middleware:
                self.ok(f"{desc} ({mw.split('.')[-1]})")
            else:
                self.fail(f"{desc} — {mw} not in MIDDLEWARE")

        # ── Installed Apps ────────────────────────────────────
        self.section("Installed Apps")

        apps = getattr(settings, "INSTALLED_APPS", [])
        required_apps = {
            "rest_framework": "Django REST Framework",
            "corsheaders": "CORS headers",
            "drf_spectacular": "OpenAPI documentation",
        }
        for app, desc in required_apps.items():
            if app in apps:
                self.ok(f"{desc} ({app})")
            else:
                self.fail(f"{desc} — {app} not in INSTALLED_APPS")

        # ── Rate Limiting ─────────────────────────────────────
        self.section("Rate Limiting")

        cache_backend = settings.CACHES.get("default", {}).get("BACKEND", "")
        if cache_backend:
            self.ok(f"Cache backend configured: {cache_backend.split('.')[-1]}")
        else:
            self.fail("No cache backend configured (required for rate limiting)")

        # Check rate limit decorators are importable
        try:
            from api.security import rl_login, rl_register, rl_coach_chat, rl_symptoms
            self.ok("Rate limit decorators importable (login, register, coach, symptoms)")
        except ImportError as e:
            self.fail(f"Rate limit decorators import failed: {e}")

        # ── Input Sanitization ────────────────────────────────
        self.section("Input Sanitization")

        try:
            import bleach
            self.ok(f"bleach {bleach.__version__} installed — HTML sanitization active")
        except ImportError:
            self.warn("bleach not installed — using regex fallback for HTML stripping")

        # ── Database ──────────────────────────────────────────
        self.section("Database")

        db = settings.DATABASES.get("default", {})
        engine = db.get("ENGINE", "")
        if "sqlite" in engine:
            self.warn("Using SQLite — switch to PostgreSQL for production")
        elif "postgresql" in engine or "postgres" in engine:
            self.ok("Using PostgreSQL")
        else:
            self.ok(f"Database engine: {engine}")

        # ── API Documentation ─────────────────────────────────
        self.section("API Documentation")

        spectacular = getattr(settings, "SPECTACULAR_SETTINGS", {})
        if spectacular.get("TITLE"):
            self.ok(f"drf-spectacular configured: {spectacular['TITLE']} v{spectacular.get('VERSION', '?')}")
            if not spectacular.get("SERVE_INCLUDE_SCHEMA", True):
                self.ok("Schema endpoint requires explicit URL (SERVE_INCLUDE_SCHEMA=False)")
        else:
            self.warn("drf-spectacular not configured")

        # ── Summary ───────────────────────────────────────────
        self.stdout.write("\n" + "=" * 55)
        if self._failures == 0 and self._warnings == 0:
            self.stdout.write(f"{self.GREEN}{self.BOLD}✓ All checks passed! AyurWell is production-ready.{self.RESET}\n")
        elif self._failures == 0:
            self.stdout.write(
                f"{self.YELLOW}{self.BOLD}⚠ {self._warnings} warning(s) — review before production deployment.{self.RESET}\n"
            )
        else:
            self.stdout.write(
                f"{self.RED}{self.BOLD}✗ {self._failures} failure(s), {self._warnings} warning(s) — fix before production.{self.RESET}\n"
            )

        self.stdout.write(f"\n{self.BOLD}Quick start:{self.RESET}")
        self.stdout.write("  1. Copy .env.example → .env and fill in values")
        self.stdout.write("  2. Set DEBUG=False and a strong SECRET_KEY")
        self.stdout.write("  3. Set ALLOWED_HOSTS to your domain")
        self.stdout.write("  4. Run: python manage.py migrate")
        self.stdout.write("  5. Run: python manage.py collectstatic")
        self.stdout.write("  6. API docs: http://localhost:8000/api/docs/\n")

        if self._failures > 0:
            sys.exit(1)
