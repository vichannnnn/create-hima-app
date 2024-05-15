from app.api.endpoints import example, user, email
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(example.router, tags=["Example"])
api_router.include_router(user.router, tags=["Authentication"], prefix="/user")
api_router.include_router(email.router, tags=["Email"], prefix="/email")
