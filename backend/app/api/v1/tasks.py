from fastapi import APIRouter, BackgroundTasks, UploadFile, File, Depends, Request
from typing import List
import csv
from io import StringIO
from ...services.ai import process_requests
import asyncio
import os
import time
from uuid import uuid4
from ...core.config import settings

router = APIRouter()

@router.post("/tasks")
async def create_task(
    background: BackgroundTasks,
    request: Request,
    file: UploadFile | None = File(default=None),
    current_user: dict = Depends(lambda: {"role": "user"}),
):
    """
    Accepts EITHER:
    - application/json with { "requests": ["..."], "ais": [...] }
    - multipart/form-data with CSV file upload (first column treated as prompt)
    """
    prompts: List[str] = []

    content_type = request.headers.get("content-type", "").lower()
    if content_type.startswith("application/json"):
        body = await request.json()
        reqs = body.get("requests") or []
        if isinstance(reqs, list):
            prompts.extend([str(r).strip() for r in reqs if str(r).strip()])

    if file is not None:
        data = (await file.read()).decode("utf-8", errors="ignore")
        reader = csv.reader(StringIO(data))
        for row in reader:
            if not row:
                continue
            val = str(row[0]).strip()
            if val:
                prompts.append(val)

    # Schedule async processing in the event loop
    if not prompts:
        return {"task_id": "printing", "prompts": 0}
    fname = f"responses_{int(time.time())}_{uuid4().hex[:6]}.csv"
    csv_path = os.path.join(settings.reports_dir, fname)
    asyncio.create_task(process_requests(prompts, output_csv=csv_path))
    return {"task_id": os.path.splitext(fname)[0], "prompts": len(prompts), "csv": csv_path}

@router.get("/tasks/{task_id}")
async def get_task_status(task_id: str):
    # TODO: return progress and status
    return {"task_id": task_id, "status": "pending", "progress": 0}
