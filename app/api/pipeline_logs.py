from fastapi import APIRouter

router = APIRouter(
    prefix="/pipeline-logs",
    tags=["Pipeline Logs"]
)

logs = []

@router.post("/add")
def add_log(
    pipeline_id: int,
    stage: str,
    status: str
):

    log = {
        "pipeline_id": pipeline_id,
        "stage": stage,
        "status": status
    }

    logs.append(log)

    return {
        "message": "Log added",
        "log": log
    }

@router.get("/")
def get_logs():
    return logs

@router.get("/{pipeline_id}")
def get_pipeline_logs(pipeline_id: int):

    result = []

    for log in logs:
        if log["pipeline_id"] == pipeline_id:
            result.append(log)

    return result