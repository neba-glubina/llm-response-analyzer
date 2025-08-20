from fastapi import APIRouter

router = APIRouter()

@router.get("/config/models")
async def get_models():
    # TODO: return models per provider
    return {
        "ChatGPT": ["gpt-4o", "gpt-4.1"],
        "Perplexity": ["sonar-large"],
        "Gemini": ["gemini-1.5-pro"],
        "DeepSeek": ["deepseek-chat"],
        "Yandex": ["yandexgpt-lite"],
    }

@router.get("/config/countries")
async def get_countries():
    return ["US", "GB", "DE", "RU"]

@router.get("/config/languages")
async def get_languages():
    return ["en", "ru", "de"]
