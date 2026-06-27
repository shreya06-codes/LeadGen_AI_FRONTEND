from fastapi import APIRouter
from fastapi.responses import PlainTextResponse
from services.export_services import export_csv, export_json

router = APIRouter(
    prefix="/export",
    tags=["Export"]
)


@router.get("/json")
def json_export():

    return export_json()


@router.get("/csv")
def csv_export():

    csv_data = export_csv()

    return PlainTextResponse(
        content=csv_data,
        media_type="text/csv"
    )