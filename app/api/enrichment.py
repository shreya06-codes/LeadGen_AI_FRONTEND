from fastapi import APIRouter
from pydantic import BaseModel
from services.enrichment_services import enrich_company

router = APIRouter(
    prefix="/enrichment",
    tags=["AI Enrichment"]
)

class CompanyRequest(BaseModel):
    company_name: str
    website: str


@router.post("/analyze")
def analyze_company(data: CompanyRequest):

    result = enrich_company(
        data.company_name,
        data.website
    )

    return {
        "message": "Company enriched successfully",
        "data": result
    }