from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.projects import router as project_router
from app.api.test import router as test_router
from app.api.metrics import router as metrics_router
from app.api.ai import router as ai_router
from app.api.reports import router
from app.api.role import router as role_router
from app.api.search import router as search_router
from app.api.export import router as export_router
from app.api.health import router as health_router
app = FastAPI(
    title="AURXON LoadGen AI"
)

app.include_router(auth_router)
app.include_router(project_router)
app.include_router(test_router)
app.include_router(metrics_router)
app.include_router(ai_router)
app.include_router(search_router)
app.include_router(health_router)
app.include_router(role_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to AURXON Backend!"
    }