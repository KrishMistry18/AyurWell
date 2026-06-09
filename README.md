<div align="center">

# 🌿 AyurWell

### Ancient Wisdom, Modern Wellness

[![Live Demo](https://img.shields.io/badge/🔗%20Live%20Demo-ayur--well.vercel.app-2D6A4F?style=for-the-badge)](https://ayur-well.vercel.app/)
[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Claude AI](https://img.shields.io/badge/Claude%20AI-D97757?style=for-the-badge&logo=anthropic&logoColor=white)](https://anthropic.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

*A full-stack Ayurvedic wellness platform combining 5,000 years of Ayurvedic principles with modern AI — personalized dosha-based diet plans, an AI wellness coach, symptom analysis, and community tools, all in one place.*

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🪷 **Dosha Quiz** | 20-question assessment to discover your Ayurvedic constitution |
| 🥗 **Smart Diet Plans** | Personalized 7-day meal plans based on dosha, season & goals |
| 📊 **Wellness Analytics** | Track energy, sleep, water & mood with beautiful charts |
| 🌿 **Seasonal Tips** | 60 curated Ayurvedic tips across all seasons and doshas |
| 🤖 **AI Wellness Coach** | Chat with Vaidya — powered by Claude AI with graceful fallback |
| 📄 **PDF Export** | Download your diet plan as a beautifully formatted PDF |
| 🎯 **Onboarding Tour** | 8-step guided tour for new users with spotlight & confetti |
| 🩺 **Symptom Guide** | AI-powered Ayurvedic symptom analysis with remedies & herbs |
| 👥 **Community Feed** | Share recipes, tips, and experiences with the community |
| 💞 **Compatibility** | Dosha compatibility checker with shareable results |
| 📊 **Weekly Reports** | AI-generated PDF wellness reports with insights |
| 🏆 **Gamification** | Streaks, badges, and achievements for consistency |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, TailwindCSS |
| Backend | Django REST Framework, Python 3.10+ |
| AI | Claude 3 Haiku (Anthropic) with intelligent fallback |
| Database | SQLite (local) / PostgreSQL via env |
| Auth | Token-based (DRF) |
| PDF Generation | ReportLab |
| API Docs | drf-spectacular (Swagger UI + ReDoc) |
| Deployment | Vercel |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or bun

### 1. Clone & Install Frontend

```bash
git clone https://github.com/KrishMistry18/AyurWell.git
cd AyurWell
npm install
```

### 2. Setup Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
SECRET_KEY=your-50-char-random-secret-key
ANTHROPIC_API_KEY=sk-ant-your-key-here   # optional — enables real AI
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

> Without an API key, all AI features use intelligent built-in fallback responses.
> Get a Claude key at: https://console.anthropic.com/

### 4. Run Migrations & Seed Data

```bash
cd backend
python manage.py migrate
python manage.py seed_tips
python manage.py seed_herbs
python manage.py seed_badges
```

### 5. Start Both Servers

**Terminal 1 — Backend (port 8000):**
```bash
cd backend
python manage.py runserver
```

**Terminal 2 — Frontend (port 8080):**
```bash
npm run dev
```

Open **http://localhost:8080** 🎉

---

## 📁 Project Structure

```
AyurWell/
├── backend/                        # Django REST API
│   ├── api/
│   │   ├── models.py               # All 15 models
│   │   ├── views.py                # Core views (auth, coach, tips, diet, pulse, herbs, gamification)
│   │   ├── views_features.py       # Feature views (symptoms, community, compatibility, reports)
│   │   ├── views_admin.py          # Staff-only audit log + stats endpoints
│   │   ├── middleware.py           # AuditLogMiddleware + SecurityHeadersMiddleware
│   │   ├── security.py             # Rate limiting, input sanitization, validation
│   │   └── management/commands/
│   │       ├── seed_tips.py        # Seeds 60 seasonal tips
│   │       ├── seed_herbs.py       # Seeds herb encyclopedia
│   │       └── seed_badges.py      # Seeds gamification badges
│   ├── ayurwell/
│   │   ├── settings.py             # Config with decouple, security headers, rate limiting
│   │   └── urls.py                 # Routes including /api/docs/, /api/redoc/
│   └── .env.example
│
└── src/                            # React + TypeScript frontend
    ├── components/
    │   ├── Navbar.tsx
    │   ├── OnboardingTour.tsx       # 8-step spotlight tour
    │   └── StreakWidget.tsx
    └── pages/
        ├── DoshaQuiz.tsx
        ├── Dashboard.tsx
        ├── Coach.tsx                # AI chat (Vaidya)
        ├── SymptomChecker.tsx
        ├── Community.tsx
        ├── Compatibility.tsx
        └── Reports.tsx
```

---

## 📖 API Documentation

AyurWell ships with full interactive API docs powered by **drf-spectacular**.

| URL | Description |
|---|---|
| `/api/docs/` | **Swagger UI** — Interactive try-it-out docs |
| `/api/redoc/` | **ReDoc** — Clean readable alternative |
| `/api/schema/` | **OpenAPI 3.0 Schema** — Download as YAML/JSON |

### Authentication in Swagger UI

1. Call `POST /api/auth/login/` with your credentials
2. Copy the `token` from the response
3. Click **Authorize** → enter `Token <your-token>`

### Rate Limits

| Endpoint | Limit |
|---|---|
| `POST /api/auth/login/` | 5 / min / IP |
| `POST /api/auth/register/` | 3 / min / IP |
| `POST /api/coach/chat/` | 20 / hr / user |
| `POST /api/symptoms/analyze/` | 10 / hr / user |
| All other endpoints | 100 / min / user |

---

## 🔒 Security

- **Rate Limiting** — Per-IP for auth, per-user for AI endpoints
- **Input Sanitization** — All text inputs sanitized with `bleach` (strips XSS)
- **Security Headers** — X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- **Audit Logging** — Every API request logged with user, IP, path, status, response time
- **Environment Config** — All secrets via `.env` using `python-decouple`

Run the built-in security checker:

```bash
python manage.py check_security
```

---

## 🤖 AI Features

All AI features use **Claude 3 Haiku** and fall back gracefully when no API key is set.

| Feature | AI Capability | Fallback |
|---|---|---|
| Wellness Coach | Personalized dosha-aware advice | 4 topic-based responses |
| Symptom Analysis | Full Ayurvedic analysis JSON | 4 symptom-specific responses |
| Pulse Check | Wellness score + insights | Formula-based scoring |
| Meal Swap | Alternative meal suggestion | 4 meal-type alternatives |
| Weekly Report | 3–4 personalized insights | Metric-based insights |

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `primary` | `#2D6A4F` | Deep forest green — CTAs, headings |
| `primary-light` | `#52B788` | Lighter green — hover states |
| `accent` | `#E9C46A` | Warm amber — secondary CTAs |
| `surface` | `#FEFAE0` | Warm parchment — page background |
| `dosha-vata` | `#7B9CBF` | Cool blue — Vata elements |
| `dosha-pitta` | `#E07A5F` | Warm red-orange — Pitta elements |
| `dosha-kapha` | `#6B8F71` | Earthy green — Kapha elements |

**Fonts:** Playfair Display (headings) · Inter (body)

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

---

## License

MIT — see `LICENSE` for details.

---

<div align="center">

*Made with 🌿 for wellness · AyurWell v1.0.0 · Built by [Krish Mistry](https://github.com/KrishMistry18)*

</div>