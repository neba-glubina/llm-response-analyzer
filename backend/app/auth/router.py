
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Optional, Dict, List
from ..schemas.auth import Token, UserLogin, TokenData
from .jwt import create_access_token, decode_access_token
from ..utils.password import verify_password, hash_password
import json
from pathlib import Path
from .revocation import set_revoked_after_now

router = APIRouter()

# For demo: hardcoded users. Replace with DB in production.

USERS_FILE = Path(__file__).parent.parent.parent / "users.json"
def load_users():
	try:
		users = json.loads(USERS_FILE.read_text(encoding="utf-8"))
		db = {}
		for u in users:
			db[u["username"]] = {
				"username": u["username"],
				"hashed_password": hash_password(u["password"]),
				"role": u.get("role", "user")
			}
		return db
	except Exception as e:
		print(f"Failed to load users: {e}")
		return {}

fake_users_db = load_users()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def authenticate_user(username: str, password: str) -> Optional[dict]:
	user = fake_users_db.get(username)
	if not user:
		return None
	if not verify_password(password, user["hashed_password"]):
		return None
	return user

ATTEMPTS: Dict[str, List[int]] = {}
MAX_ATTEMPTS = 5
WINDOW_SEC = 300


@router.post("/login", response_model=Token)
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
	# Проверка капчи (заглушка)
	captcha_token = request.query_params.get("captcha_token") or request.headers.get("X-Captcha-Token")
	if not captcha_token:
		raise HTTPException(status_code=400, detail="Captcha required")
	# Здесь можно добавить реальную проверку капчи
	ip = request.client.host if request.client else "unknown"
	import time
	now = int(time.time())
	bucket = [t for t in ATTEMPTS.get(ip, []) if now - t < WINDOW_SEC]
	if len(bucket) >= MAX_ATTEMPTS:
		raise HTTPException(status_code=429, detail="Too many attempts. Try later.")
	ATTEMPTS[ip] = bucket + [now]

	user = authenticate_user(form_data.username, form_data.password)
	if not user:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Incorrect username or password",
			headers={"WWW-Authenticate": "Bearer"},
		)
	access_token = create_access_token({"sub": user["username"], "role": user["role"]})
	return {"access_token": access_token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
	payload = decode_access_token(token)
	if payload is None:
		raise HTTPException(status_code=401, detail="Invalid token")
	username: str = payload.get("sub")
	role: str = payload.get("role")
	if username is None or role is None:
		raise HTTPException(status_code=401, detail="Invalid token payload")
	user = fake_users_db.get(username)
	if user is None:
		raise HTTPException(status_code=401, detail="User not found")
	return {"username": username, "role": role}

@router.get("/me")
def read_users_me(current_user: dict = Depends(get_current_user)):
	return current_user


@router.post("/logout_all")
def logout_all(current_user: dict = Depends(get_current_user)):
	if current_user.get("role") != "admin":
		raise HTTPException(status_code=403, detail="Admin only")
	ts = set_revoked_after_now()
	return {"revoked_after": ts}
