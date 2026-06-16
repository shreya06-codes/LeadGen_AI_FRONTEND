from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from uuid import uuid4

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Temporary storage
users = []

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str


@router.post("/register")
def register(user: UserRegister):

    for u in users:
        if u["email"] == user.email:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

    new_user = {
        "id": str(uuid4()),
        "name": user.name,
        "email": user.email,
        "password": user.password
    }

    users.append(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user["id"]
    }


@router.post("/login")
def login(user: UserLogin):

    for u in users:
        if (
            u["email"] == user.email and
            u["password"] == user.password
        ):
            return {
                "message": "Login successful",
                "user": {
                    "id": u["id"],
                    "name": u["name"],
                    "email": u["email"]
                }
            }

    raise HTTPException(
        status_code=401,
        detail="Invalid credentials"
    )


@router.get("/users")
def get_users():

    return [
        {
            "id": u["id"],
            "name": u["name"],
            "email": u["email"]
        }
        for u in users
    ]