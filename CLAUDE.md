# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Snapshot

- **Project name:** Dorm Advisor
- **Project type:** REST API (backend MVP; frontend TBD)
- **One-line description:** Platform for college students to rate, review, and discover dormitories.
- **Primary users:** College students — verified (school email) and anonymous guests
- **Business/domain context:** Higher-education housing discovery; schools and dorms are PENDING by default and require admin approval before appearing publicly
- **Lifecycle stage:** MVP
- **Default branch:** main
- **Repo status notes:** Backend feature-complete for MVP; no frontend yet

---

## Agent Principles

- Prefer the smallest safe change that solves the task.
- Preserve existing architecture and naming conventions — copy patterns already used nearby.
- Update `application.properties` or `compose.yaml` when adding new infrastructure (libs, services).
- Never touch `spring.jpa.hibernate.ddl-auto` — Flyway owns the schema.
- Ask before adding a new dependency when an existing one can solve the problem.
- Ask before any change to auth, token handling, or security configuration.

---

## Tech Stack

### Core

- **Language:** Java 21
- **Framework:** Spring Boot 4.0.5 / Spring Framework 7.0.6
- **ORM:** Hibernate 7.x via Spring Data JPA
- **Build:** Maven (use `./mvnw`, never system `mvn`)
- **Database:** PostgreSQL 17.x — local install on `localhost:5432`, database `dormadvisor`
- **Schema management:** Flyway 11.14.1 — migrations only, never `ddl-auto`
- **Email (local dev):** Mailpit via Docker — SMTP `:1025`, web UI `http://localhost:8025`

### Key Libraries

| Area | Library | Version | Purpose | Notes |
|------|---------|---------|---------|-------|
| Auth | JJWT | 0.12.6 | JWT generation + validation | HS256, secret from `app.jwt.secret` |
| Auth | Spring Security OAuth2 Client | (Boot-managed) | Google OAuth2 | Success handler writes JSON JWT |
| Code gen | Lombok | (Boot-managed) | Boilerplate reduction | `@RequiredArgsConstructor`, `@Slf4j`, `@Builder` |
| Cache | Caffeine + spring-boot-starter-cache | (Boot-managed) | In-process cache | 15-min TTL, 3 named caches |
| Photos | Thumbnailator | 0.4.20 | Image compression + resize | Max 1920×1080, 80% quality, JPEG output |
| Photos | Apache Tika | 2.9.2 | Real content-type detection | Never trust `file.getContentType()` |
| Email | spring-boot-starter-mail | (Boot-managed) | Magic link delivery | Mailpit in local dev |

### Version source of truth
`backend/api/pom.xml`

---

## Architecture

**Style:** Layered monolith — `Controller → Service → Repository → Entity`

**Package root:** `com.dormAdvisor.api`

```
controller/      HTTP layer — receives requests, calls service, returns DTOs
service/         Business logic — transactions, orchestration, validation
repository/      Spring Data JPA interfaces — extends JpaRepository<Entity, UUID>
domain/
  entity/        JPA entities — map DB tables 1:1
  entity/enums/  Java enums matching PostgreSQL enum types
  dto/           Java records — DTOs returned from controllers
security/        JwtAuthenticationFilter, JwtService, SecurityConfig, OAuth2SuccessHandler
config/          CacheConfig, FlywayConfig, JacksonConfig
```

**Rules:**
- Controllers never return entities — always DTOs via `fromEntity()`.
- Services own all `@Transactional` annotations — not controllers, not repositories.
- All `@ManyToOne` associations use `FetchType.LAZY`.
- Constructor injection only via `@RequiredArgsConstructor` — never `@Autowired` field injection.
- `@Value`-injected fields must NOT be `final` (conflicts with Lombok constructor generation).

---

## Repository Structure

