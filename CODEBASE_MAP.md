# Codebase Map - AyurWell

This document maps all modules, routes, API endpoints, UI elements, and TypeScript compilation status of the AyurWell codebase.

## 1. Frontend Page Components & State

Located in `src/pages/`:

| Component | Route Path | Description & Current State |
|---|---|---|
| [Home.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/Home.tsx) | `/` | Hero landing page introducing the platform, main benefits, and onboarding trigger. **Status: Fully Functional.** |
| [Features.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/Features.tsx) | `/features` | Core platform feature list outlining seasonal tip parameters, coach, and reports. **Status: Fully Functional.** |
| [DietGenerator.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/DietGenerator.tsx) | `/diet-generator` | Personalized 7-day Ayurvedic meal planner with options to swap meals and export to PDF. **Status: Fully Functional.** |
| [Dashboard.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/Dashboard.tsx) | `/dashboard` | User wellness command center displaying daily routine, todays wisdom, logs summary, and shortcuts. **Status: Fully Functional.** |
| [Auth.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/Auth.tsx) | `/auth` | Login and Registration pages handling token retrieval, caching, and state management. **Status: Fully Functional.** |
| [DoshaQuiz.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/DoshaQuiz.tsx) | `/dosha` | 20-question Ayurvedic constitution quiz evaluating Vata, Pitta, and Kapha percentages. **Status: Fully Functional.** |
| [Analytics.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/Analytics.tsx) | `/analytics` | Interactive charts showing water intake, sleep, energy level, and mood logs over time. **Status: Fully Functional.** |
| [WellnessCoach.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/WellnessCoach.tsx) | `/coach` | Interactive AI Chat Coach (Vaidya) using streaming-like UI for wellness advice. **Status: Fully Functional.** |
| [Tips.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/Tips.tsx) | `/tips` | Curated daily tips filtered by season, category, and dosha with save features. **Status: Fully Functional.** |
| [Pulse.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/Pulse.tsx) | `/pulse` | Generates a virtual pulse-reading and displays historical results. **Status: Fully Functional.** |
| [HerbEncyclopedia.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/HerbEncyclopedia.tsx) | `/herbs` | Scrollable catalog of Ayurvedic herbs with search filter and preferred toggle features. **Status: Fully Functional.** |
| [Achievements.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/Achievements.tsx) | `/achievements` | Gamification panel tracking user streaks, levels, and unlocked badges. **Status: Fully Functional.** |
| [SymptomChecker.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/SymptomChecker.tsx) | `/symptoms` | 3-step symptom guide retrieving Ayurvedic remedies and precautions. **Status: Fully Functional.** |
| [Community.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/Community.tsx) | `/community` | Feed for posting recipes/tips, liking, and commenting on community posts. **Status: Fully Functional.** |
| [Compatibility.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/Compatibility.tsx) | `/compatibility` | Evaluates compatibility between two doshas and generates shareable profile URLs. **Status: Fully Functional.** |
| [Reports.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/Reports.tsx) | `/reports` | Displays generated weekly wellness reports and offers PDF downloads. **Status: Fully Functional.** |
| [About.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/About.tsx) | *No route* | Static info page outlining philosophy and brand details. **Status: Static.** |
| [Index.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/Index.tsx) | *Redirect* | Root path redirect to `/`. **Status: Fully Functional.** |
| [NotFound.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/pages/NotFound.tsx) | `*` | Custom 404 page. **Status: Fully Functional.** |

## 2. Frontend Reusable Components

Located in `src/components/`:

- [Navbar.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/components/Navbar.tsx): Sticky layout header with navigation links, auth actions, and theme toggle.
- [OnboardingTour.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/components/OnboardingTour.tsx): An 8-step guided spotlight tour using overlay elements.
- [PWAInstallBanner.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/components/PWAInstallBanner.tsx): Responsive prompt urging mobile/desktop installation.
- [PulseCard.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/components/PulseCard.tsx): Interactive virtual pulse test component.
- [StreakWidget.tsx](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/src/components/StreakWidget.tsx): Custom display representing the user's active login/wellness logging streak.

## 3. Backend API Endpoints

