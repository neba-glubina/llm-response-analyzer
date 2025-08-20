from fastapi import APIRouter
from ...auth.router import router as auth_router
from .tasks import router as tasks_router
from .reports import router as reports_router
from .files import router as files_router
from .config import router as config_router

router = APIRouter(prefix="/api/v1")

router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(tasks_router, tags=["tasks"])
router.include_router(reports_router, tags=["reports"])
router.include_router(files_router, tags=["files"])
router.include_router(config_router, tags=["config"])
