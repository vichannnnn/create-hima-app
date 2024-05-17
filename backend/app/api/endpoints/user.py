from app.api.deps import CurrentSession, SessionUser
from app.models.user import Account
from app.schemas.user import (
    AccountRegisterBody,
    CurrentUserBody,
    AuthBody,
)
from fastapi import APIRouter, Response

router = APIRouter()


@router.post("/create", response_model=CurrentUserBody)
async def create_account(
    session: CurrentSession,
    data: AccountRegisterBody,
    response: Response,
) -> CurrentUserBody:
    created_user = await Account.register(session, data, response)
    return created_user


@router.get("/get")
async def get_account_name(
    current_user: SessionUser,
):
    return current_user


@router.post("/login", response_model=CurrentUserBody)
async def user_login(
    session: CurrentSession, data: AuthBody, response: Response
) -> CurrentUserBody:
    res = await Account.login(session, data, response)
    return res
