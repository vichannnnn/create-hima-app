import os
from celery import Celery  # type: ignore

celery_app = Celery(
    "tasks",
    include=[
        "tasks.new_password_email",
        "tasks.reset_password_email",
        "tasks.verify_account_email",
    ],
)

celery_app.conf.timezone = "Asia/Singapore"

celery_app.conf.broker_url = os.environ.get("CELERY_BROKER_URL")
celery_app.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND")
