from fastapi import APIRouter
from app.api.endpoints import email


api_router = APIRouter()
api_router.include_router(email.router, tags=["Email"], prefix="/email")
