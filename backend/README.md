# LLM Response Analyzer — Backend (FastAPI)

## Требования
- Python 3.11+
- uv (https://docs.astral.sh/uv/)

## Установка зависимостей (Windows PowerShell)
```powershell
# перейти в папку backend
cd backend

# создать и синхронизировать окружение по pyproject.toml
uv sync

# (опционально) зафиксировать версию Python
# $env:UV_PYTHON = "3.11"; uv sync

# запустить сервер в dev-режиме
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API будет доступно по адресу: http://localhost:8000
Документация Swagger: http://localhost:8000/docs

## Переменные окружения
Создайте файл `.env` в папке `backend` на основе примера ниже:

```
JWT_SECRET_KEY=change_me
```

## Маршруты (минимум)
- POST `/api/v1/auth/login` — вход по OAuth2 (form-data: username, password), возвращает JWT
- GET `/api/v1/auth/me` — текущий пользователь по Bearer-токену

## Пользователи и смена пароля
Пользователи и пароли хранятся в файле `backend/users.json`:

```
[
	{ "username": "admin", "password": "admin", "role": "admin" },
	{ "username": "user", "password": "user", "role": "user" }
]
```

Чтобы изменить логин/пароль — отредактируйте этот файл и перезапустите сервер. Пароль хранится в открытом виде (при старте автоматически хэшируется).

## Капча
В запросе на /api/v1/auth/login обязательно передавать поле `captcha_token` (в query или заголовке `X-Captcha-Token`). Сейчас это заглушка (любое непустое значение).

## Примечания
- Сессия по JWT истекает через 24 часа (под ТЗ). Управление "завершить все сессии" реализовано через endpoint /api/v1/auth/logout_all (только для admin).
