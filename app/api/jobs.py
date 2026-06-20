from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)

jobs = []

class JobRequest(BaseModel):
    name: str
    task: str

@router.post("/create")
def create_job(job: JobRequest):
    new_job = {
        "id": len(jobs) + 1,
        "name": job.name,
        "task": job.task,
        "status": "Pending"
    }

    jobs.append(new_job)

    return {
        "message": "Job created",
        "job": new_job
    }

@router.get("/")
def get_jobs():
    return jobs

@router.post("/run/{job_id}")
def run_job(job_id: int):
    for job in jobs:
        if job["id"] == job_id:
            job["status"] = "Running"
            return job

    return {"message": "Job not found"}

@router.post("/stop/{job_id}")
def stop_job(job_id: int):
    for job in jobs:
        if job["id"] == job_id:
            job["status"] = "Stopped"
            return job

    return {"message": "Job not found"}