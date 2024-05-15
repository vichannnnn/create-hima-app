from app.models.user import Account
from app.schemas.email import (
    AccountUpdateEmailSchema,
    VerifyEmailSchema,
    SendPasswordResetEmailSchema,
    SendNewPasswordSchema,
)
from app.api.deps import CurrentSession, SessionUser
from fastapi import APIRouter, status

router = APIRouter()


@router.post("/update_email")
async def user_update_email(
    session: CurrentSession,
    authenticated: SessionUser,
    data: AccountUpdateEmailSchema,
):
    credentials = await Account.update_email(session, authenticated.user_id, data)
    return credentials


@router.post("/verify")
async def verify_email(session: CurrentSession, data: VerifyEmailSchema):
    await Account.verify_email(session, data.token)
    return status.HTTP_200_OK


@router.post("/resend_email_verification_token")
async def resend_verify_email_token(
    session: CurrentSession,
    authenticated: SessionUser,
):
    await Account.resend_email_verification_token(session, authenticated.user_id)
    return status.HTTP_200_OK


@router.post("/send_reset_password_mail")
async def send_reset_password_mail(
    session: CurrentSession,
    data: SendPasswordResetEmailSchema,
):
    await Account.send_reset_email(session, data.email)
    return status.HTTP_200_OK


@router.post("/reset_password")
async def reset_password(
    session: CurrentSession,
    data: SendNewPasswordSchema,
):
    await Account.reset_password(session, data.token)
    return status.HTTP_200_OK
