from fastapi import HTTPException, status


class AppError:
    PASSWORD_MISMATCH_ERROR = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Password and repeat password are not identical",
        headers={"WWW-Authenticate": "Bearer"},
    )

    BAD_REQUEST_ERROR = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid resources provided",
        headers={"WWW-Authenticate": "Bearer"},
    )

    INVALID_USER_ROLE_ERROR = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid user role for this action",
        headers={"WWW-Authenticate": "Bearer"},
    )

    USER_ALREADY_VERIFIED_ERROR = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="User email is already verified",
        headers={"WWW-Authenticate": "Bearer"},
    )

    CANNOT_REGISTER_AS_ADMIN_ERROR = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Registering as admin is not allowed",
        headers={"WWW-Authenticate": "Bearer"},
    )

    EMAIL_MICROSERVICE_ERROR = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Error sending email",
        headers={"WWW-Authenticate": "Bearer"},
    )

    INVALID_PASSWORD_RESET_TOKEN = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Password reset token is invalid",
        headers={"WWW-Authenticate": "Bearer"},
    )

    INVALID_CREDENTIALS_ERROR = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    PERMISSION_DENIED_ERROR = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Could not authorize the action",
        headers={"WWW-Authenticate": "Bearer"},
    )

    PERMISSION_ERROR = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have the required permission to run this action.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    RESOURCES_NOT_FOUND_ERROR: HTTPException = HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Resource does not exists",
    )

    RESOURCES_ALREADY_EXISTS_ERROR = HTTPException(
        status_code=status.HTTP_409_CONFLICT, detail="Resource already exists"
    )
