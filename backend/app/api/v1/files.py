from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Dict, Any
from uuid import uuid4

router = APIRouter()

# In-memory storage (clears on server restart)
UPLOADS: Dict[str, Dict[str, Any]] = {}


@router.post("/files/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    saved = []
    for f in files:
        content = await f.read()
        fid = str(uuid4())
        UPLOADS[fid] = {"name": f.filename, "size": len(content), "content": content}
        saved.append({"id": fid, "name": f.filename, "size": len(content)})

    return {"files": saved}


@router.get("/files")
async def list_files():
    return {"files": [{"id": fid, "name": info["name"], "size": info["size"]} for fid, info in UPLOADS.items()]}


@router.delete("/files/{file_id}")
async def delete_file(file_id: str):
    if file_id not in UPLOADS:
        raise HTTPException(status_code=404, detail="file not found")
    del UPLOADS[file_id]
    return {"deleted": True}
