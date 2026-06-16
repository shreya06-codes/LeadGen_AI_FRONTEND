from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4

router = APIRouter(
    prefix="/metrics",
    tags=["Metrics"]
)

metrics = []

class MetricCreate(BaseModel):
    test_id: str
    response_time: float
    throughput: float
    error_rate: float
    cpu_usage: float
    memory_usage: float


# Create Metrics
@router.post("/")
def create_metric(metric: MetricCreate):

    new_metric = {
        "id": str(uuid4()),
        "test_id": metric.test_id,
        "response_time": metric.response_time,
        "throughput": metric.throughput,
        "error_rate": metric.error_rate,
        "cpu_usage": metric.cpu_usage,
        "memory_usage": metric.memory_usage
    }

    metrics.append(new_metric)

    return {
        "message": "Metrics added successfully",
        "metric": new_metric
    }


# Get All Metrics
@router.get("/")
def get_metrics():
    return {
        "total_metrics": len(metrics),
        "metrics": metrics
    }


# Get Metrics by Test ID
@router.get("/{test_id}")
def get_metric(test_id: str):

    result = []

    for metric in metrics:
        if metric["test_id"] == test_id:
            result.append(metric)

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Metrics not found"
        )

    return result