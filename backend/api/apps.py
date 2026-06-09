from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # Apply OpenAPI schema metadata to all views
        try:
            from .schema_registry import apply_schemas
            apply_schemas()
        except Exception:
            pass  # Never let schema registration break startup
