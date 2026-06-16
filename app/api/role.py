from fastapi import APIRouter

router = APIRouter(
    prefix="/roles",
    tags=["Roles"]
)

roles = [
    {"id": 1, "role": "Admin"},
    {"id": 2, "role": "Manager"},
    {"id": 3, "role": "Member"}
]

@router.get("/")
def get_roles():
    return roles