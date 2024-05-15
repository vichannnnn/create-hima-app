from pydantic import EmailStr
from app.schemas.base import CustomBaseModel as BaseModel


class SendVerificationTokenSchema(BaseModel):
    email: EmailStr
    username: str
    token: str


class SendPasswordResetEmailSchema(BaseModel):
    email: EmailStr


class SendNewPasswordSchema(BaseModel):
    token: str


class VerifyEmailSchema(BaseModel):
    token: str


class AccountUpdateEmailSchema(BaseModel):
    new_email: EmailStr  # type: ignore
