
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Optional
from ..schemas.auth import Token, UserLogin, TokenData
from .jwt import create_access_token, decode_access_token
from ..utils.password import verify_password, hash_password

router = APIRouter()

# For demo: hardcoded users. Replace with DB in production.
fake_users_db = {
	"admin": {"username": "admin", "hashed_password": hash_password("admin"), "role": "admin"},
	"user": {"username": "user", "hashed_password": hash_password("user"), "role": "user"},
}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def authenticate_user(username: str, password: str) -> Optional[dict]:
	user = fake_users_db.get(username)
	if not user:
		return None
	if not verify_password(password, user["hashed_password"]):
		return None
	return user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
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