```
dorm-advisor/                        # repo root
├── compose.yaml                     # Docker services: Mailpit only (Postgres is local, not Docker)
├── CLAUDE.md                        # this file
├── README.md
└── backend/
    └── api/                         # Spring Boot application
        ├── mvnw / mvnw.cmd
        ├── pom.xml                  # single source of truth for versions and dependencies
        └── src/main/
            ├── java/com/dormAdvisor/api/
            │   ├── ApiApplication.java
            │   ├── config/          # CacheConfig, FlywayConfig, JacksonConfig
            │   ├── controller/      # AuthController, DormController, ModerationController,
            │   │                    # PhotoController, ReviewController, SchoolController, UserController
            │   ├── domain/
            │   │   ├── dto/         # Java records — one per API surface
            │   │   └── entity/      # JPA entities + enums/
            │   ├── repository/      # Spring Data JPA interfaces
            │   ├── security/        # JwtAuthenticationFilter, JwtService,
            │   │                    # OAuth2AuthenticationSuccessHandler, SecurityConfig
            │   └── service/         # AuthService, DormService, EmailService, ModerationService,
            │                        # PhotoStorageService, ReviewService, SchoolService, UserService
            └── resources/
                ├── application.properties
                └── db/migration/
                    ├── V1__init_schema.sql   # full schema — never edit manually
                    └── V2__search_indexes.sql # pg_trgm + GIN indexes
```

### File placement rules
- New entity → `domain/entity/`, new enum → `domain/entity/enums/`
- New DTO (Java record) → `domain/dto/`
- New repository → `repository/` extending `JpaRepository<Entity, UUID>`
- New service → `service/` with `@Slf4j @RequiredArgsConstructor @Service`
- New controller → `controller/` with `@RestController @RequiredArgsConstructor @Slf4j`
- New Flyway migration → `db/migration/V{N}__{description}.sql` — increment N, never reuse

---

## Environment Setup

### Required

- **Java 21** — must be on PATH
- **Local PostgreSQL** — running on `localhost:5432`
- **Docker Desktop** — for Mailpit only

### First-time setup

```bash
# 1. Create the database (once)
psql -U postgres -c "CREATE DATABASE dormadvisor;"

# 2. Start Mailpit (needed for magic link emails)
docker compose up -d          # from repo root

# 3. Run the app — Flyway applies all migrations automatically on startup
cd backend/api
./mvnw spring-boot:run
```

`spring.docker.compose.enabled=false` is set — Spring Boot does NOT auto-start Docker Compose. Start it manually.

### Environment variables / config

All config lives in `backend/api/src/main/resources/application.properties`. No `.env` file.

Key properties to check before running:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/dormadvisor
spring.datasource.username=postgres
spring.datasource.password=postgres

app.jwt.secret=<base64-encoded 32+ byte secret>
app.jwt.expiry-hours=1
app.auth.token-expiry-minutes=15

app.photo.upload-dir=./uploads/photos

spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
```

---

## Development Commands

All commands run from `backend/api/` unless noted.

| Task | Command | Notes |
|------|---------|-------|
| Compile | `./mvnw compile` | Fastest check — catches all type errors |
| Run application | `./mvnw spring-boot:run` | Runs on `localhost:8080`; Flyway runs on startup |
| Package JAR | `./mvnw package -DskipTests` | Produces `target/api-*.jar` |
| Start Mailpit | `docker compose up -d` | From repo root |
| Stop Mailpit | `docker compose down` | From repo root |
| View magic link emails | `http://localhost:8025` | Mailpit web UI |

**No test suite exists yet.** Compile is the primary validation step.

---

## Endpoint Map

### Auth — `/api/auth`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/magic-link` | none | Send magic link email |
| GET | `/api/auth/verify?token=` | none | Consume token, return JWT |
| GET | `/api/auth/google` | none | Start Google OAuth2 flow |
| GET | `/api/auth/google/callback` | none | Google OAuth2 callback → JWT |

### Schools — `/api/schools`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/schools` | JWT | Create school (PENDING) |
| GET | `/api/schools` | JWT | List all schools |
| GET | `/api/schools/search?q=` | JWT | Trigram search, ACTIVE only |
| GET | `/api/schools/{id}` | JWT | Get school |
| PUT | `/api/schools/{id}` | JWT | Update school |
| DELETE | `/api/schools/{id}` | JWT | Delete school |

### Dorms — `/api`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/schools/{schoolId}/dorms` | JWT | Create dorm (PENDING) |
| GET | `/api/schools/{schoolId}/dorms` | JWT | List dorms for school |
| GET | `/api/schools/{schoolId}/dorms/rankings?minReviews=3` | JWT | Ranked by avg_overall |
| GET | `/api/schools/{schoolId}/dorms/search?q=` | JWT | Trigram search, ACTIVE only |
| GET | `/api/dorms/{id}` | JWT | Get dorm |
| PUT | `/api/dorms/{id}` | JWT | Update dorm |
| DELETE | `/api/dorms/{id}` | JWT | Delete dorm |

