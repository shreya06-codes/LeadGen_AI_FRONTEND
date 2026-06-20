from fastapi import APIRouter

router = APIRouter(
    prefix="/scoring",
    tags=["Lead Scoring"]
)

# Temporary scores
lead_scores = {
    1: 85,
    2: 72,
    3: 91
}

@router.get("/{lead_id}")
def get_score(lead_id: int):
    if lead_id in lead_scores:
        return {
            "lead_id": lead_id,
            "score": lead_scores[lead_id],
            "grade": (
                "Hot" if lead_scores[lead_id] >= 80
                else "Warm" if lead_scores[lead_id] >= 60
                else "Cold"
            )
        }

    return {
        "message": "Lead not found"
    }

@router.get("/")
def all_scores():
    return lead_scores