import re
from typing import List, Tuple, Dict


def extract_urls(text: str) -> List[str]:
	# simple URL regex
	pattern = re.compile(r"https?://[^\s)\]]+")
	return pattern.findall(text or "")


def count_mentions(text: str, terms: List[str]) -> int:
	if not text or not terms:
		return 0
	text_low = text.lower()
	return sum(text_low.count(term.strip().lower()) for term in terms if term.strip())


def compute_metrics(response: str, *, site: str, brands: List[str]) -> Dict:
	urls = extract_urls(response)
	brand_urls = [u for u in urls if site in u]
	other_urls = [u for u in urls if site not in u]

	# Citation position: index of first brand url among all urls (1-based)
	citation_pos = None
	for idx, u in enumerate(urls, start=1):
		if site in u:
			citation_pos = idx
			break

	return {
		"Brand_Mentions": count_mentions(response, brands),
		"Total_Citations": len(urls),
		"Brand_Citations": len(brand_urls),
		"Citation_Position": citation_pos,
		"Brand_Links": len(brand_urls),
		"Citation_Brand_URLs": ", ".join(brand_urls),
		"Total_Citations_URLs": ", ".join(other_urls),
	}
