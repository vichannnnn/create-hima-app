from app.api.deps import CurrentSession, SessionUser
from app.models.user import Account
from app.schemas.user import (
    AccountRegisterSchema,
    CurrentUserSchema,
    AuthSchema,
    CurrentUserWithJWTSchema,
)
from fastapi import APIRouter

router = APIRouter()


@router.post("/create", response_model=CurrentUserWithJWTSchema)
async def create_account(
        session: CurrentSession,
        data: AccountRegisterSchema,
) -> CurrentUserWithJWTSchema:
    created_user = await Account.register(session, data)
    return created_user


@router.get("/get", response_model=CurrentUserSchema)
async def get_account_name(
        current_user: SessionUser,
) -> CurrentUserSchema:
    return current_user


@router.post("/login", response_model=CurrentUserWithJWTSchema)
async def user_login(
        session: CurrentSession, data: AuthSchema
) -> CurrentUserWithJWTSchema:
    res = await Account.login(session, data)
    return res
