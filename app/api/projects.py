from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4

# Router
router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)

# Temporary storage
projects = []

# Project Schema
class ProjectCreate(BaseModel):
    name: str
    description: str

# Create Project
@router.post("/")
def create_project(project: ProjectCreate):

    new_project = {
        "id": str(uuid4()),
        "name": project.name,
        "description": project.description
    }

    projects.append(new_project)

    return {
        "message": "Project created successfully",
        "project": new_project
    }

# Get All Projects
@router.get("/")
def get_projects():
    return {
        "total_projects": len(projects),
        "projects": projects
    }

# Get Single Project
@router.get("/{project_id}")
def get_project(project_id: str):

    for project in projects:
        if project["id"] == project_id:
            return project

    raise HTTPException(
        status_code=404,
        detail="Project not found"
    )

# Delete Project
@router.delete("/{project_id}")
def delete_project(project_id: str):

    for project in projects:
        if project["id"] == project_id:
            projects.remove(project)
            return {
                "message": "Project deleted successfully"
            }

    raise HTTPException(
        status_code=404,
        detail="Project not found"
    )