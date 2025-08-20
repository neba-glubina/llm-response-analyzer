from pydantic import BaseModel
from typing import Optional, List


class ReportItem(BaseModel):
	id: str
	started_at: str
	finished_at: Optional[str]
	site: str
	ais: List[str]
	file_path: Optional[str]
	file_exists: bool = True


class ReportRow(BaseModel):
	Request: str
	AI: str
	Response: str
	Search: str
	Brand_Mentions: int
	Total_Citations: int
	Brand_Citations: int
	Citation_Position: int | None
	Brand_Links: int
	Citation_Brand_URLs: str
	Total_Citations_URLs: str
