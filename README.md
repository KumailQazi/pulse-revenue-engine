# Pulse — Revenue Engine

A full-stack revenue intelligence platform built with React 19, Hono, tRPC, and Drizzle ORM. Track user intent signals, manage tiered micro-offer funnels, and orchestrate multi-channel distribution campaigns from a unified dark-mode dashboard.

## Preview

| Dashboard | Distribution |
|-----------|-------------|
| Real-time KPIs, funnel visualization, milestone tracking | Multi-channel campaign pipeline with per-channel analytics |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite 7, Tailwind CSS, shadcn/ui (40+ components), Recharts |
| **Backend** | Hono (edge-ready server), tRPC (end-to-end type safety), SuperJSON |
| **Database** | Drizzle ORM with MySQL (schema migrations via drizzle-kit) |
| **Auth** | OAuth 2.0 with JWT sessions (JWKS verification, cookie-based auth) |
| **Infra** | Docker, Vercel (frontend), Railway (backend + DB) |

## Features

**Intent Tracking** — Capture search, click, scroll, hover, exit, and form signals. Score visitor intent in real-time with categorized keyword attribution.

**Micro Offer Stacking** — Build tiered offer ladders (tripwire → core → profit → max). Track conversion rates and revenue per tier with automatic stack ordering.

**Multi-Channel Distribution** — Launch campaigns across email, social, SEO, ads, affiliate, and content channels. Monitor reach, clicks, conversions, and revenue per campaign.

**Revenue Dashboard** — Unified KPI dashboard with milestone progress tracking, funnel visualization, top intent keywords, channel performance breakdown, and offer tier analytics.

**Auth & Roles** — OAuth 2.0 login flow with JWT session management. Admin role auto-assignment via environment config.

## Architecture

```
├── api/                  # Backend (Hono + tRPC)
│   ├── oauth/            # OAuth 2.0 auth flow, JWT sessions
│   ├── queries/          # Drizzle ORM database queries
│   ├── lib/              # Environment config, cookies, HTTP utils
│   ├── *Router.ts        # tRPC routers (intent, offer, conversion, distribution, dashboard)
│   └── boot.ts           # Server entry point
├── db/                   # Database layer
│   ├── schema.ts         # Drizzle schema (users, intents, microOffers, conversions, campaigns, goals)
│   ├── relations.ts      # Table relationships
│   └── migrations/       # SQL migrations
├── src/                  # Frontend (React)
│   ├── pages/            # Dashboard, Intents, Offers, Distribution, Home, Login
│   ├── components/       # shadcn/ui components + Layout
│   ├── hooks/            # useAuth hook
│   └── providers/        # tRPC + React Query provider
├── contracts/            # Shared types and constants
├── Dockerfile            # Production container
├── railway.toml          # Railway deployment config
└── vercel.json           # Vercel deployment config
```

## Getting Started

### Prerequisites

- Node.js 20+
- MySQL database

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your OAuth provider and database credentials

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Database Commands

```bash
npm run db:generate   # Generate migration files from schema changes
npm run db:migrate    # Apply pending migrations
npm run db:push       # Push schema directly (development)
```

## Deployment

### Frontend (Vercel)

```bash
# Connect your repo to Vercel
# Build command: npm run build
# Output directory: dist/public
# Add environment variables: VITE_OAUTH_SERVER_URL, VITE_APP_ID
```

### Backend (Railway)

```bash
# Connect your repo to Railway
# Railway will auto-detect the railway.toml config
# Add environment variables: APP_ID, APP_SECRET, DATABASE_URL, OAUTH_SERVER_URL, OAUTH_API_URL
# Provision a MySQL database on Railway
```

### Docker

```bash
docker build -t pulse .
docker run -p 3000:3000 --env-file .env pulse
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `APP_ID` | OAuth application ID | Yes |
| `APP_SECRET` | Application secret (JWT signing) | Yes |
| `DATABASE_URL` | MySQL connection string | Yes |
| `OAUTH_SERVER_URL` | OAuth authorization server URL | Yes |
| `OAUTH_API_URL` | OAuth API / user profile endpoint | Yes |
| `VITE_OAUTH_SERVER_URL` | OAuth server URL (frontend) | Yes |
| `VITE_APP_ID` | OAuth app ID (frontend) | Yes |
| `OWNER_UNION_ID` | Auto-admin user ID | No |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build frontend + backend for production |
| `npm start` | Run production server |
| `npm run check` | TypeScript type checking |
| `npm run lint` | ESLint |
| `npm run format` | Prettier formatting |
| `npm test` | Run tests with Vitest |

## License

MIT
