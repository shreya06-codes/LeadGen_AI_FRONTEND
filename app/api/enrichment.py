from fastapi import APIRouter
from services.enrichment_services import enrich_company

router = APIRouter(
    prefix="/enrichment",
    tags=["Lead Enrichment"]
)


@router.get("/{lead_id}")
def enrich_lead(lead_id: int):

    # Temporary parsed data
    # Later this will come from the Parser API or PostgreSQL
    parsed_data = {
        "company_name": "OpenAI",
        "title": "OpenAI",
        "meta_description": "Artificial Intelligence Research Company",
        "email": "info@openai.com",
        "phone": "+1 123456789",
        "linkedin": "https://linkedin.com/company/openai"
    }

    enrichment = enrich_company(parsed_data)

    return {
        "lead_id": lead_id,
        "company": parsed_data["company_name"],
        "enrichment": enrichment
    }