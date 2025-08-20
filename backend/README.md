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

## Примечания
- Временные пользователи заданы в коде (`admin/admin`, `user/user`). План: вынести в БД/хранилище.
- Сессия по JWT истекает через 24 часа (под ТЗ). Управление "завершить все сессии" будет реализовано через хранилище токенов/блок-лист.
