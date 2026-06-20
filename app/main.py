from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.projects import router as project_router
from app.api.test import router as test_router
from app.api.metrics import router as metrics_router
from app.api.ai import router as ai_router
from app.api.reports import router as reports_router
from app.api.role import router as role_router
from app.api.search import router as search_router
from app.api.export import router as export_router
from app.api.health import router as health_router
from app.api.workspace import router as workspace_router
from app.api.filter import router as filter_router
from app.api.crawler import router as crawler_router
from app.api.jobs import router as jobs_router
from app.api.leads import router as leads_router
from app.api.scoring import router as scoring_router
from app.api.enrichment import router as enrichment_router
from app.api.analytics import router as analytics_router
from app.api.campaign import router as campaign_router
from app.api.pipeline import router as pipeline_router
from app.api.pipeline_logs import router as pipeline_logs_router
from app.api.users import router as users_router
from routers import company
from database import init_db

app = FastAPI(title="AURXON LoadGen AI")

# CORS FIRST (good practice)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTES
app.include_router(auth_router)
app.include_router(workspace_router)
app.include_router(filter_router)
app.include_router(pipeline_router)
app.include_router(crawler_router)
app.include_router(project_router)
app.include_router(test_router)
app.include_router(metrics_router)
app.include_router(ai_router)
app.include_router(search_router)
app.include_router(health_router)
app.include_router(role_router)
app.include_router(jobs_router)
app.include_router(leads_router)
app.include_router(scoring_router)
app.include_router(enrichment_router)
app.include_router(analytics_router)
app.include_router(campaign_router)
app.include_router(pipeline_logs_router)
app.include_router(users_router)
app.include_router(reports_router)
app.include_router(company.router)
# HOME ROUTE
@app.on_event("startup")
def startup():
    init_db()
    
@app.get("/")
def home():
    return {"message": "Welcome to AURXON Backend!"}