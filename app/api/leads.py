from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/leads",
    tags=["Leads"]
)

leads = []

class Lead(BaseModel):
    company: str
    website: str
    industry: str
    email: str

# Create Lead
@router.post("/")
def create_lead(lead: Lead):
    new_lead = {
        "id": len(leads) + 1,
        "company": lead.company,
        "website": lead.website,
        "industry": lead.industry,
        "email": lead.email,
        "score": 0,
        "status": "New"
    }

    leads.append(new_lead)

    return {
        "message": "Lead created",
        "lead": new_lead
    }

# Get All Leads
@router.get("/")
def get_leads():
    return leads

# Get Single Lead
@router.get("/{lead_id}")
def get_lead(lead_id: int):
    for lead in leads:
        if lead["id"] == lead_id:
            return lead

    return {"message": "Lead not found"}

# Delete Lead
@router.delete("/{lead_id}")
def delete_lead(lead_id: int):
    for lead in leads:
        if lead["id"] == lead_id:
            leads.remove(lead)
            return {"message": "Lead deleted"}

    return {"message": "Lead not found"}