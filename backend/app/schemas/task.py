from pydantic import BaseModel, Field
from typing import List, Optional


class TaskCreateJSON(BaseModel):
	site: str
	brands: List[str]
	ais: List[str]
	country: str
	language: str
	requests: List[str] = Field(default_factory=list)


class TaskStatus(BaseModel):
	task_id: str
	status: str
	progress: int = 0
	total: int = 0
	started_at: Optional[str] = None
	finished_at: Optional[str] = None


class TaskSummary(BaseModel):
	id: str
	site: str
	brands: List[str]
	ais: List[str]
	country: str
	language: str
	started_at: Optional[str]
	finished_at: Optional[str]
