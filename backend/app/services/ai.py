from typing import List
import asyncio
import os
import csv
from openai import AsyncOpenAI
from ..services.calculation import extract_urls
from ..core.config import settings


OPENAI_API_KEY = settings.openai_api_key


_openai_semaphore = asyncio.Semaphore(1)


def _serialize_csv_row(fields: List[str], delimiter: str = ";;", line_ending: str = "\r\n") -> str:
	out: List[str] = []
	for v in fields:
		s = "" if v is None else str(v)
		needs_quote = ("\n" in s) or ("\r" in s) or ("\"" in s) or (delimiter in s)
		if needs_quote:
			s = '"' + s.replace('"', '""') + '"'
		out.append(s)
	return delimiter.join(out) + line_ending


async def process_requests(requests: List[str], *, delay_seconds: float = 10.0, output_csv: str | None = None) -> None:
	f = None
	if output_csv:
		d = os.path.dirname(output_csv)
		if d:
			os.makedirs(d, exist_ok=True)
		new_file = not os.path.exists(output_csv)
		# Use UTF-8 with BOM; write lines manually to support multi-character delimiter (e.g., ';;').
		mode = "w" if new_file else "a"
		f = open(output_csv, mode, newline="", encoding="utf-8-sig")
		if new_file:
			f.write(_serialize_csv_row(["index", "prompt", "answer"], delimiter=settings.csv_delimiter))
	for i, q in enumerate(requests, start=1):
		if not q or not str(q).strip():
			continue
		try:
			ans = await ask_openai_with_web_search_tool(q)
			if f:
				line = _serialize_csv_row([str(i), q, ans], delimiter=settings.csv_delimiter)
				f.write(line)
				f.flush()
				try:
					os.fsync(f.fileno())
				except Exception:
					pass
			print(f"Q{i}: {q}\nA{i}: {ans}\n{'-'*40}")
		except Exception as e:
			print(f"Q{i} ERROR: {q}\n{e}\n{'-'*40}")
		if delay_seconds and i < len(requests):
			await asyncio.sleep(delay_seconds)
	if f:
		f.close()


async def ask_openai_with_web_search_tool(prompt: str) -> str:
	"""
	Использует OpenAI Responses API с инструментом web_search_preview.
	Возвращает: ответ + пустая строка + список ссылок (из ответа).
	"""
	if not OPENAI_API_KEY:
		raise RuntimeError("OPENAI_API_KEY is not set")
	model = settings.openai_model
	client = AsyncOpenAI(api_key=OPENAI_API_KEY)
	async with _openai_semaphore:
		resp = await client.responses.create(
			model=model,
			tools=[{"type": "web_search_preview", "search_context_size": "low"}],
			input=prompt,
			instructions=(
				"Отвечай по-русски. Сначала дай подробный и структурированный итоговый ответ (список/абзацы), "
				"после него на новой строке перечисли источники (каждая ссылка с новой строки)."
			),
			parallel_tool_calls=False,
			max_tool_calls=1,
			max_output_tokens=2048,
		)

	try:
		usage = getattr(resp, "usage", None)
		if usage:
			rin = getattr(usage, 'input_tokens', None)
			rout = getattr(usage, 'output_tokens', None)
			rrsn = getattr(getattr(usage, 'output_tokens_details', None), 'reasoning_tokens', None)
			print(f"OpenAI usage: input={rin}, output={rout}, reasoning={rrsn}")
	except Exception:
		pass

	text = getattr(resp, "output_text", None)
	if not text:
		raise RuntimeError("No output_text in OpenAI response")
	links = extract_urls(text)
	uniq_links: List[str] = []
	for u in links:
		if u not in uniq_links:
			uniq_links.append(u)
	tail = ("\n\n" + "\n".join(uniq_links)) if uniq_links else ""
	return (text or "").strip() + tail

