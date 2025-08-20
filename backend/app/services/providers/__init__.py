# Provider registry placeholder
from typing import Protocol, Any

class AIProvider(Protocol):
    name: str
    async def ask(self, query: str, *, country: str, language: str, model: str | None = None) -> dict: ...

PROVIDERS: dict[str, AIProvider] = {}
