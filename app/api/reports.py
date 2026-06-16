from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

reports = []

class ReportCreate(BaseModel):
    test_id: str
    performance_score: int
    summary: str
    recommendation: str


# Create Report
@router.post("/")
def create_report(report: ReportCreate):

    new_report = {
        "id": str(uuid4()),
        "test_id": report.test_id,
        "performance_score": report.performance_score,
        "summary": report.summary,
        "recommendation": report.recommendation
    }

    reports.append(new_report)

    return {
        "message": "Report created successfully",
        "report": new_report
    }


# Get All Reports
@router.get("/")
def get_reports():
    return {
        "total_reports": len(reports),
        "reports": reports
    }


# Get Report by Test ID
@router.get("/{test_id}")
def get_report(test_id: str):

    result = []

    for report in reports:
        if report["test_id"] == test_id:
            result.append(report)

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    return result