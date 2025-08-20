from pathlib import Path
from typing import Optional
from fastapi import UploadFile
from ..core.config import settings


def save_upload(file: UploadFile, subdir: Optional[str] = None) -> Path:
	base = Path(settings.uploads_dir)
	if subdir:
		base = base / subdir
	base.mkdir(parents=True, exist_ok=True)
	dest = base / file.filename
	with dest.open("wb") as f:
		f.write(file.file.read())
	return dest


def delete_file(filename: str) -> bool:
	p = Path(settings.uploads_dir) / filename
	if p.exists():
		p.unlink()
		return True
	return False
