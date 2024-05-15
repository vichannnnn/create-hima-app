from pydantic import BaseModel, EmailStr


class RegisterAccountVerificationEmailRequest(BaseModel):
    email: EmailStr
    username: str
    confirm_url: str


class ResetPasswordEmailRequest(BaseModel):
    email: EmailStr
    username: str
    confirm_url: str


class NewPasswordEmailRequest(BaseModel):
    email: EmailStr
    username: str
    password: str
