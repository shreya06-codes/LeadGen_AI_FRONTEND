from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/workspace",
    tags=["Workspace"]
)

workspaces = []

class Workspace(BaseModel):
    name: str

# Create Workspace
@router.post("/")
def create_workspace(workspace: Workspace):
    workspace_data = {
        "id": len(workspaces) + 1,
        "name": workspace.name
    }
    workspaces.append(workspace_data)
    return {
        "message": "Workspace created successfully",
        "workspace": workspace_data
    }

# Get All Workspaces
@router.get("/")
def get_workspaces():
    return workspaces

# Get Single Workspace
@router.get("/{workspace_id}")
def get_workspace(workspace_id: int):
    for workspace in workspaces:
        if workspace["id"] == workspace_id:
            return workspace
    return {"message": "Workspace not found"}

# Delete Workspace
@router.delete("/{workspace_id}")
def delete_workspace(workspace_id: int):
    for workspace in workspaces:
        if workspace["id"] == workspace_id:
            workspaces.remove(workspace)
            return {"message": "Workspace deleted"}
    return {"message": "Workspace not found"}

from pydantic import BaseModel

members = []

class InviteMember(BaseModel):
    workspace_id: int
    email: str
    role: str

# Invite Member
@router.post("/invite")
def invite_member(member: InviteMember):
    member_data = {
        "id": len(members) + 1,
        "workspace_id": member.workspace_id,
        "email": member.email,
        "role": member.role
    }

    members.append(member_data)

    return {
        "message": "Member invited successfully",
        "member": member_data
    }

# Get All Members
@router.get("/members")
def get_members():
    return members

# Remove Member
@router.delete("/member/{member_id}")
def remove_member(member_id: int):
    for member in members:
        if member["id"] == member_id:
            members.remove(member)
            return {
                "message": "Member removed successfully"
            }

    return {
        "message": "Member not found"
    }