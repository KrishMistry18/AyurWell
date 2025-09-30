from django.db import models
from django.contrib.auth import get_user_model


class Activity(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="activities")
    action = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.user} - {self.action} @ {self.created_at:%Y-%m-%d %H:%M:%S}"

# Create your models here.
