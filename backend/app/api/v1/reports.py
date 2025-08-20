from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from ...reports.index import list_reports as _list_reports, mark_deleted
from ...core.config import settings
from pathlib import Path

router = APIRouter()

@router.get("/reports")
async def list_reports(page: int = 1, page_size: int = 50):
    return _list_reports(page, page_size)

@router.get("/reports/{report_id}/download")
async def download_report(report_id: str, file_path: str):
    p = Path(file_path)
    if not p.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(str(p), filename=p.name, media_type="text/csv")

@router.delete("/reports/{report_id}")
async def delete_report(report_id: str, file_path: str):
    p = Path(file_path)
    if p.exists():
        p.unlink()
    ok = mark_deleted(report_id)
    return {"deleted": ok}
