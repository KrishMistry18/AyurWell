<div align="center">

# 🌿 AyurWell — Wellness through Ayurveda

Personalized wellness companion blending ancient Ayurvedic wisdom with modern nutrition.

</div>

## ✨ Key Features

- 🧠 **Dosha Assessment**: Determine your Ayurvedic constitution and get tailored guidance.
- 🥗 **Smart Diet Generator**: Plans aligned to dosha, seasons, and nutrition best practices.
- 📊 **Progress Analytics**: Charts and trends for energy, sleep, hydration, and more.
- 🔐 **Secure Auth**: Django-backed signup/login with token-based authentication.
- 🧾 **Activity Tracking**: Login/signup events stored in the backend for auditing.
- 🖥️ **Modern UI**: React + Tailwind + shadcn components with responsive design.

## 🧩 Tech Stack

- Frontend: Vite + React + TypeScript + Tailwind + shadcn-ui
- Backend: Django + Django REST Framework + Token Auth + CORS

## 🚀 Local Development

Prerequisites: Node.js (LTS), Python 3.11+ (Windows: `py -3`), Git

```bash
# 1) Install frontend deps
npm ci

# 2) Start the frontend (Vite)
npm run dev
# → http://localhost:8080 (or 8081 if 8080 is busy)

# 3) In another terminal: set up and run Django
cd backend
py -3 -m venv venv
./venv/Scripts/Activate.ps1   # Windows PowerShell
python -m pip install --upgrade pip
pip install -r requirements.txt  # optional if you create one
python manage.py migrate
python manage.py runserver 8000
# → http://localhost:8000
```

Default superuser (created by setup steps above):

- Username: `krish@2005`
- Password: `krish@2005`

Useful URLs:

- Frontend: `http://localhost:8080`
- Backend health: `http://localhost:8000/api/health/`
- Admin: `http://localhost:8000/admin/`

## 🔐 API Endpoints (Auth)

- `POST /api/auth/register/` — body: `{ name, email, password }`
- `POST /api/auth/login/` — body: `{ email, password }`
- `GET /api/auth/me/` — header: `Authorization: Token <token>`

## 🗂️ Project Structure

```
src/                # Frontend source (React)
backend/            # Django project root
  ayurwell/         # Django settings/urls
  api/              # API app (views, models, urls)
```

## 📜 License

MIT © AyurWell
