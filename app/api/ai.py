from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4

router = APIRouter(
    prefix="/ai",
    tags=["AI Insights"]
)

insights = []

class AIInsight(BaseModel):
    test_id: str
    problem: str
    severity: str
    recommendation: str

@router.post("/")
def create_insight(data: AIInsight):

    insight = {
        "id": str(uuid4()),
        "test_id": data.test_id,
        "problem": data.problem,
        "severity": data.severity,
        "recommendation": data.recommendation
    }

    insights.append(insight)

    return {
        "message": "AI Insight generated",
        "insight": insight
    }

@router.get("/")
def get_insights():
    return insights

@router.get("/{test_id}")
def get_test_insight(test_id: str):

    result = []

    for i in insights:
        if i["test_id"] == test_id:
            result.append(i)

    if not result:
        raise HTTPException(
            status_code=404,
            detail="No AI insights found"
        )

    return result