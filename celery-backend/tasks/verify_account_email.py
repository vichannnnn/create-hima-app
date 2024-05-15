from email_handler import send_email_verification_mail
from pydantic import EmailStr
from worker import celery_app


@celery_app.task
def send_account_verification_email_task(
        email: EmailStr, username: str, confirm_url: str
):
    try:
        send_email_verification_mail(
            sender_name="Hima-chan",
            username=username,
            from_email="do-not-reply@grail.moe",
            to_email=email,
            confirm_url=confirm_url,
        )
        return {"success": f"Verification email sent to {username}"}

    except Exception as e:
        print(str(e))
