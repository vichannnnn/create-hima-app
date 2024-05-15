from typing import Annotated
from typing import AsyncGenerator, Generator

from app.db.database import SessionLocal, async_session
from app.models.user import Account
from app.schemas.user import CurrentUserSchema
from app.utils.auth import Authenticator, ALGORITHM, SECRET_KEY
from app.utils.exceptions import AppError
from fastapi import Depends
from jose import JWTError, jwt
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


async def get_current_user(
        session: CurrentSession,
        token: str = Depends(Authenticator.oauth2_scheme),
) -> CurrentUserSchema:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        if username := payload.get("sub"):
            if user := await Account.select_from_username(session, username):
                return CurrentUserSchema(
                    user_id=user.user_id, username=username
                )

    except JWTError as exc:
        raise AppError.INVALID_CREDENTIALS_ERROR from exc
    raise AppError.INVALID_CREDENTIALS_ERROR


async def get_verified_user(
        session: CurrentSession,
        token: OAuth2Session,
) -> CurrentUserSchema:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)

        username = payload.get("sub")
        user = (
            await Account.select_from_username(session, username) if username else None
        )

        if username and user and user.verified:
            return CurrentUserSchema(
                user_id=user.user_id,
                username=username,
                email=user.email,
                verified=user.verified,
            )

        else:
            raise AppError.PERMISSION_DENIED_ERROR

    except JWTError as exc:
        raise AppError.INVALID_CREDENTIALS_ERROR from exc


SessionUser = Annotated[CurrentUserSchema, Depends(get_current_user)]
SessionVerifiedUser = Annotated[CurrentUserSchema, Depends(get_verified_user)]
