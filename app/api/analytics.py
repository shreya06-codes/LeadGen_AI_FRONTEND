from fastapi import APIRouter

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

@router.get("/dashboard")
def dashboard():

    return {
        "total_leads": 150,
        "hot_leads": 45,
        "warm_leads": 60,
        "cold_leads": 45,

        "active_crawlers": 5,
        "running_jobs": 8,

        "reports_generated": 20,

        "success_rate": "92%",

        "top_industries": [
            "Technology",
            "Healthcare",
            "Finance"
        ]
    }


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