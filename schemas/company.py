from pydantic import BaseModel
from typing import Optional

class CompanyCreate(BaseModel):
    name: str
    domain_url: str

class CompanyResponse(BaseModel):
    id: str
    name: str
    domain_url: str
    industry: Optional[str] = None
    ai_summary: Optional[str] = None

    class Config:
        from_attributes = True