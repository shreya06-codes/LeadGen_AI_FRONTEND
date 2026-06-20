from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(
    prefix="/pipeline",
    tags=["Pipeline"]
)

pipelines = []

class PipelineRequest(BaseModel):
    workspace_id: int
    campaign_id: int
    query: str

STAGES = [
    "search",
    "crawl",
    "extract",
    "enrich",
    "score",
    "report",
    "export"
]

@router.post("/start")
def start_pipeline(data: PipelineRequest):

    pipeline = {
        "id": len(pipelines) + 1,
        "workspace_id": data.workspace_id,
        "campaign_id": data.campaign_id,
        "query": data.query,
        "current_stage": STAGES[0],
        "status": "Running",
        "stages": {}
    }

    for stage in STAGES:
        pipeline["stages"][stage] = "Pending"

    pipeline["stages"]["search"] = "Completed"

    pipelines.append(pipeline)

    return {
        "message": "Pipeline started",
        "pipeline": pipeline
    }


@router.post("/{pipeline_id}/next")
def next_stage(pipeline_id: int):

    for pipeline in pipelines:

        if pipeline["id"] == pipeline_id:

            for stage in STAGES:

                if pipeline["stages"][stage] == "Pending":

                    pipeline["stages"][stage] = "Completed"
                    pipeline["current_stage"] = stage

                    if stage == STAGES[-1]:
                        pipeline["status"] = "Completed"

                    return {
                        "message": f"{stage} completed",
                        "pipeline": pipeline
                    }

            return {
                "message": "Pipeline already completed",
                "pipeline": pipeline
            }

    raise HTTPException(
        status_code=404,
        detail="Pipeline not found"
    )


@router.get("/{pipeline_id}")
def get_pipeline(pipeline_id: int):

    for pipeline in pipelines:
        if pipeline["id"] == pipeline_id:
            return pipeline

    raise HTTPException(
        status_code=404,
        detail="Pipeline not found"
    )


@router.get("/")
def get_all_pipelines():
    return pipelines

@router.post("/{pipeline_id}/run")
def run_pipeline(pipeline_id: int):

    for pipeline in pipelines:

        if pipeline["id"] == pipeline_id:

            stages = [
                "search",
                "crawl",
                "extract",
                "enrich",
                "score",
                "report",
                "export"
            ]

            for stage in stages:
                pipeline["stages"][stage] = "Completed"

            pipeline["current_stage"] = "Completed"
            pipeline["status"] = "Completed"

            return {
                "message": "Pipeline executed successfully",
                "pipeline": pipeline
            }

    raise HTTPException(
        status_code=404,
        detail="Pipeline not found"
    )