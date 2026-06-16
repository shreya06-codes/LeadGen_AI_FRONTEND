from fastapi import APIRouter

router = APIRouter(
    prefix="/health",
    tags=["Health"]
)

@router.get("/")
def health():
    return {
        "status": "Healthy"
    }

@router.get("/status")
def status():
    return {
        "server": "Running"
    }