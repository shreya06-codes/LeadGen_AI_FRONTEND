from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/crawler",
    tags=["Crawler"]
)

crawler_jobs = []

class CrawlRequest(BaseModel):
    source: str
    target: str

# Start Crawl
@router.post("/start")
def start_crawl(job: CrawlRequest):
    new_job = {
        "id": len(crawler_jobs) + 1,
        "source": job.source,
        "target": job.target,
        "status": "Running"
    }

    crawler_jobs.append(new_job)

    return {
        "message": "Crawler started",
        "job": new_job
    }

# Get All Jobs
@router.get("/jobs")
def get_jobs():
    return crawler_jobs

# Get Job Status
@router.get("/status/{job_id}")
def get_status(job_id: int):
    for job in crawler_jobs:
        if job["id"] == job_id:
            return job

    return {"message": "Job not found"}

# Stop Crawl
@router.post("/stop/{job_id}")
def stop_crawl(job_id: int):
    for job in crawler_jobs:
        if job["id"] == job_id:
            job["status"] = "Stopped"
            return {
                "message": "Crawler stopped",
                "job": job
            }

    return {"message": "Job not found"}