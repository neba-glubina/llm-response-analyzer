from fastapi import APIRouter

router = APIRouter()

@router.get("/reports")
async def list_reports(page: int = 1, page_size: int = 50):
    # TODO: pagination and list
    return {"items": [], "page": page, "total": 0}

@router.get("/reports/{report_id}/download")
async def download_report(report_id: str):
    # TODO: return file response
    return {"report_id": report_id}

@router.delete("/reports/{report_id}")
async def delete_report(report_id: str):
    # TODO: delete file but keep record
    return {"deleted": True}
