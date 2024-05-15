from email_handler import send_new_password_mail
from pydantic import EmailStr
from worker import celery_app


@celery_app.task
def send_new_password_email_task(email: EmailStr, username: str, password: str):
    try:
        send_new_password_mail(
            sender_name="Hima-chan",
            username=username,
            from_email="do-not-reply@grail.moe",
            to_email=email,
            password=password,
        )
        return {"success": f"New password email sent to {username}"}

    except Exception as e:
        print(str(e))
