from fastapi import APIRouter

router = APIRouter(
    prefix="/enrichment",
    tags=["Lead Enrichment"]
)

@router.get("/{lead_id}")
def enrich_lead(lead_id: int):

    enriched_data = {
        "lead_id": lead_id,
        "company_size": "500-1000",
        "country": "USA",
        "industry": "Technology",
        "linkedin": "https://linkedin.com/company/sample",
        "verified": True,
        "revenue": "$50M"
    }

    return {
        "message": "Lead enriched successfully",
        "data": enriched_data
    }