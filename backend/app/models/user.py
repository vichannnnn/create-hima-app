import datetime
from os import environ
from typing import Optional
from uuid import uuid4

import httpx
import jwt
from app.crud.base import CRUD
from app.db.base_class import Base
from app.schemas.email import AccountUpdateEmailSchema
from app.schemas.user import (
    AccountRegisterSchema,
    AccountCredentialsSchema,
    AccountUpdatePasswordSchema,
    AuthSchema,
    CurrentUserSchema,
)
from app.utils.auth import Authenticator, ALGORITHM, SECRET_KEY, generate_password
from app.utils.exceptions import AppError
from fastapi import Response as FastAPIResponse
from pydantic import EmailStr
from sqlalchemy import exc as SQLAlchemyExceptions
from sqlalchemy import select, update, Index, func, DateTime, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, synonym
from sqlalchemy.sql.expression import text

TESTING_FLAG = environ.get("TESTING")
FRONTEND_URL = environ.get("FRONTEND_URL")
EMAIL_MICROSERVICE_URL = "http://email:8000"
REGISTER_ACCOUNT_VERIFICATION_EMAIL_URL = (
    f"{EMAIL_MICROSERVICE_URL}/email/send_account_verification"
)
SEND_RESET_PASSWORD_EMAIL_URL = f"{EMAIL_MICROSERVICE_URL}/email/send_reset_password"
SEND_NEW_PASSWORD_EMAIL_URL = f"{EMAIL_MICROSERVICE_URL}/email/send_new_password"


class Account(Base, CRUD["Account"]):
    __tablename__: str = "account"  # type: ignore
    __table_args__ = (
        Index("username_case_sensitive_index", text("upper(username)"), unique=True),
    )

    user_id: Mapped[int] = mapped_column(
        primary_key=True, index=True, autoincrement=True
    )
    username: Mapped[str] = mapped_column(nullable=False, index=True, unique=True)
    email: Mapped[str] = mapped_column(nullable=False, unique=True)
    password: Mapped[str] = mapped_column(nullable=False)
    is_email_verified: Mapped[bool] = mapped_column(nullable=False, server_default="f")
    email_verification_token: Mapped[str] = mapped_column(nullable=True)
    reset_password_token: Mapped[str] = mapped_column(nullable=True)
    date_joined: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), index=True
    )
    last_login_date: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    id: Mapped[int] = synonym("user_id")

    @classmethod
    async def register(
        cls,
        session: AsyncSession,
        data: AccountRegisterSchema,
        response: FastAPIResponse,
    ) -> CurrentUserSchema:
        username = data.username
        password = data.password
        repeat_password = data.repeat_password

        if password != repeat_password:  # type: ignore
            raise AppError.PASSWORD_MISMATCH_ERROR

        existing_account = await session.execute(
            select(Account).where(
                or_(Account.username == username, Account.email == data.email)
            )
        )
        if existing_account.scalars().first():
            raise AppError.RESOURCES_ALREADY_EXISTS_ERROR

        hashed_password = Authenticator.pwd_context.hash(password)
        email_verification_token = uuid4().hex

        account_data = {
            "username": username,
            "password": hashed_password,
            "email_verification_token": email_verification_token,
            "email": data.email,
        }
        new_account = Account(**account_data)
        session.add(new_account)

        if not TESTING_FLAG:
            confirm_url = (
                f"{FRONTEND_URL}/verify-account?token={email_verification_token}"
            )

            email_ms_client = httpx.AsyncClient()
            payload = {
                "email": data.email,
                "username": username,
                "confirm_url": confirm_url,
            }
            email_ms_resp = await email_ms_client.post(
                REGISTER_ACCOUNT_VERIFICATION_EMAIL_URL, json=payload
            )

            if email_ms_resp.status_code != 200:
                raise AppError.EMAIL_MICROSERVICE_ERROR

        await session.commit()
        await session.refresh(new_account)

        access_token = Authenticator.create_access_token(data={"sub": data.username})
        decoded_token = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            max_age=decoded_token["exp"],
        )

        return CurrentUserSchema(
            user_id=new_account.user_id,
            username=new_account.username,
        )

    @classmethod
    async def resend_email_verification_token(cls, session: AsyncSession, user_id: int):
        res = await cls.get(session=session, id=user_id)

        if not res.is_email_verified:
            email_verification_token = uuid4().hex
            confirm_url = (
                f"{FRONTEND_URL}/verify-account?token={email_verification_token}"
            )

            stmt = (
                update(Account)
                .returning(Account)
                .where(Account.user_id == user_id)
                .values({"email_verification_token": email_verification_token})
            )
            await session.execute(stmt)

            email_ms_client = httpx.AsyncClient()
            payload = {
                "email": res.email,
                "username": res.username,
                "confirm_url": confirm_url,
            }
            response = await email_ms_client.post(
                REGISTER_ACCOUNT_VERIFICATION_EMAIL_URL, json=payload
            )

            if response.status_code != 200:
                raise AppError.EMAIL_MICROSERVICE_ERROR

            await session.commit()

        else:
            raise AppError.USER_ALREADY_VERIFIED_ERROR

    @classmethod
    async def select_from_username(
        cls, session: AsyncSession, username: str
    ) -> Optional[AccountCredentialsSchema]:
        try:
            stmt = select(Account).where(Account.username.ilike(username))
            res = await session.execute(stmt)
            return res.scalars().one()  # type: ignore

        except SQLAlchemyExceptions.NoResultFound:
            return None

    @classmethod
    async def login(
        cls, session: AsyncSession, data: AuthSchema, response: FastAPIResponse
    ) -> CurrentUserSchema:
        if not (credentials := await cls.select_from_username(session, data.username)):
            raise AppError.INVALID_CREDENTIALS_ERROR
        if not Authenticator.pwd_context.verify(data.password, credentials.password):
            raise AppError.INVALID_CREDENTIALS_ERROR

        # TODO: Gotta move this response cookie setting into a common method for both register and login.

        access_token = Authenticator.create_access_token(data={"sub": data.username})
        decoded_token = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            max_age=decoded_token["exp"],
        )

        return CurrentUserSchema(
            user_id=credentials.user_id,
            username=credentials.username,
        )

    @classmethod
    async def update_password(
        cls, session: AsyncSession, user_id: int, data: AccountUpdatePasswordSchema
    ) -> FastAPIResponse:
        if data.before_password is None or data.password is None:
            raise AppError.BAD_REQUEST_ERROR

        curr = await Account.get(session, id=user_id)
        if (
            not Authenticator.pwd_context.verify(data.before_password, curr.password)
            or not curr
        ):
            raise AppError.INVALID_CREDENTIALS_ERROR

        if data.password != data.repeat_password:
            raise AppError.PASSWORD_MISMATCH_ERROR

        hashed_updated_password = Authenticator.pwd_context.hash(data.password)

        stmt = (
            update(Account)
            .returning(Account)
            .where(Account.user_id == user_id)
            .values({"password": hashed_updated_password})
        )
        await session.execute(stmt)
        await session.commit()
        return FastAPIResponse(status_code=204)

    @classmethod
    async def update_email(
        cls, session: AsyncSession, user_id: int, data: AccountUpdateEmailSchema
    ) -> FastAPIResponse:
        stmt = select(cls).where(cls.user_id == user_id)
        result = await session.execute(stmt)
        account = result.scalar()

        if not account:
            raise AppError.INVALID_CREDENTIALS_ERROR

        if account.email == data.new_email:
            raise AppError.BAD_REQUEST_ERROR

        email_verification_token = uuid4().hex
        stmt = (
            update(Account)
            .returning(Account)
            .where(Account.user_id == user_id)
            .values(
                {
                    "email": data.new_email,
                    "is_email_verified": False,
                    "email_verification_token": email_verification_token,
                }
            )
        )
        res = await session.execute(stmt)
        updated_account = res.scalar_one()
        await session.flush()

        if not TESTING_FLAG:
            confirm_url = (
                f"{FRONTEND_URL}/verify-account?token={email_verification_token}"
            )

            email_ms_client = httpx.AsyncClient()
            payload = {
                "email": updated_account.email,
                "username": updated_account.username,
                "confirm_url": confirm_url,
            }
            response = await email_ms_client.post(
                REGISTER_ACCOUNT_VERIFICATION_EMAIL_URL, json=payload
            )

            if response.status_code != 200:
                raise AppError.EMAIL_MICROSERVICE_ERROR

        await session.commit()
        return FastAPIResponse(status_code=204)

    @classmethod
    async def verify_email(cls, session: AsyncSession, token: str):
        try:
            stmt = select(Account).where(Account.email_verification_token == token)
            res = await session.execute(stmt)
            account = res.scalars().one()

        except SQLAlchemyExceptions.NoResultFound as e:  # pylint: disable=C0103
            raise AppError.BAD_REQUEST_ERROR from e

        if account.is_email_verified:
            raise AppError.BAD_REQUEST_ERROR

        account.is_email_verified = True
        account.email_verification_token = None
        await session.commit()

    @classmethod
    async def send_reset_email(cls, session: AsyncSession, email: EmailStr):
        token = uuid4().hex
        confirm_url = f"{FRONTEND_URL}/reset-password?token={token}"

        stmt = select(cls).where(cls.email == email)
        result = await session.execute(stmt)
        account = result.scalar()

        try:
            email_ms_client = httpx.AsyncClient()
            payload = {
                "email": email,
                "username": account.username,
                "confirm_url": confirm_url,
            }
            response = await email_ms_client.post(
                SEND_RESET_PASSWORD_EMAIL_URL, json=payload
            )

            if response.status_code != 200:
                raise AppError.EMAIL_MICROSERVICE_ERROR

        except Exception as e:  # pylint: disable=C0103, W0612, W0703
            print(str(e))
            return FastAPIResponse(status_code=200)

        stmt = (
            update(Account)
            .returning(Account)
            .where(Account.user_id == account.user_id)
            .values({"reset_password_token": token})
        )
        await session.execute(stmt)
        await session.commit()

    @classmethod
    async def reset_password(cls, session: AsyncSession, token: str):
        try:
            stmt = select(Account).where(Account.reset_password_token == token)
            res = await session.execute(stmt)
            account = res.scalars().one()

        except SQLAlchemyExceptions.NoResultFound as e:  # pylint: disable=C0103
            raise AppError.RESOURCES_NOT_FOUND_ERROR from e

        password = generate_password()

        email_ms_client = httpx.AsyncClient()
        payload = {
            "email": account.email,
            "username": account.username,
            "password": password,
        }
        response = await email_ms_client.post(SEND_NEW_PASSWORD_EMAIL_URL, json=payload)

        if response.status_code != 200:
            raise AppError.EMAIL_MICROSERVICE_ERROR

        account.password = Authenticator.pwd_context.hash(password)
        account.reset_password_token = None
        await session.commit()
        return FastAPIResponse(status_code=200)
