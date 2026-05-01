# Dorm Advisor

A platform for college students to rate, review, and discover dormitories. Built with Spring Boot 4 (Java 21) and Next.js 15.

---

## Prerequisites

| Tool | Required version | Notes |
|------|-----------------|-------|
| Java (JDK) | **21** | Must be on `PATH`; Maven wrapper (`mvnw`) is bundled — no system Maven needed |
| Node.js | **20 LTS** or later | Only needed for Option B (native frontend dev) |
| PostgreSQL | **17.x** | Only needed for Option B; Option A uses Docker |
| Docker Desktop | Latest stable | Required for both options |

---

## Option A — Full Docker stack (recommended for evaluators)

One command starts PostgreSQL, Mailpit, the Spring Boot backend, and the Next.js frontend.

```bash
git clone <repo-url>
cd dorm-advisor
docker compose up --build
```

Wait for `Started ApiApplication` in the backend logs, then open:

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Email inbox (magic links) | http://localhost:8025 |

Stop everything: `docker compose down`

> Google OAuth2 requires real credentials configured in `application.properties` (see Environment Variables below). Magic-link login works out of the box with no extra setup.

---

## Option B — Native development mode

### Step 1 — Create the database

```bash
psql -U postgres -c "CREATE DATABASE dormadvisor;"
```

### Step 2 — Start Mailpit (email catcher)

```bash
docker compose up -d mailpit
```

### Step 3 — Start the backend

```bash
cd backend/api
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

Flyway migrations run automatically on first startup. Backend listens on port 8080.

### Step 4 — Create the frontend environment file

Create `frontend/.env.local` with:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Step 5 — Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend listens on port 3000.

---

## Environment Variables / Configuration

All backend configuration lives in `backend/api/src/main/resources/application.properties`. The defaults work for local development — no changes are required unless noted.

| Property | Default value | Change needed? |
|----------|--------------|---------------|
| `spring.datasource.url` | `jdbc:postgresql://localhost:5432/dormadvisor?stringtype=unspecified` | No |
| `spring.datasource.username` | `postgres` | Only if your local Postgres user differs |
| `spring.datasource.password` | `postgres` | Only if your local Postgres password differs |
| `app.jwt.secret` | *(base64 key pre-filled)* | No — safe for local use |
| `app.jwt.expiry-hours` | `1` | No |
| `app.auth.token-expiry-minutes` | `15` | No |
| `app.auth.base-url` | `http://localhost:8080` | No |
| `app.frontend.url` | `http://localhost:3000` | No |
| `spring.mail.host` | `localhost` | No (Mailpit handles it) |
| `spring.mail.port` | `1025` | No |
| `app.photo.upload-dir` | `./uploads/photos` | No |
| `spring.security.oauth2.client.registration.google.client-id` | `YOUR_GOOGLE_CLIENT_ID` | **Only if testing Google login** |
| `spring.security.oauth2.client.registration.google.client-secret` | `YOUR_GOOGLE_CLIENT_SECRET` | **Only if testing Google login** |

Frontend environment variable (Option B only):

| Variable | Value | File |
|----------|-------|------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | `frontend/.env.local` |

---

## Admin Access

The admin panel at `/admin` is restricted to a single account: **maksim@pte.hu**. Sign in with that email via magic link to access moderation queues for schools, dorms, reviews, and Q&A. All other authenticated users have standard access only.

---

## Verification Checklist

After startup, confirm the following:

- [ ] `http://localhost:3000` loads the Dorm Advisor homepage
- [ ] Click **Sign In**, enter any email address, submit — "Check your inbox" message appears
- [ ] Open `http://localhost:8025` — the magic-link email is there; clicking the link logs you in
- [ ] Browse to a school → dorm page — reviews and the Q&A widget are visible
- [ ] Sign in as `maksim@pte.hu` — the **Admin** link appears in the navbar and moderation queues load at `/admin`

---

## Notes

- The Maven wrapper (`mvnw`) is committed to the repo — no system-level Maven installation is required.
- `spring.docker.compose.enabled=false` is set intentionally; Spring Boot will **not** auto-start Docker Compose. Run `docker compose up` manually.
- Flyway owns the database schema entirely — Hibernate never creates or alters tables. All migrations apply automatically on backend startup.
- Photo uploads are stored under `app.photo.upload-dir`. In the Docker stack this is a named volume (`uploads`) so photos persist across container restarts.
