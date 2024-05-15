import os
from celery import Celery
from fastapi import APIRouter
from app.schemas.email import (
    RegisterAccountVerificationEmailRequest,
    ResetPasswordEmailRequest,
    NewPasswordEmailRequest,
)

router = APIRouter()
celery_app = Celery(__name__, broker=os.environ.get("REDIS_BROKER_URL"))


@router.post("/send_account_verification")
async def register_account_verification_email(
    data: RegisterAccountVerificationEmailRequest,
):
    celery_app.send_task(
        "tasks.verify_account_email.send_account_verification_email_task",
        args=[data.email, data.username, data.confirm_url],
    )


@router.post("/send_reset_password")
async def send_reset_password_email(data: ResetPasswordEmailRequest):
    celery_app.send_task(
        "tasks.reset_password_email.send_reset_password_email_task",
        args=[data.email, data.username, data.confirm_url],
    )


@router.post("/send_new_password")
async def send_new_password_email(
    data: NewPasswordEmailRequest,
):
    celery_app.send_task(
        "tasks.new_password_email.send_new_password_email_task",
        args=[data.email, data.username, data.password],
    )