### Reviews — `/api`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/dorms/{dormId}/reviews` | **none** | Create review (guest or JWT) |
| GET | `/api/dorms/{dormId}/reviews` | JWT | List reviews for dorm |
| GET | `/api/reviews/{id}` | JWT | Get review |
| PUT | `/api/reviews/{id}` | JWT | Update review |
| DELETE | `/api/reviews/{id}` | JWT | Delete review |

### Photos — `/api`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/dorms/{dormId}/photos?file=&caption=` | **none** | Upload + compress photo (PENDING) |
| GET | `/api/dorms/{dormId}/photos` | **none** | Gallery (VISIBLE only) |
| GET | `/api/photos/{id}` | **none** | Serve full image |
| GET | `/api/photos/{id}/thumb` | **none** | Serve thumbnail |

### Admin / Moderation — `/api/admin`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/admin/schools/pending` | JWT | Queue of pending schools |
| POST | `/api/admin/schools/{id}/approve` | JWT | Approve → ACTIVE, log action |
| POST | `/api/admin/schools/{id}/reject` | JWT | Reject → REJECTED, log action |
| GET | `/api/admin/dorms/pending` | JWT | Queue of pending dorms |
| POST | `/api/admin/dorms/{id}/approve` | JWT | Approve dorm |
| POST | `/api/admin/dorms/{id}/reject` | JWT | Reject dorm |
| GET | `/api/admin/reviews/pending` | JWT | Queue of pending reviews |
| POST | `/api/admin/reviews/{id}/approve` | JWT | Approve review → VISIBLE |
| POST | `/api/admin/reviews/{id}/reject` | JWT | Reject review → REMOVED |

### Users — `/api/users`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users/me` | JWT | Current user profile |
| POST | `/api/users` | JWT | Create user |
| PUT | `/api/users/me` | JWT | Update current user |
| DELETE | `/api/users/me` | JWT | Delete current user |

---

## Code Conventions

### Injection
```java
// Always — no @Autowired
@RequiredArgsConstructor
public class SomeService {
    private final SomeRepository someRepository;

    // @Value fields must NOT be final
    @Value("${app.some.config}")
    private String someConfig;
}
```

### Service methods
```java
@Slf4j @RequiredArgsConstructor @Service
public class SomeService {

    @Transactional
    public SomeDto create(SomeCreateDto dto) {
        log.info("Creating something: {}", dto.name());
        // ...
        return SomeDto.fromEntity(repository.save(entity));
    }
}
```

### DTOs — Java records with factory method
```java
public record SomeDto(UUID id, String name, LocalDateTime createdAt) {
    public static SomeDto fromEntity(Some entity) {
        return new SomeDto(entity.getId(), entity.getName(), entity.getCreatedAt());
    }
}
```

### Entities
- `@GeneratedValue(strategy = GenerationType.UUID)` on `@Id UUID id`
- `@CreationTimestamp` + `@Column(updatable = false)` on `createdAt`
- `@UpdateTimestamp` on `updatedAt`
- `@Builder.Default` required on any field with a default value inside a `@Builder` class
- `@Enumerated(EnumType.STRING)` for enums; add `columnDefinition = "pg_enum_name"` for PostgreSQL custom enum types

### Email normalization
Always normalize before save or lookup: `email.toLowerCase().trim()`

### Token logging
Never log full tokens: `log.info("token: {}...", rawToken.substring(0, 8))`

---

## Database & Migrations

- Schema location: `backend/api/src/main/resources/db/migration/`
- Add new migrations as `V{N}__{snake_description}.sql` — N must be strictly increasing
- Never edit existing migration files — always add a new one
- Flyway runs automatically on app startup via `FlywayConfig.java` (explicit bean — Spring Boot 4 does not auto-configure it)
- `spring.jpa.hibernate.ddl-auto=none` — Hibernate never touches the schema

### Current migrations
| File | Purpose |
|------|---------|
| `V1__init_schema.sql` | Full schema: all tables, FKs, indexes, triggers, aggregate functions |
| `V2__search_indexes.sql` | `pg_trgm` extension + GIN indexes on `schools.name` and `dorms.name` |

---

## Security Boundaries

### Hard rules
- Never store raw magic-link tokens — SHA-256 hash only, stored in `login_tokens.token_hash`
- Token consumption must be atomic: single `UPDATE ... SET used=true WHERE ... AND used=false` — never SELECT then UPDATE
- Google OAuth users must never receive `isVerifiedStudent = true`
- JWT secret must come from `application.properties` — never hardcoded
- File uploads: validate with Apache Tika on the raw bytes, never trust `MultipartFile.getContentType()`
- `storage_key` for photos is a server-generated UUID — never use user input as a file path

