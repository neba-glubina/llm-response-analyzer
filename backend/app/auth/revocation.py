from pathlib import Path
from datetime import datetime, timezone
from ..core.config import settings

REVOCATION_FILE = Path(settings.storage_dir) / "auth" / "revoked_after.txt"


def get_revoked_after_ts() -> int:
    try:
        data = REVOCATION_FILE.read_text(encoding="utf-8").strip()
        return int(data)
    except Exception:
        return 0


def set_revoked_after_now() -> int:
    REVOCATION_FILE.parent.mkdir(parents=True, exist_ok=True)
    now_ts = int(datetime.now(timezone.utc).timestamp())
    REVOCATION_FILE.write_text(str(now_ts), encoding="utf-8")
    return now_ts
