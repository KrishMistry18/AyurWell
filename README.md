# 🌿 AyurWell — Ancient Wisdom, Modern Wellness

A full-stack Ayurvedic wellness platform combining 5,000 years of Ayurvedic principles with modern technology.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🪷 **Dosha Quiz** | 20-question assessment to discover your Ayurvedic constitution |
| 🥗 **Smart Diet Plans** | Personalized 7-day meal plans based on dosha, season & goals |
| 📊 **Wellness Analytics** | Track energy, sleep, water & mood with beautiful charts |
| 🌿 **Seasonal Tips** | 60 curated Ayurvedic tips across all seasons and doshas |
| 🤖 **AI Wellness Coach** | Chat with Vaidya — powered by Claude AI (or smart fallback) |
| 📄 **PDF Export** | Download your diet plan as a beautifully formatted PDF |
| 🎯 **Onboarding Tour** | 8-step guided tour for new users with spotlight & confetti |
| 💧 **Quick Log FAB** | One-tap daily wellness logging from any protected page |
| 🩺 **Symptom Guide** | AI-powered Ayurvedic symptom analysis with remedies & herbs |
| 👥 **Community Feed** | Share recipes, tips, and experiences with the community |
| 💞 **Compatibility** | Dosha compatibility checker with shareable results |
| 📊 **Weekly Reports** | AI-generated PDF wellness reports with insights |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or bun

### 1. Clone & Install Frontend

```bash
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
# Copy the example and fill in your values
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
venv\Scripts\python.exe manage.py runserver   # Windows
python manage.py runserver                     # macOS/Linux
```

**Terminal 2 — Frontend (port 8080):**
```bash
npm run dev
```

Open **http://localhost:8080** 🎉

---

## 📖 API Documentation

AyurWell ships with full interactive API documentation powered by **drf-spectacular**.

### Accessing the Docs

| URL | Description |
|---|---|
| `http://localhost:8000/api/docs/` | **Swagger UI** — Interactive, try-it-out docs with AyurWell branding |
| `http://localhost:8000/api/redoc/` | **ReDoc** — Clean, readable alternative view |
| `http://localhost:8000/api/schema/` | **OpenAPI 3.0 Schema** — Download as YAML/JSON |

### Authentication in Swagger UI

1. Open `http://localhost:8000/api/docs/`
2. Call `POST /api/auth/login/` with your credentials
3. Copy the `token` from the response
4. Click the **Authorize** button (top right)
5. Enter: `Token <your-token-here>`
6. All subsequent requests will be authenticated

### curl Examples

**Register a new user:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepass123", "name": "Arjun Sharma"}'
```

**Login and get token:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepass123"}'
# Response: {"token": "abc123...", "username": "user@example.com", "name": "Arjun Sharma"}
```

**Analyze symptoms (authenticated):**
```bash
curl -X POST http://localhost:8000/api/symptoms/analyze/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token abc123..." \
  -d '{"symptoms": ["fatigue", "bloating"], "duration": "1 week", "severity": 3, "user_dosha": "vata"}'
```

**Check dosha compatibility:**
```bash
curl -X POST http://localhost:8000/api/compatibility/check/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token abc123..." \
  -d '{"dosha1": "vata", "dosha2": "pitta"}'
```

**Get community feed:**
```bash
curl http://localhost:8000/api/community/feed/?dosha_tag=vata&post_type=recipe \
  -H "Authorization: Token abc123..."
```

### Rate Limits

| Endpoint | Limit |
|---|---|
| `POST /api/auth/login/` | 5 per minute per IP |
| `POST /api/auth/register/` | 3 per minute per IP |
| `POST /api/coach/chat/` | 20 per hour per user |
| `POST /api/symptoms/analyze/` | 10 per hour per user |
| `POST /api/diet/export-pdf/` | 5 per hour per user |
| All other endpoints | 100 per minute per user |

Rate limit exceeded returns:
```json
{"error": "Rate limit exceeded", "retry_after": 45, "message": "Please wait 45 seconds before trying again."}
```

---

## 🏗️ Architecture

