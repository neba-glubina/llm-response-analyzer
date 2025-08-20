
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from typing import Optional
from .settings import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from .revocation import get_revoked_after_ts

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
	to_encode = data.copy()
	now = datetime.now(timezone.utc)
	expire = now + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
	to_encode.update({"exp": expire, "iat": int(now.timestamp())})
	encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
	return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
	try:
		payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
		# global revocation check
		iat = int(payload.get("iat", 0))
		if iat < get_revoked_after_ts():
			return None
		return payload
	except JWTError:
		return None
