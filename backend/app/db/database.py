import os
from pydantic import PostgresDsn

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

DATABASE_URL = os.environ["DATABASE_URL"]
TESTING = os.environ.get("TESTING")

SQLALCHEMY_DATABASE_URL = PostgresDsn.build(
    scheme="postgresql+asyncpg",
    username=os.environ["POSTGRES_USER"] if not TESTING else "postgres",
    password=os.environ["POSTGRES_PASSWORD"] if not TESTING else "postgres",
    host=os.environ["POSTGRES_HOST"],
    port=5432,
    path=os.environ["POSTGRES_DB"] if not TESTING else "test",
)

SQLALCHEMY_DATABASE_URL_WITHOUT_DB = PostgresDsn.build(
    scheme="postgresql+asyncpg",
    username=os.environ["POSTGRES_USER"] if not TESTING else "postgres",
    password=os.environ["POSTGRES_PASSWORD"] if not TESTING else "postgres",
    host=os.environ["POSTGRES_HOST"],
    port=5432,
)

engine = create_async_engine(
    str(SQLALCHEMY_DATABASE_URL), future=True, poolclass=NullPool if TESTING else None
)
async_session = async_sessionmaker(
    bind=engine, expire_on_commit=False, autoflush=False, class_=AsyncSession
)

sync_engine = create_engine(str(SQLALCHEMY_DATABASE_URL), pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)