Mapped under `/api/` (defined in [urls.py](file:///C:/Users/Admin/Desktop/Krish/Ayurwell/backend/api/urls.py)):

| Endpoint Path | HTTP Method | Auth Required | Description |
|---|---|---|---|
| `/api/health/` | GET | No | Basic API server health check |
| `/api/auth/register/` | POST | No | Create new user account |
| `/api/auth/login/` | POST | No | Retrieve Token Auth token |
| `/api/auth/me/` | GET | Yes | Retrieve profile details of authenticated user |
| `/api/users/onboarding-complete/` | POST | Yes | Save primary and secondary dosha quiz results |
| `/api/coach/chat/` | POST | Yes | Get response from AI wellness coach (Vaidya) |
| `/api/coach/history/` | GET | Yes | Retrieve previous chat conversations |
| `/api/tips/today/` | GET | Yes | Retrieve daily tips corresponding to current season & dosha |
| `/api/tips/all/` | GET | Yes | Get list of all seasonal tips with optional tag filtering |
| `/api/diet/export-pdf/` | POST | Yes | Generate and download 7-day meal plan as PDF |
| `/api/diet/swap-meal/` | POST | Yes | Swap a meal in the diet plan with a suitable alternative |
| `/api/pulse/generate/` | POST | Yes | Trigger a virtual pulse diagnostic check |
| `/api/pulse/today/` | GET | Yes | Retrieve today's logged pulse test data |
| `/api/pulse/history/` | GET | Yes | Get past 30 days of logged pulse checks |
| `/api/herbs/` | GET | Yes | List all cataloged Ayurvedic herbs with details |
| `/api/herbs/<id>/` | GET | Yes | Retrieve details of a specific herb |
| `/api/herbs/<id>/toggle-preferred/` | POST | Yes | Add/remove herb to/from preferred bookmark list |
| `/api/gamification/profile/` | GET | Yes | Retrieve streaks, progress level, and badges |
| `/api/gamification/log/` | POST | Yes | Log water, sleep, mood, energy and update daily streak |
| `/api/gamification/check/` | POST | Yes | Validate criteria to award unlocked badges |
| `/api/symptoms/analyze/` | POST | Yes | Run symptom guides, remedies, and safety checks |
| `/api/symptoms/history/` | GET | Yes | Retrieve past checked symptoms |
| `/api/community/feed/` | GET | Yes | View paginated social posts |
| `/api/community/posts/` | POST | Yes | Share a new post to the community feed |
| `/api/community/posts/<id>/like/` | POST | Yes | Toggle like status on a post |
| `/api/community/posts/<id>/comments/` | GET, POST | Yes | Read or write comments on a social post |
| `/api/compatibility/check/` | POST | Yes | Evaluate compatibility index between two doshas |
| `/api/compatibility/share/` | POST | Yes | Generate shared result code/link |
| `/api/compatibility/invite/<code>/` | GET | No | View a shared compatibility calculation |
| `/api/reports/generate/` | POST | Yes | Request AI generation of weekly wellness report |
| `/api/reports/` | GET | Yes | List all weekly reports |
| `/api/reports/<id>/download/` | GET | Yes | Download a generated report in PDF format |
| `/api/admin/audit-logs/` | GET | Staff only | Retrieve event log list |
| `/api/admin/stats/` | GET | Staff only | Gather administrative statistics |

## 4. Installed shadcn UI Components

Located in `src/components/ui/`:

- Accordion (`accordion.tsx`)
- Alert Dialog (`alert-dialog.tsx`)
- Alert (`alert.tsx`)
- Aspect Ratio (`aspect-ratio.tsx`)
- Avatar (`avatar.tsx`)
- Badge (`badge.tsx`)
- Breadcrumb (`breadcrumb.tsx`)
- Button (`button.tsx`)
- Calendar (`calendar.tsx`)
- Card (`card.tsx`)
- Carousel (`carousel.tsx`)
- Chart (`chart.tsx`)
- Checkbox (`checkbox.tsx`)
- Collapsible (`collapsible.tsx`)
- Command (`command.tsx`)
- Context Menu (`context-menu.tsx`)
- Dialog (`dialog.tsx`)
- Drawer (`drawer.tsx`)
- Dropdown Menu (`dropdown-menu.tsx`)
- Form (`form.tsx`)
- Hover Card (`hover-card.tsx`)
- Input OTP (`input-otp.tsx`)
- Input (`input.tsx`)
- Label (`label.tsx`)
- Menubar (`menubar.tsx`)
- Navigation Menu (`navigation-menu.tsx`)
- Pagination (`pagination.tsx`)
- Popover (`popover.tsx`)
- Progress (`progress.tsx`)
- Radio Group (`radio-group.tsx`)
- Resizable (`resizable.tsx`)
- Scroll Area (`scroll-area.tsx`)
- Select (`select.tsx`)
- Separator (`separator.tsx`)
- Sheet (`sheet.tsx`)
- Sidebar (`sidebar.tsx`)
- Skeleton (`skeleton.tsx`)
- Slider (`slider.tsx`)
- Sonner (`sonner.tsx`)
- Switch (`switch.tsx`)
- Table (`table.tsx`)
- Tabs (`tabs.tsx`)
- Textarea (`textarea.tsx`)
- Toast (`toast.tsx`)
- Toaster (`toaster.tsx`)
- Toggle Group (`toggle-group.tsx`)
- Toggle (`toggle.tsx`)
- Tooltip (`tooltip.tsx`)

**Custom utilities:**
- `EmptyState.tsx` (generic empty feedback state)
- `SkeletonCard.tsx` (pre-defined layout card loader)
- `TopLoadingBar.tsx` (top-aligned page routing progress indicator)
- `use-toast.ts` (radix-ui toast hook interface)

## 5. TypeScript Compilation Status

- **Status:** **0 compilation errors.**
- Verified via `npx tsc --noEmit` (completed successfully on May 21, 2026).