### Auth-protected by default
`anyRequest().authenticated()` covers all routes not explicitly permitted. Currently permitted without JWT:
- `POST /api/auth/magic-link`
- `GET /api/auth/verify`
- `POST /api/dorms/*/reviews`
- `POST /api/dorms/*/photos`
- `GET /api/dorms/*/photos`
- `GET /api/photos/**`

### Human approval required before changing
- `SecurityConfig.java` (permit rules, session policy)
- `AuthService.java` (token generation, verified-student logic)
- Any Flyway migration that drops columns or tables
- Any change to JWT signing key configuration

---

## Known Pitfalls

**Spring Boot 4 does not auto-configure Flyway** from bare `flyway-core` on the classpath. A manual `FlywayConfig.java` bean calls `flyway.migrate()` explicitly. Do not remove it.

**`@Builder.Default` is required** for any field with a default value inside a Lombok `@Builder` class (e.g., `private EntityStatus status = EntityStatus.PENDING`). Without it, the default is silently ignored.

**`@Value` fields must not be `final`**. `@RequiredArgsConstructor` generates a constructor for all uninitialized `final` fields. If `@Value` field is also `final`, Spring cannot inject into it. Keep `@Value` fields non-final.

**PostgreSQL custom enum columns** may need `columnDefinition` on `@Column` to avoid type-casting issues with Hibernate 6+. Example: `@Column(columnDefinition = "mod_action_enum")`. This is already applied to `ModerationLog` and `Photo` entities.

**`ObjectMapper` bean must live in `JacksonConfig`**, not in `SecurityConfig`. Placing it in `SecurityConfig` creates a circular dependency because `SecurityConfig` depends on `OAuth2AuthenticationSuccessHandler` which depends on `ObjectMapper`.

**`spring.docker.compose.enabled=false`** is set in `application.properties`. Spring Boot will NOT start Docker Compose automatically. Run `docker compose up -d` manually for Mailpit.

**The `reviews` table has a pre-existing column name mismatch**: the `overall` Java field maps to `overall` via the naming strategy, but the DB column is `overall_rating`. Similarly `location` / `locationRating`, `bathroom` / `bathroomRating`. Do not change the entity without a migration.

**`SpringPhysicalNamingStrategy`** automatically converts camelCase field names to snake_case column names (`avgOverall` → `avg_overall`). Do not add `@Column(name=...)` unless the DB column name differs from this convention.

**Native queries return `List<Entity>`** and map by column name using the naming strategy — no extra configuration needed as long as all columns are present in the `SELECT`.

---

## Good Examples To Copy

- `service/SchoolService.java` — clean service: `@Slf4j`, `@Transactional` on writes, `EntityNotFoundException`, `fromEntity()` mapping
- `service/AuthService.java` — atomic token consumption via `@Modifying` native UPDATE, SHA-256 hashing, verified-student logic
- `service/PhotoStorageService.java` — `@Value` non-final fields, Tika + Thumbnailator pipeline, path traversal guard in `resolve()`
- `domain/dto/DormRankingDto.java` — composite DTO assembled from multiple entities via `fromAggregate()` factory
- `repository/LoginTokenRepository.java` — `@Modifying @Query` native UPDATE for atomic operation
- `config/FlywayConfig.java` — explicit Flyway bean (workaround for Spring Boot 4 auto-config gap)

## Patterns To Avoid

- Do not inject `ObjectMapper` as a bean inside `SecurityConfig` — use `JacksonConfig`.
- Do not use `@Autowired` field injection anywhere.
- Do not call `findById` then UPDATE separately for token consumption — use the atomic native UPDATE pattern.
- Do not use `file.getContentType()` for upload validation — use Tika on the raw bytes.

---

## When The Agent Must Stop And Ask

- The change touches `SecurityConfig`, `AuthService`, `JwtService`, or any token/password handling.
- A Flyway migration would drop a column, rename a column, or alter an existing enum type.
- A new external service or infrastructure dependency needs to be introduced.
- The task requires production credentials or environment-specific secrets.
- Existing behavior for `isVerifiedStudent` logic, token expiry, or JWT claims needs to change.
- Tests fail for reasons unrelated to the current task.
