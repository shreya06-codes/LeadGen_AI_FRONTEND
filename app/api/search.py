from fastapi import APIRouter

router = APIRouter(
    prefix="/search",
    tags=["Search"]
)

@router.get("/")
def search(keyword: str):
    return {
        "keyword": keyword,
        "results": []
    }