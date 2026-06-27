from fastapi import APIRouter
from services.parser_services import parse_html
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
from fastapi import HTTPException
from pydantic import HttpUrl

router = APIRouter(
    prefix="/crawler",
    tags=["Crawler"]
)

crawler_jobs = []

class CrawlRequest(BaseModel):
    url: HttpUrl

# Start Crawl
@router.post("/start")
def start_crawl(job: CrawlRequest):

    try:
        response = requests.get(
            str(job.url),
            timeout=10,
            headers={
                "User-Agent": "Mozilla/5.0"
            }
        )

        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        title = soup.title.string.strip() if soup.title else "No Title"

        new_job = {
            "id": len(crawler_jobs) + 1,
            "url": str(job.url),
            "status": "Completed",
            "status_code": response.status_code,
            "title": title
        }

        crawler_jobs.append(new_job)

        parsed_data = parse_html(
            str(job.url),
            response.text
        )

        return {
            "message": "Website crawled successfully",
            "job": new_job,
            "data": parsed_data
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )