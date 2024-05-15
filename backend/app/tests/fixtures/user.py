from typing import Generator

import pytest
from app import schemas


@pytest.fixture(name="test_valid_account")
def test_valid_account() -> Generator[schemas.user.AccountRegisterSchema, None, None]:
    yield schemas.user.AccountRegisterSchema(
        username="validusername",
        password="Validpassword123!",
        repeat_password="Validpassword123!",
        email="test@gmail.com",
    )
