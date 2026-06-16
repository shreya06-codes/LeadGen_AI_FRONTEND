from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4

router = APIRouter(
    prefix="/tests",
    tags=["Tests"]
)

tests = []

class TestCreate(BaseModel):
    project_id: str
    name: str
    url: str
    method: str
    virtual_users: int
    duration: int

# Create Test
@router.post("/")
def create_test(test: TestCreate):

    new_test = {
        "id": str(uuid4()),
        "project_id": test.project_id,
        "name": test.name,
        "url": test.url,
        "method": test.method,
        "virtual_users": test.virtual_users,
        "duration": test.duration
    }

    tests.append(new_test)

    return {
        "message": "Test created successfully",
        "test": new_test
    }

# Get All Tests
@router.get("/")
def get_tests():
    return {
        "total_tests": len(tests),
        "tests": tests
    }

# Get Single Test
@router.get("/{test_id}")
def get_test(test_id: str):

    for test in tests:
        if test["id"] == test_id:
            return test

    raise HTTPException(
        status_code=404,
        detail="Test not found"
    )

# Delete Test
@router.delete("/{test_id}")
def delete_test(test_id: str):

    for test in tests:
        if test["id"] == test_id:
            tests.remove(test)
            return {
                "message": "Test deleted successfully"
            }

    raise HTTPException(
        status_code=404,
        detail="Test not found"
    )
@router.post("/{test_id}/start")
def start_test(test_id: str):

    for test in tests:
        if test["id"] == test_id:
            test["status"] = "Running"
            return {
                "message": "Test started",
                "status": test["status"]
            }

    raise HTTPException(
        status_code=404,
        detail="Test not found"
    )


@router.post("/{test_id}/stop")
def stop_test(test_id: str):

    for test in tests:
        if test["id"] == test_id:
            test["status"] = "Stopped"
            return {
                "message": "Test stopped",
                "status": test["status"]
            }

    raise HTTPException(
        status_code=404,
        detail="Test not found"
    )


@router.get("/{test_id}/status")
def get_status(test_id: str):

    for test in tests:
        if test["id"] == test_id:
            return {
                "test_id": test["id"],
                "status": test.get("status", "Created")
            }

    raise HTTPException(
        status_code=404,
        detail="Test not found"
    )