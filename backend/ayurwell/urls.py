"""
AyurWell URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView
from django.views.generic import TemplateView
from django.http import HttpResponse

from api.views import index
from api.admin import ayurwell_admin


# ── Custom Swagger UI view (uses our branded template) ────────────────────────
def swagger_ui_view(request):
    """Serve branded Swagger UI."""
    from django.template.loader import render_to_string
    schema_url = request.build_absolute_uri("/api/schema/")
    html = render_to_string("swagger_ui.html", {"schema_url": schema_url}, request=request)
    return HttpResponse(html)


urlpatterns = [
    # Root
    path("", index, name="index"),

    # Default Django admin
    path("admin/", admin.site.urls),

    # Custom AyurWell admin site
    path("ayurwell-admin/", ayurwell_admin.urls),

    # API endpoints
    path("api/", include("api.urls")),

    # OpenAPI schema (downloadable YAML/JSON)
    path("api/schema/", SpectacularAPIView.as_view(serve_public=True), name="schema"),

    # Swagger UI — branded
    path("api/docs/", swagger_ui_view, name="swagger-ui"),

    # ReDoc — alternative clean view
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.BASE_DIR / "static")
