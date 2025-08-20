from fastapi import APIRouter

router = APIRouter()

@router.delete("/files/{filename}")
async def delete_uploaded_file(filename: str):
    # TODO: delete uploaded file
    return {"deleted": True}
