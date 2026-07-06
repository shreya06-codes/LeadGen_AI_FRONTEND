from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.project_services import (
    create_project,
    get_projects,
    get_project,
    delete_project
)

router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


class ProjectCreate(BaseModel):

    name: str
    description: str
    industry: str
    country: str


@router.post("/")
def add_project(project: ProjectCreate):

    return create_project(project.model_dump())


@router.get("/")
def all_projects():

    return {
        "total_projects": len(get_projects()),
        "projects": get_projects()
    }


@router.get("/{project_id}")
def single_project(project_id: str):

    project = get_project(project_id)

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    return project


@router.delete("/{project_id}")
def remove_project(project_id: str):

    if delete_project(project_id):
        return {
            "message": "Project deleted successfully"
        }

    raise HTTPException(
        status_code=404,
        detail="Project not found"
    )