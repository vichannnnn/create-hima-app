from app.api.deps import CurrentSession, SessionUser
from app.models.user import Account
from app.schemas.user import (
    AccountRegisterSchema,
    CurrentUserSchema,
    AuthSchema,
)
from fastapi import APIRouter, Response

router = APIRouter()


@router.post("/create", response_model=CurrentUserSchema)
async def create_account(
    session: CurrentSession,
    data: AccountRegisterSchema,
    response: Response,
) -> CurrentUserSchema:
    created_user = await Account.register(session, data, response)
    return created_user


@router.get("/get")
async def get_account_name(
    current_user: SessionUser,
):
    return current_user


@router.post("/login", response_model=CurrentUserSchema)
async def user_login(
    session: CurrentSession, data: AuthSchema, response: Response
) -> CurrentUserSchema:
    res = await Account.login(session, data, response)
    return res