```
AyurWell/
├── backend/                        # Django REST API
│   ├── api/
│   │   ├── models.py               # All 15 models
│   │   ├── views.py                # Core views (auth, coach, tips, diet, pulse, herbs, gamification)
│   │   ├── views_features.py       # Feature views (symptoms, community, compatibility, reports)
│   │   ├── views_admin.py          # Staff-only audit log + stats endpoints
│   │   ├── admin.py                # Rich admin with custom dashboard
│   │   ├── middleware.py           # AuditLogMiddleware + SecurityHeadersMiddleware
│   │   ├── security.py             # Rate limiting, input sanitization, validation
│   │   ├── schemas.py              # OpenAPI schema helpers
│   │   └── management/commands/
│   │       ├── seed_tips.py        # Seeds 60 seasonal tips
│   │       ├── seed_herbs.py       # Seeds herb encyclopedia
│   │       ├── seed_badges.py      # Seeds gamification badges
│   │       └── check_security.py   # Security configuration checklist
│   ├── ayurwell/
│   │   ├── settings.py             # Full config with decouple, security headers, rate limiting
│   │   └── urls.py                 # Routes including /api/docs/, /api/redoc/, /api/schema/
│   ├── templates/
│   │   ├── swagger_ui.html         # Branded Swagger UI template
│   │   └── admin/
│   │       └── ayurwell_dashboard.html  # Custom admin analytics dashboard
│   ├── static/admin/css/
│   │   └── ayurwell_admin.css      # AyurWell green admin theme
│   ├── requirements.txt
│   └── .env.example                # All required env vars documented
│
└── src/                            # React + TypeScript frontend
    ├── components/
    │   ├── Navbar.tsx               # Sticky nav with all new routes
    │   ├── OnboardingTour.tsx       # 8-step spotlight tour
    │   ├── PulseCard.tsx            # Pulse check widget
    │   └── StreakWidget.tsx         # Streak display
    ├── pages/
    │   ├── Home.tsx                 # Landing page
    │   ├── Auth.tsx                 # Login/signup
    │   ├── DoshaQuiz.tsx            # 20-question quiz
    │   ├── Dashboard.tsx            # Wellness command center
    │   ├── Analytics.tsx            # Charts + logging
    │   ├── DietGenerator.tsx        # 7-day plan + PDF
    │   ├── Coach.tsx                # AI chat
    │   ├── Tips.tsx                 # Seasonal tips
    │   ├── Pulse.tsx                # Pulse history
    │   ├── Herbs.tsx                # Herb encyclopedia
    │   ├── Achievements.tsx         # Badges + streaks
    │   ├── SymptomChecker.tsx       # 3-step symptom analysis
    │   ├── Community.tsx            # Instagram-style feed
    │   ├── Compatibility.tsx        # Dosha compatibility
    │   └── Reports.tsx              # Weekly wellness reports
    └── hooks/
        └── useAuth.tsx              # Token-based auth context
```

---

## 🔒 Security

### Features Implemented

- **Rate Limiting** — Per-IP for auth, per-user for AI endpoints (using Django cache)
- **Input Sanitization** — All text inputs sanitized with `bleach` (strips HTML/XSS)
- **Numeric Validation** — All wellness metrics clamped to valid ranges
- **Security Headers** — X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
- **Audit Logging** — Every API request logged with user, IP, path, status, response time
- **Environment Config** — All secrets via `.env` using `python-decouple`

### Security Checklist

Run the built-in security checker:
```bash
python manage.py check_security
```

---

## 🛠️ Admin Panel

| URL | Description |
|---|---|
| `http://localhost:8000/admin/` | Standard Django admin |
| `http://localhost:8000/ayurwell-admin/` | Custom AyurWell admin site |
| `http://localhost:8000/ayurwell-admin/dashboard/` | Analytics dashboard |

### Admin Features
- **User management** — Dosha badges, streak display, activity log inline
- **Audit log viewer** — Filter by user, event type, severity, date range
- **Custom dashboard** — Today's stats, dosha distribution chart, 7-day activity, DB record counts
- **CSV exports** — Users, posts, audit logs
- **Admin actions** — Reset streaks, award badges, send wellness reminders

