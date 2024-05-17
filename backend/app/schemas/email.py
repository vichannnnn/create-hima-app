from pydantic import EmailStr
from app.schemas.base import CustomBaseModel as BaseModel


class SendVerificationTokenBody(BaseModel):
    email: EmailStr
    username: str
    token: str


class SendPasswordResetEmailBody(BaseModel):
    email: EmailStr


class SendNewPasswordBody(BaseModel):
    token: str


class VerifyEmailBody(BaseModel):
    token: str


class AccountUpdateEmailBody(BaseModel):
    new_email: EmailStr  # type: ignore
