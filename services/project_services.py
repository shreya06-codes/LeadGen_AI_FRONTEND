from uuid import uuid4
from datetime import datetime

projects = []


def create_project(data):

    project = {
        "id": str(uuid4()),
        "name": data["name"],
        "description": data["description"],
        "industry": data["industry"],
        "country": data["country"],
        "status": "Active",
        "total_leads": 0,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    projects.append(project)

    return project


def get_projects():
    return projects


def get_project(project_id):

    for project in projects:
        if project["id"] == project_id:
            return project

    return None


def delete_project(project_id):

    for project in projects:
        if project["id"] == project_id:
            projects.remove(project)
            return True

    return False