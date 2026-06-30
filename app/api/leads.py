from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.lead_services import (
    create_lead,
    get_all_leads,
    get_lead,
    delete_lead
)

router = APIRouter(
    prefix="/leads",
    tags=["Leads"]
)


class LeadCreate(BaseModel):

    company_name: str
    website: str
    email: str
    phone: str
    industry: str
    company_size: str
    lead_quality: str
    score: int


@router.post("/")
def add_lead(lead: LeadCreate):

    return create_lead(lead.model_dump())


@router.get("/")
def all_leads():

    return get_all_leads()


@router.get("/{lead_id}")
def single_lead(lead_id: int):

    lead = get_lead(lead_id)

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    return lead


@router.delete("/{lead_id}")
def remove_lead(lead_id: int):

    if delete_lead(lead_id):
        return {"message": "Lead deleted"}

    raise HTTPException(
        status_code=404,
        detail="Lead not found"
    )