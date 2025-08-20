from pathlib import Path
from typing import List, Dict, Any
import json
from ..core.config import settings

INDEX_FILE = Path(settings.reports_dir) / "index.json"


def _read_index() -> List[Dict[str, Any]]:
    try:
        return json.loads(INDEX_FILE.read_text(encoding="utf-8"))
    except Exception:
        return []


essential_fields = [
    "id",
    "started_at",
    "finished_at",
    "site",
    "ais",
    "file_path",
]


def add_report(item: Dict[str, Any]) -> None:
    INDEX_FILE.parent.mkdir(parents=True, exist_ok=True)
    data = _read_index()
    sanitized = {k: item.get(k) for k in essential_fields}
    data.append(sanitized)
    INDEX_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def list_reports(page: int, page_size: int) -> Dict[str, Any]:
    items = _read_index()
    total = len(items)
    start = (page - 1) * page_size
    end = start + page_size
    return {"items": items[start:end], "total": total, "page": page}


def mark_deleted(report_id: str) -> bool:
    data = _read_index()
    changed = False
    for item in data:
        if item.get("id") == report_id:
            item["file_path"] = None
            changed = True
            break
    if changed:
        INDEX_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return changed
