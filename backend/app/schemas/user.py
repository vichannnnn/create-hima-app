import datetime
from typing import Optional, Annotated

from app.schemas.base import CustomBaseModel as BaseModel
from app.enum.role import UserRole
from pydantic import StringConstraints, EmailStr

valid_username = Annotated[
    str, StringConstraints(strip_whitespace=True, pattern="^[a-zA-Z0-9]{4," "20}$")
]
valid_password = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True, pattern=r"^(?=.*[A-Z])(?=.*\W)[^\s]{8,20}$"
    ),
]


class AccountRegisterSchema(BaseModel):
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "username": "hima",
                    "password": "Password123@",
                    "repeat_password": "Password123@",
                    "email": "violet@himaa.me",
                }
            ]
        },
    }

    username: valid_username  # type: ignore
    password: valid_password  # type: ignore
    repeat_password: valid_password  # type: ignore
    email: EmailStr


class AccountCreateSchema(BaseModel):
    username: valid_username  # type: ignore
    password: str


class AccountCredentialsSchema(AccountCreateSchema):
    user_id: int


class AccountUpdatePasswordSchema(BaseModel):
    before_password: Optional[valid_password]  # type: ignore
    password: Optional[valid_password]  # type: ignore
    repeat_password: Optional[valid_password]  # type: ignore


class AccountSchema(AccountRegisterSchema):
    user_id: Optional[int]
    repeat_password: Optional[str]


class CurrentUserSchema(BaseModel):
    user_id: int
    username: valid_username  # type: ignore
    role: UserRole


class AuthSchema(BaseModel):
    model_config = {
        "json_schema_extra": {
            "examples": [{"username": "hima", "password": "Password123@"}]
        },
    }
    username: valid_username  # type: ignore
    password: valid_password  # type: ignore


class UserProfile(BaseModel):
    user_id: int
    username: str
    role: UserRole
    date_joined: datetime.datetime
    last_login_date: datetime.datetime