Create a superuser:
```bash
python manage.py createsuperuser
# or use the helper script:
python create_superuser.py
```

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `primary` | `#2D6A4F` | Deep forest green — CTAs, headings |
| `primary-light` | `#52B788` | Lighter green — hover states |
| `primary-dark` | `#1B4332` | Dark green — hero backgrounds |
| `accent` | `#E9C46A` | Warm amber — secondary CTAs |
| `surface` | `#FEFAE0` | Warm parchment — page background |
| `dosha-vata` | `#7B9CBF` | Cool blue — Vata elements |
| `dosha-pitta` | `#E07A5F` | Warm red-orange — Pitta elements |
| `dosha-kapha` | `#6B8F71` | Earthy green — Kapha elements |

**Fonts:** Playfair Display (headings) · Inter (body)

---

## 🤖 AI Features

All AI features use **Claude 3 Haiku** and fall back gracefully to curated responses when no API key is set.

| Feature | AI Capability | Fallback |
|---|---|---|
| Wellness Coach | Personalized dosha-aware advice | 4 topic-based responses |
| Symptom Analysis | Full Ayurvedic analysis JSON | 4 symptom-specific responses |
| Pulse Check | Wellness score + insights | Formula-based scoring |
| Meal Swap | Alternative meal suggestion | 4 meal-type alternatives |
| Weekly Report | 3-4 personalized insights | Metric-based insights |

---

## 📋 Full API Reference

| Method | Endpoint | Auth | Tag | Description |
|---|---|---|---|---|
| GET | `/api/health/` | No | auth | Health check |
| POST | `/api/auth/register/` | No | auth | Register (3/min/IP) |
| POST | `/api/auth/login/` | No | auth | Login (5/min/IP) |
| GET | `/api/auth/me/` | Yes | auth | Current user |
| POST | `/api/users/onboarding-complete/` | Yes | dosha | Save dosha result |
| POST | `/api/coach/chat/` | Yes | coach | AI chat (20/hr) |
| GET | `/api/coach/history/` | Yes | coach | Chat history |
| GET | `/api/tips/today/` | Yes | tips | Today's 3 tips |
| GET | `/api/tips/all/` | Yes | tips | All tips (filtered) |
| POST | `/api/diet/export-pdf/` | Yes | diet | Generate PDF |
| POST | `/api/diet/swap-meal/` | Yes | diet | Swap meal (3/day) |
| POST | `/api/pulse/generate/` | Yes | pulse | Generate pulse check |
| GET | `/api/pulse/today/` | Yes | pulse | Today's pulse |
| GET | `/api/pulse/history/` | Yes | pulse | 30-day history |
| GET | `/api/herbs/` | Yes | herbs | List herbs |
| GET | `/api/herbs/{id}/` | Yes | herbs | Herb detail |
| POST | `/api/herbs/{id}/toggle-preferred/` | Yes | herbs | Toggle preferred |
| GET | `/api/gamification/profile/` | Yes | gamification | Streak + badges |
| POST | `/api/gamification/log/` | Yes | gamification | Log activity |
| POST | `/api/symptoms/analyze/` | Yes | symptoms | Analyze (10/hr) |
| GET | `/api/symptoms/history/` | Yes | symptoms | Past checks |
| GET | `/api/community/feed/` | Yes | community | Paginated feed |
| POST | `/api/community/posts/` | Yes | community | Create post |
| POST | `/api/community/posts/{id}/like/` | Yes | community | Toggle like |
| GET/POST | `/api/community/posts/{id}/comments/` | Yes | community | Comments |
| POST | `/api/compatibility/check/` | Yes | compatibility | Check pair |
| POST | `/api/compatibility/share/` | Yes | compatibility | Generate link |
| GET | `/api/compatibility/invite/{code}/` | No | compatibility | Shared result |
| POST | `/api/reports/generate/` | Yes | reports | Generate report |
| GET | `/api/reports/` | Yes | reports | List reports |
| GET | `/api/reports/{id}/download/` | Yes | reports | Download PDF |
| GET | `/api/admin/audit-logs/` | Staff | admin | Audit logs |
| GET | `/api/admin/stats/` | Staff | admin | Platform stats |

---

*Made with 🌿 for wellness · AyurWell v1.0.0*
