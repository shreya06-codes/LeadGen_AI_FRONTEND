from fastapi import APIRouter

router = APIRouter(
    prefix="/export",
    tags=["Export"]
)

@router.get("/csv")
def export_csv():
    return {
        "message": "CSV export started"
    }

@router.get("/excel")
def export_excel():
    return {
        "message": "Excel export started"
    }