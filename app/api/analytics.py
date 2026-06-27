from fastapi import APIRouter
from services.dashboard_services import get_dashboard_summary

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

@router.get("/dashboard")
def dashboard():
    return get_dashboard_summary()


@router.get("/stats")
def stats():

    return {
        "today_leads": 25,
        "weekly_leads": 130,
        "monthly_leads": 500
    }


@router.get("/health")
def system_health():

    return {
        "api": "Healthy",
        "database": "Connected",
        "crawler": "Running",
        "jobs": "Active"
    }