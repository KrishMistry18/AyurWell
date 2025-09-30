import os
import django


def main() -> None:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ayurwell.settings")
    django.setup()

    from django.contrib.auth import get_user_model

    User = get_user_model()
    username = "krish@2005"
    password = "krish@2005"
    email = "krish2005@example.com"

    user, created = User.objects.get_or_create(
        username=username, defaults={"email": email}
    )
    user.is_superuser = True
    user.is_staff = True
    user.set_password(password)
    user.save()
    print("created" if created else "updated")


if __name__ == "__main__":
    main()


