from fastapi import APIRouter
from services.parser_services import parse_html
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
from fastapi import HTTPException
from pydantic import HttpUrl
from services.enrichment_services import enrich_company
from services.scoring_services import calculate_score
from services.lead_services import create_lead

router = APIRouter(
    prefix="/crawler",
    tags=["Crawler"]
)

crawler_jobs = []

class CrawlRequest(BaseModel):
    url: HttpUrl
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

        # Parse HTML
        parsed_data = parse_html(
            str(job.url),
            response.text
        )

        # AI Enrichment
        enrichment = enrich_company(parsed_data)

        # Lead Scoring
        score = calculate_score({
            **parsed_data,
            **enrichment
        })

        # Create Lead
        lead = create_lead({
            "company_name": parsed_data.get("company_name"),
            "website": parsed_data.get("website"),
            "email": parsed_data.get("email"),
            "phone": parsed_data.get("phone"),
            "industry": enrichment.get("industry"),
            "company_size": enrichment.get("company_size"),
            "lead_quality": enrichment.get("lead_quality"),
            "score": score.get("lead_score")
        })

        return {
            "message": "Lead generated successfully",
            "job": new_job,
            "lead": lead,
            "enrichment": enrichment,
            "score": score
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
@router.get("/history")
def get_crawl_history():
    return crawler_jobs

@router.get("/stats")
def get_crawl_stats():

    total = len(crawler_jobs)

    completed = len([
        job for job in crawler_jobs
        if job["status"] == "Completed"
    ])

    running = len([
        job for job in crawler_jobs
        if job["status"] == "Running"
    ])

    failed = len([
        job for job in crawler_jobs
        if job["status"] == "Failed"
    ])

    return {
        "total": total,
        "completed": completed,
        "running": running,
        "failed": failed
    }

@router.get("/status")
def get_crawl_status():

    if not crawler_jobs:
        return {
            "status": "No Crawl"
        }

    return crawler_jobs[-1]
