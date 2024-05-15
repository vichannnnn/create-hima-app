import asyncio
from asyncio import AbstractEventLoop
from typing import AsyncGenerator, Generator

import pytest
import sqlalchemy.exc as SQLAlchemyExceptions
from app.api.deps import get_session
from app.db.base_class import Base
from app.db.database import (
    engine as test_engine,
    async_session as TestingSessionLocal,
    SQLALCHEMY_DATABASE_URL_WITHOUT_DB,
)
from app.main import app
from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

pytest_plugins = [
    "app.tests.fixtures.user",
]


@pytest.fixture(scope="session")
def event_loop() -> AbstractEventLoop:
    return asyncio.get_event_loop()


@pytest.fixture(scope="session", autouse=True)
async def create_test_database():
    postgres_engine = create_async_engine(str(SQLALCHEMY_DATABASE_URL_WITHOUT_DB))

    async with postgres_engine.connect() as conn:
        await conn.execute(text("COMMIT"))
        try:
            await conn.execute(text("CREATE DATABASE test;"))
        except SQLAlchemyExceptions.ProgrammingError as exc:
            print(str(exc))
            pass

    yield

    async with postgres_engine.connect() as conn:
        await conn.execute(text("COMMIT"))
        await conn.execute(text("DROP DATABASE test;"))
        await conn.close()


@pytest.fixture(scope="function", autouse=True)
async def init_models(event_loop: AbstractEventLoop) -> None:
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    app.dependency_overrides[get_session] = override_session


async def override_session() -> AsyncGenerator[AsyncSession, None]:
    async with TestingSessionLocal() as session:
        try:
            yield session
        finally:
            await session.rollback()
        await session.close()


@pytest.fixture(name="test_client")
def test_client() -> Generator[TestClient, None, None]:
    with TestClient(app) as test_client:
        yield test_client
