from os import environ

DATABASE_URL = environ.get("DATABASE_URL")
TESTING = environ.get("TESTING")
FRONTEND_URL = environ.get("FRONTEND_URL")

# Email Microservice URL

EMAIL_MICROSERVICE_URL = "http://email:8000"
REGISTER_ACCOUNT_VERIFICATION_EMAIL_URL = (
    f"{EMAIL_MICROSERVICE_URL}/email/send_account_verification"
)
SEND_RESET_PASSWORD_EMAIL_URL = f"{EMAIL_MICROSERVICE_URL}/email/send_reset_password"
SEND_NEW_PASSWORD_EMAIL_URL = f"{EMAIL_MICROSERVICE_URL}/email/send_new_password"
