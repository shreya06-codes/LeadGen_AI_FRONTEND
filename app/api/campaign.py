from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/campaign",
    tags=["Campaign"]
)

campaigns = []

class Campaign(BaseModel):
    name: str
    description: str

@router.post("/")
def create_campaign(campaign: Campaign):

    new_campaign = {
        "id": len(campaigns)+1,
        "name": campaign.name,
        "description": campaign.description,
        "status": "Active"
    }

    campaigns.append(new_campaign)

    return {
        "message": "Campaign created",
        "campaign": new_campaign
    }

@router.get("/")
def get_campaigns():
    return campaigns

@router.get("/{campaign_id}")
def get_campaign(campaign_id: int):

    for campaign in campaigns:
        if campaign["id"] == campaign_id:
            return campaign

    return {"message":"Campaign not found"}

@router.delete("/{campaign_id}")
def delete_campaign(campaign_id: int):

    for campaign in campaigns:
        if campaign["id"] == campaign_id:
            campaigns.remove(campaign)
            return {"message":"Campaign deleted"}

    return {"message":"Campaign not found"}