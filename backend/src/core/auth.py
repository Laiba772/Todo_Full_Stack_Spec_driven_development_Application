from datetime import datetime, timedelta, timezone
from typing import Dict, Any
from uuid import UUID
import jwt


# =========================
# Custom Errors
# =========================

class InvalidTokenError(Exception):
    pass


class ExpiredTokenError(Exception):
    pass


# =========================
# JWT Functions
# =========================

def create_jwt_token(
    user_id: UUID,
    email: str,
    secret: str,
    expiration_hours: int = 8,
    algorithm: str = "HS256",
) -> str:
    now = datetime.now(timezone.utc)

    payload = {
        "sub": str(user_id),
        "email": email,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=expiration_hours)).timestamp()),
        "iss": "todo-app",
    }

    token = jwt.encode(payload, secret, algorithm=algorithm)
    return token


def verify_jwt_token(token: str, secret: str, algorithms=["HS256"]) -> Dict[str, Any]:
    if not token:
        raise InvalidTokenError("Token is empty")

    try:
        payload = jwt.decode(
            token,
            secret,
            algorithms=algorithms,
            options={"require": ["exp", "iat", "sub"]},
        )
        return payload

    except jwt.ExpiredSignatureError:
        raise ExpiredTokenError("Token has expired")

    except jwt.InvalidTokenError:
        raise InvalidTokenError("Invalid token")


def decode_jwt_token(token: str) -> Dict[str, Any]:
    """
    Decode token WITHOUT verifying signature.
    Used only for frontend / debug / non-secure reads.
    """
    try:
        payload = jwt.decode(
            token,
            options={"verify_signature": False},
        )
        return payload
    except Exception:
        return {}
