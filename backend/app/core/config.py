from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import List


class Settings(BaseSettings):
	model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)

	app_name: str = "LLM Response Analyzer API"
	jwt_secret_key: str = Field(default="change_me", alias="JWT_SECRET_KEY")
	jwt_algorithm: str = "HS256"
	jwt_expire_minutes: int = 60 * 24

	# File storage
	storage_dir: str = "storage"
	uploads_dir: str = "storage/uploads"
	reports_dir: str = "storage/reports"

	# CORS
	cors_origins: List[str] = [
		"http://localhost:5173",
		"http://127.0.0.1:5173",
	]


settings = Settings()
