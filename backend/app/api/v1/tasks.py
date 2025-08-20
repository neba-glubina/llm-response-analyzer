from fastapi import APIRouter, BackgroundTasks, UploadFile, File, Depends
from typing import List, Optional

router = APIRouter()

@router.post("/tasks")
async def create_task(
    background: BackgroundTasks,
    site: str,
    brands: List[str],
    ais: List[str],
    country: str,
    language: str,
    csv: UploadFile = File(...),
    current_user: dict = Depends(lambda: {"role": "user"}),
):
    # TODO: save file, enqueue task, return task id
    return {"task_id": "stub"}

@router.get("/tasks/{task_id}")
async def get_task_status(task_id: str):
    # TODO: return progress and status
    return {"task_id": task_id, "status": "pending", "progress": 0}
