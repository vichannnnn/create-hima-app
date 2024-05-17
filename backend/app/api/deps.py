from typing import Annotated
from typing import AsyncGenerator, Generator

from app.db.database import SessionLocal, async_session
from app.models.user import Account
from app.schemas.user import CurrentUserBody
from app.utils.auth import Authenticator, ALGORITHM, SECRET_KEY
from app.utils.exceptions import AppError
from fastapi import Depends, Request
from jose import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session


def get_db() -> Generator[Session, None, None]:
    with SessionLocal() as session:
        yield session


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session


CurrentSession = Annotated[AsyncSession, Depends(get_session)]
OAuth2Session = Annotated[
    Authenticator.oauth2_scheme, Depends(Authenticator.oauth2_scheme)
]


async def get_user_from_cookie(
    session: CurrentSession, request: Request
) -> CurrentUserBody:
    token = request.cookies.get("access_token")
    if not token:
        raise AppError.INVALID_CREDENTIALS_ERROR

    payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
    username = payload.get("sub")
    user = await Account.select_from_username(session, username) if username else None
    if user is None:
        raise AppError.INVALID_CREDENTIALS_ERROR
    return CurrentUserBody(user_id=user.user_id, username=username)


async def get_current_user(
    session: CurrentSession,
    request: Request,
) -> CurrentUserBody:
    return await get_user_from_cookie(session, request)


async def get_verified_user(
    session: CurrentSession,
    request: Request,
) -> CurrentUserBody:
    user = await get_user_from_cookie(session, request)
    if not user.verified:
        raise AppError.PERMISSION_DENIED_ERROR
    return user


SessionUser = Annotated[CurrentUserBody, Depends(get_current_user)]
SessionVerifiedUser = Annotated[CurrentUserBody, Depends(get_verified_user)]
