"""BetterAuth-compatible authentication API endpoints."""
from datetime import datetime, timedelta
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlmodel import select
from src.config import get_settings
from src.services.auth_service import auth_service
from src.models.database import get_session
from src.models.user import User
from src.api.schemas.auth import (
    SignUpRequest,
    SignInRequest,
    SignUpResponse,
    SignInResponse,
    UserResponse,
)
from src.api.dependencies.auth import require_auth, TokenUser

router = APIRouter(tags=["Authentication"])


@router.post(
    "/signup",
    response_model=SignUpResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    responses={
        201: {"description": "User created successfully"},
        400: {"description": "Invalid request data"},
        409: {"description": "Email already registered"},
    },
)
async def sign_up(
    request: SignUpRequest,
    response: Response, # Inject Response object
    session=Depends(get_session),
):
    """Register a new user with email and password.

    Creates a new user account, returns the access token, and sets an HttpOnly cookie.
    """
    settings = get_settings()

    # Check if email already exists
    existing_user = session.exec(
        select(User).where(User.email == request.email)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": "EMAIL_EXISTS",
                "message": "Email address is already registered",
                "details": {"email": request.email},
            },
        )

    # Hash password and create user
    password_hash = auth_service.get_password_hash(request.password)

    user = User(email=request.email, password_hash=password_hash)
    session.add(user)
    session.commit()
    session.refresh(user)

    # Create access token
    access_token_data = {
        "sub": str(user.id),
        "email": user.email,
        "type": "access"
    }
    expires_delta = timedelta(minutes=settings.jwt_expiration_minutes)
    access_token = auth_service.create_access_token(
        data=access_token_data,
        expires_delta=expires_delta
    )

    # Set HttpOnly cookie as a fallback/secondary auth mechanism
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=int(expires_delta.total_seconds()),
        expires=int(expires_delta.total_seconds()),
        secure=True,
        samesite="Lax"
    )

    # Return token in response body for client-side handling
    return SignUpResponse(
        user=UserResponse.model_validate(user),
        access_token=access_token,
        refresh_token="", # Not implemented
        expires_in=int(expires_delta.total_seconds()),
        token_type="bearer"
    )


@router.post(
    "/signin",
    response_model=SignInResponse,
    summary="Authenticate user",
    responses={
        200: {"description": "Authentication successful"},
        401: {"description": "Invalid email or password"},
        422: {"description": "Validation error"},
    },
)
async def sign_in(
    request: SignInRequest,
    response: Response, # Inject Response object
    session=Depends(get_session),
):
    """Authenticate user with email and password.

    Returns an access token and sets an HttpOnly cookie.
    """
    settings = get_settings()

    # Find user by email
    user = session.exec(
        select(User).where(User.email == request.email)
    ).first()

    # Verify credentials
    if not user or not auth_service.verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": "INVALID_CREDENTIALS",
                "message": "Invalid email or password",
                "details": None,
            },
        )

    # Create access token
    access_token_data = {
        "sub": str(user.id),
        "email": user.email,
        "type": "access"
    }
    expires_delta = timedelta(minutes=settings.jwt_expiration_minutes)
    access_token = auth_service.create_access_token(
        data=access_token_data,
        expires_delta=expires_delta
    )

    # Set HttpOnly cookie as a fallback/secondary auth mechanism
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=int(expires_delta.total_seconds()),
        expires=int(expires_delta.total_seconds()),
        secure=True, # enable in production with HTTPS
        samesite="Lax" 
    )
    
    # Return token in response body for client-side handling
    return SignInResponse(
        access_token=access_token,
        refresh_token="", # Not implemented
        expires_in=int(expires_delta.total_seconds()),
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


# Note: We don't need refresh and signout endpoints since BetterAuth handles these internally
    # The frontend will manage sessions through BetterAuth's client-side mechanisms

@router.post("/signout", summary="Sign out user")
async def sign_out(response: Response):
    """Clears the HttpOnly access token cookie, effectively signing out the user."""
    response.delete_cookie(key="access_token")
    return {"message": "Signed out successfully"}


