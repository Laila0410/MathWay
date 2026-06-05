# mathWay

**mathWay** — платформа для просмотра учебных видео по математике (@LailaTaubay): сетка уроков, просмотр, избранное и заметки к каждому видео; есть квизы и элементы геймификации (лидерборд, профиль).

## Автор проекта
Taubay Laila, sophomore
---

## Как запустить проект локально

Нужны **два терминала**: сначала backend, затем frontend.

Команды ниже выполняйте из каталога **`web-dev-project`** (рядом должны лежать папки `backend` и `frontend`).

### Что установить

- **Python** 3.11 или новее  
- **Node.js** 18+ и **npm**

### 1. Backend (Django + Django REST Framework)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_mathway
python manage.py runserver 8000
```

Админ по умолчанию после `seed_mathway`: пользователь `admin`, пароль `admin` (только для разработки).

База по умолчанию — **SQLite** (`backend/db.sqlite3`). Для **PostgreSQL** задайте переменные окружения `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT` (см. `config/settings.py`).

### 2. Frontend (Angular)

```powershell
cd frontend
npm install
npm start
```

Откройте в браузере: **http://localhost:4200**  
API по умолчанию: **http://localhost:8000** (указано в `frontend/src/app/services/api.service.ts` и `auth.service.ts`).

---

## Стек

- **Frontend:** Angular 21+  
- **Backend:** Django 5, Django REST Framework, JWT (`djangorestframework-simplejwt`)  
- **База:** SQLite (локально) или PostgreSQL (через переменные окружения)

---

## Как проект закрывает требования (кратко)

### Back-end (Django + DRF)

- **Модели и связи:** пользователь (встроенная модель Django), `Video`, `Note` и `Favorite` с внешними ключами на видео и пользователя.  
- **Кастомный менеджер** для избранного (выборка избранного пользователя).  
- **Сериализаторы:** ModelSerializer и явные сериализаторы для списка видео и авторизации.  
- **Представления:** функциональные (`@api_view`) и классовые (`APIView`).  
- **Аутентификация:** JWT; заметки и избранное привязаны к `request.user`.  
- **CRUD** для заметок.  
- **CORS** для запросов с `http://localhost:4200`.

### Front-end (Angular)

- Интерфейсы и сервисы (`ApiService`, `AuthService`), маршруты `/login`, `/videos`, `/videos/:id` и др.  
- Формы с `[(ngModel)]`, обработчики `(click)`, шаблонные директивы (`@for`, `@if`).  
- Базовая вёрстка (CSS Grid / Flexbox).  
- Interceptor для JWT и простая обработка ошибок API.

---

## Обзор API

В репозитории есть коллекция для Postman: **`postman_collection.json`**.

### Аутентификация

- `POST /api/auth/login/` — вход, выдача JWT  
- `POST /api/auth/logout/` — выход  
- `POST /api/auth/register/` — регистрация (если включено в маршрутах)

### Видео

- `GET /api/videos/` — список для сетки  
- `GET /api/videos/<id>/` — детали и YouTube ID  

### Заметки (CRUD)

- `GET /api/notes/?video_id=<id>`  
- `POST /api/notes/`  
- `GET /api/notes/<id>/`  
- `PUT /api/notes/<id>/`  
- `DELETE /api/notes/<id>/`  

### Избранное

- `GET /api/favorites/`  
- `POST /api/favorites/`  
- `DELETE /api/favorites/<id>/`  

Дополнительно в приложении могут быть маршруты профиля, лидерборда и квизов — см. `frontend/src/app/services/api.service.ts` и `backend/config/urls.py`.
