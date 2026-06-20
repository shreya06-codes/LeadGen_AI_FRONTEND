from fastapi import APIRouter

router = APIRouter(
    prefix="/companies",
    tags=["Companies"]
)

@router.get("/")
def get_companies():
    return {
        "message": "Get all companies API working"
    }

@router.post("/")
def create_company():
    return {
        "message": "Create company API working"
    }

@router.get("/{company_id}")
def get_company(company_id: str):
    return {
        "company_id": company_id,
        "message": "Get single company API working"
    }