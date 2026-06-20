from fastapi import APIRouter

router = APIRouter(
    prefix="/filter",
    tags=["Filters"]
)

sample_data = [
    {"id": 1, "name": "Google", "industry": "Technology"},
    {"id": 2, "name": "Microsoft", "industry": "Technology"},
    {"id": 3, "name": "Tesla", "industry": "Automobile"}
]

@router.get("/")
def get_all():
    return sample_data

@router.get("/industry")
def filter_industry(industry: str):
    result = []

    for item in sample_data:
        if item["industry"].lower() == industry.lower():
            result.append(item)

    return result

@router.get("/company")
def filter_company(name: str):
    result = []

    for item in sample_data:
        if name.lower() in item["name"].lower():
            result.append(item)

    return result