CREATE EXTENSION IF NOT EXISTS "pgcrypto";


CREATE TYPE entity_status      AS ENUM ('ACTIVE', 'PENDING', 'REJECTED');
CREATE TYPE content_status     AS ENUM ('VISIBLE', 'PENDING', 'REMOVED');
CREATE TYPE author_type_enum   AS ENUM ('USER', 'GUEST');
CREATE TYPE forum_thread_type  AS ENUM ('BEST_DORMS', 'WORST_DORMS', 'GENERAL');
CREATE TYPE mod_action_enum    AS ENUM ('APPROVE', 'REJECT', 'REMOVE');
CREATE TYPE mod_entity_enum    AS ENUM ('REVIEW', 'PHOTO', 'SCHOOL', 'DORM', 'POST');
CREATE TYPE dorm_category_enum AS ENUM ('FRESHMAN', 'SOPHOMORE', 'JUNIOR', 'SENIOR');



CREATE TABLE school (
                        id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
                        name        varchar       NOT NULL,
                        slug        varchar       NOT NULL,
                        city        varchar,
                        state       varchar,
                        country     varchar       NOT NULL DEFAULT 'US',
                        status      entity_status NOT NULL DEFAULT 'PENDING',
                        removed_at  timestamp,
                        created_at  timestamp     NOT NULL DEFAULT now(),
                        updated_at  timestamp     NOT NULL DEFAULT now(),

    -- slug unique per country so "university-of-texas" can exist in US and UK
                        CONSTRAINT uq_school_slug_country UNIQUE (slug, country)
);


CREATE TABLE school_domain (
                               id         uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
                               school_id  uuid    NOT NULL,
                               domain     varchar NOT NULL
);

COMMENT ON COLUMN school_domain.domain IS 'e.g. bu.edu — used for verified student detection';


CREATE TABLE "user" (
                        id                  uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
                        email               varchar   UNIQUE NOT NULL,
                        is_verified_student boolean   NOT NULL DEFAULT false,
                        verified_school_id  uuid,
                        created_at          timestamp NOT NULL DEFAULT now()
);

COMMENT ON COLUMN "user".email IS 'Always stored lowercase — enforced by trigger';


CREATE TABLE login_token (
                             id          uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
                             user_id     uuid      NOT NULL,
                             token_hash  varchar   NOT NULL,
                             expires_at  timestamp NOT NULL,
                             used        boolean   NOT NULL DEFAULT false,
                             created_at  timestamp NOT NULL DEFAULT now(),

                             CONSTRAINT uq_login_token_hash UNIQUE (token_hash)
);

COMMENT ON TABLE  login_token IS 'Magic link tokens. Consume atomically: UPDATE ... SET used=true WHERE token_hash=? AND used=false AND expires_at > now() RETURNING *';


CREATE TABLE dorm (
                      id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
                      school_id   uuid          NOT NULL,
                      name        varchar       NOT NULL,
                      slug        varchar       NOT NULL,
                      status      entity_status NOT NULL DEFAULT 'PENDING',
                      removed_at  timestamp,
                      created_at  timestamp     NOT NULL DEFAULT now(),
                      updated_at  timestamp     NOT NULL DEFAULT now(),

                      CONSTRAINT uq_dorm_school_slug UNIQUE (school_id, slug)
);


CREATE TABLE dorm_category (
                               dorm_id   uuid               NOT NULL,
                               category  dorm_category_enum NOT NULL,
                               PRIMARY KEY (dorm_id, category)
);


-- Per-metric counters fix the NULL-skew bug in incremental averaging.
-- Each subrating tracks its own count so nulls are never included.
CREATE TABLE dorm_aggregate (
                                dorm_id               uuid      PRIMARY KEY,

    -- overall (always present — incremental)
                                avg_overall           float     NOT NULL DEFAULT 0,
                                review_count          int       NOT NULL DEFAULT 0,

    -- subratings with individual counters (full recalc on change)
                                avg_cleanliness       float,
                                cleanliness_count     int       NOT NULL DEFAULT 0,
                                avg_location          float,
                                location_count        int       NOT NULL DEFAULT 0,
                                avg_noise             float,
                                noise_count           int       NOT NULL DEFAULT 0,
                                avg_value             float,
                                value_count           int       NOT NULL DEFAULT 0,
                                avg_social            float,
                                social_count          int       NOT NULL DEFAULT 0,
                                avg_room_quality      float,
                                room_quality_count    int       NOT NULL DEFAULT 0,
                                avg_bathroom          float,
                                bathroom_count        int       NOT NULL DEFAULT 0,

                                last_updated_at       timestamp NOT NULL DEFAULT now()
);


CREATE TABLE review (
                        id                  uuid             PRIMARY KEY DEFAULT gen_random_uuid(),
                        dorm_id             uuid             NOT NULL,
                        user_id             uuid,
                        author_type         author_type_enum NOT NULL,
                        overall_rating      float            NOT NULL,
                        cleanliness         float,
                        location            float,
                        social              float,
                        room_quality        float,
                        bathroom            float,
                        noise               float,
                        value               float,
                        review_text         text             NOT NULL,
                        class_year          varchar,
                        year_lived          int,
                        is_verified_at_post boolean          NOT NULL DEFAULT false,
                        status              content_status   NOT NULL DEFAULT 'VISIBLE',
                        removed_at          timestamp,
                        created_at          timestamp        NOT NULL DEFAULT now(),
                        updated_at          timestamp        NOT NULL DEFAULT now(),

    -- rating range guards
                        CONSTRAINT chk_overall_rating  CHECK (overall_rating  BETWEEN 1 AND 5),
                        CONSTRAINT chk_cleanliness     CHECK (cleanliness     IS NULL OR cleanliness     BETWEEN 1 AND 5),
                        CONSTRAINT chk_location        CHECK (location        IS NULL OR location        BETWEEN 1 AND 5),
                        CONSTRAINT chk_social          CHECK (social          IS NULL OR social          BETWEEN 1 AND 5),
                        CONSTRAINT chk_room_quality    CHECK (room_quality    IS NULL OR room_quality    BETWEEN 1 AND 5),
                        CONSTRAINT chk_bathroom        CHECK (bathroom        IS NULL OR bathroom        BETWEEN 1 AND 5),
                        CONSTRAINT chk_noise           CHECK (noise           IS NULL OR noise           BETWEEN 1 AND 5),
                        CONSTRAINT chk_value           CHECK (value           IS NULL OR value           BETWEEN 1 AND 5),

    -- minimum meaningful review length
                        CONSTRAINT chk_review_text_length CHECK (length(review_text) >= 20)
);

COMMENT ON COLUMN review.user_id    IS 'NULL = guest submission';
COMMENT ON COLUMN review.removed_at IS 'Populated when status flips to REMOVED — enables audit/restore';


CREATE TABLE photo (
                       id          uuid             PRIMARY KEY DEFAULT gen_random_uuid(),
                       dorm_id     uuid             NOT NULL,
                       user_id     uuid,
                       author_type author_type_enum NOT NULL,
                       storage_key varchar,
                       url         varchar,
                       thumb_url   varchar,
                       width       int,
                       height      int,
                       caption     varchar,
                       status      content_status   NOT NULL DEFAULT 'PENDING',
                       removed_at  timestamp,
                       created_at  timestamp        NOT NULL DEFAULT now(),
                       updated_at  timestamp        NOT NULL DEFAULT now(),

    -- at least one of storage_key or url must exist
                       CONSTRAINT chk_photo_has_location CHECK (storage_key IS NOT NULL OR url IS NOT NULL)
);

COMMENT ON COLUMN photo.user_id IS 'NULL = guest submission';


CREATE TABLE dorm_question (
                               id            uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
                               dorm_id       uuid           NOT NULL,
                               question_text text           NOT NULL,
                               status        content_status NOT NULL DEFAULT 'VISIBLE',
                               removed_at    timestamp,
                               created_at    timestamp      NOT NULL DEFAULT now(),

                               CONSTRAINT chk_question_length CHECK (length(question_text) >= 10)
);


CREATE TABLE dorm_answer (
                             id          uuid             PRIMARY KEY DEFAULT gen_random_uuid(),
                             question_id uuid             NOT NULL,
                             user_id     uuid,
                             author_type author_type_enum NOT NULL,
                             answer_text text             NOT NULL,
                             status      content_status   NOT NULL DEFAULT 'VISIBLE',
                             removed_at  timestamp,
                             created_at  timestamp        NOT NULL DEFAULT now(),

                             CONSTRAINT chk_answer_length CHECK (length(answer_text) >= 5)
);

COMMENT ON COLUMN dorm_answer.user_id IS 'NULL = guest submission';


CREATE TABLE forum_thread (
                              id         uuid              PRIMARY KEY DEFAULT gen_random_uuid(),
                              school_id  uuid              NOT NULL,
                              title      varchar           NOT NULL,
                              type       forum_thread_type,
                              status     content_status    NOT NULL DEFAULT 'VISIBLE',
                              removed_at timestamp,
                              created_at timestamp         NOT NULL DEFAULT now()
);


CREATE TABLE forum_post (
                            id          uuid             PRIMARY KEY DEFAULT gen_random_uuid(),
                            thread_id   uuid             NOT NULL,
                            user_id     uuid,
                            author_type author_type_enum NOT NULL,
                            post_text   text             NOT NULL,
                            status      content_status   NOT NULL DEFAULT 'VISIBLE',
                            removed_at  timestamp,
                            created_at  timestamp        NOT NULL DEFAULT now(),
                            updated_at  timestamp        NOT NULL DEFAULT now(),

                            CONSTRAINT chk_post_length CHECK (length(post_text) >= 5)
);

COMMENT ON COLUMN forum_post.user_id IS 'NULL = guest submission';


CREATE TABLE moderation_log (
                                id           uuid            PRIMARY KEY DEFAULT gen_random_uuid(),
                                entity_type  mod_entity_enum NOT NULL,
                                entity_id    uuid            NOT NULL,
                                action       mod_action_enum NOT NULL,
                                moderator_id uuid,
                                reason       varchar,
                                created_at   timestamp       NOT NULL DEFAULT now()
);


ALTER TABLE school_domain  ADD CONSTRAINT fk_school_domain_school    FOREIGN KEY (school_id)        REFERENCES school        (id) ON DELETE CASCADE;
ALTER TABLE "user"         ADD CONSTRAINT fk_user_verified_school     FOREIGN KEY (verified_school_id) REFERENCES school      (id) ON DELETE SET NULL;
ALTER TABLE login_token    ADD CONSTRAINT fk_login_token_user         FOREIGN KEY (user_id)          REFERENCES "user"        (id) ON DELETE CASCADE;
ALTER TABLE dorm           ADD CONSTRAINT fk_dorm_school              FOREIGN KEY (school_id)        REFERENCES school        (id) ON DELETE CASCADE;
ALTER TABLE dorm_category  ADD CONSTRAINT fk_dorm_category_dorm       FOREIGN KEY (dorm_id)          REFERENCES dorm          (id) ON DELETE CASCADE;
ALTER TABLE dorm_aggregate ADD CONSTRAINT fk_dorm_aggregate_dorm      FOREIGN KEY (dorm_id)          REFERENCES dorm          (id) ON DELETE CASCADE;
ALTER TABLE review         ADD CONSTRAINT fk_review_dorm              FOREIGN KEY (dorm_id)          REFERENCES dorm          (id) ON DELETE CASCADE;
ALTER TABLE review         ADD CONSTRAINT fk_review_user              FOREIGN KEY (user_id)          REFERENCES "user"        (id) ON DELETE SET NULL;
ALTER TABLE photo          ADD CONSTRAINT fk_photo_dorm               FOREIGN KEY (dorm_id)          REFERENCES dorm          (id) ON DELETE CASCADE;
ALTER TABLE photo          ADD CONSTRAINT fk_photo_user               FOREIGN KEY (user_id)          REFERENCES "user"        (id) ON DELETE SET NULL;
ALTER TABLE dorm_question  ADD CONSTRAINT fk_dorm_question_dorm       FOREIGN KEY (dorm_id)          REFERENCES dorm          (id) ON DELETE CASCADE;
ALTER TABLE dorm_answer    ADD CONSTRAINT fk_dorm_answer_question     FOREIGN KEY (question_id)      REFERENCES dorm_question (id) ON DELETE CASCADE;
ALTER TABLE dorm_answer    ADD CONSTRAINT fk_dorm_answer_user         FOREIGN KEY (user_id)          REFERENCES "user"        (id) ON DELETE SET NULL;
ALTER TABLE forum_thread   ADD CONSTRAINT fk_forum_thread_school      FOREIGN KEY (school_id)        REFERENCES school        (id) ON DELETE CASCADE;
ALTER TABLE forum_post     ADD CONSTRAINT fk_forum_post_thread        FOREIGN KEY (thread_id)        REFERENCES forum_thread  (id) ON DELETE CASCADE;
ALTER TABLE forum_post     ADD CONSTRAINT fk_forum_post_user          FOREIGN KEY (user_id)          REFERENCES "user"        (id) ON DELETE SET NULL;
ALTER TABLE moderation_log ADD CONSTRAINT fk_moderation_log_moderator FOREIGN KEY (moderator_id)     REFERENCES "user"        (id) ON DELETE SET NULL;


-- school
CREATE INDEX idx_school_domain_school_id ON school_domain(school_id);
CREATE INDEX idx_school_domain_domain     ON school_domain(domain);

-- user / login
CREATE INDEX idx_user_email              ON "user"(email);
CREATE INDEX idx_login_token_user_id     ON login_token(user_id);
CREATE INDEX idx_login_token_token_hash  ON login_token(token_hash);
CREATE INDEX idx_login_token_expires_at  ON login_token(expires_at);

-- dorm
CREATE INDEX idx_dorm_school_id          ON dorm(school_id);
CREATE INDEX idx_dorm_status             ON dorm(status);
CREATE INDEX idx_dorm_category_category  ON dorm_category(category);

-- dorm_aggregate — rankings page: ORDER BY avg_overall DESC WHERE review_count >= N
CREATE INDEX idx_dorm_aggregate_ranking
    ON dorm_aggregate(avg_overall DESC, review_count DESC);

-- review — partial index covers 95%+ of queries
CREATE INDEX idx_review_visible
    ON review(dorm_id, created_at DESC)
    WHERE status = 'VISIBLE';

CREATE INDEX idx_review_user_id  ON review(user_id);
CREATE INDEX idx_review_status   ON review(status);

-- anti-spam: quickly check recent submissions per user+dorm
CREATE INDEX idx_review_spam_check
    ON review(user_id, dorm_id, created_at DESC)
    WHERE user_id IS NOT NULL;

-- photo
CREATE INDEX idx_photo_visible
    ON photo(dorm_id, created_at DESC)
    WHERE status = 'VISIBLE';

CREATE INDEX idx_photo_status ON photo(status);

-- Q&A
CREATE INDEX idx_dorm_question_dorm_id   ON dorm_question(dorm_id);
CREATE INDEX idx_dorm_answer_question_id ON dorm_answer(question_id);
CREATE INDEX idx_dorm_answer_user_id     ON dorm_answer(user_id);

-- forum
CREATE INDEX idx_forum_thread_school_id  ON forum_thread(school_id);

CREATE INDEX idx_forum_post_visible
    ON forum_post(thread_id, created_at DESC)
    WHERE status = 'VISIBLE';

CREATE INDEX idx_forum_post_user_id ON forum_post(user_id);

-- moderation
CREATE INDEX idx_moderation_log_entity     ON moderation_log(entity_type, entity_id);
CREATE INDEX idx_moderation_log_moderator  ON moderation_log(moderator_id);
CREATE INDEX idx_moderation_log_created_at ON moderation_log(created_at DESC);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_school_updated_at     BEFORE UPDATE ON school     FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_dorm_updated_at       BEFORE UPDATE ON dorm       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_review_updated_at     BEFORE UPDATE ON review     FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_photo_updated_at      BEFORE UPDATE ON photo      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_forum_post_updated_at BEFORE UPDATE ON forum_post FOR EACH ROW EXECUTE FUNCTION set_updated_at();


CREATE OR REPLACE FUNCTION set_removed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'REMOVED' AND OLD.status <> 'REMOVED' THEN
    NEW.removed_at = now();
END IF;
  -- Clear removed_at if restored
  IF NEW.status <> 'REMOVED' AND OLD.status = 'REMOVED' THEN
    NEW.removed_at = NULL;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_review_removed_at      BEFORE UPDATE ON review       FOR EACH ROW EXECUTE FUNCTION set_removed_at();
CREATE TRIGGER trg_photo_removed_at       BEFORE UPDATE ON photo        FOR EACH ROW EXECUTE FUNCTION set_removed_at();
CREATE TRIGGER trg_dorm_question_removed  BEFORE UPDATE ON dorm_question FOR EACH ROW EXECUTE FUNCTION set_removed_at();
CREATE TRIGGER trg_dorm_answer_removed    BEFORE UPDATE ON dorm_answer   FOR EACH ROW EXECUTE FUNCTION set_removed_at();
CREATE TRIGGER trg_forum_post_removed     BEFORE UPDATE ON forum_post    FOR EACH ROW EXECUTE FUNCTION set_removed_at();
CREATE TRIGGER trg_forum_thread_removed   BEFORE UPDATE ON forum_thread  FOR EACH ROW EXECUTE FUNCTION set_removed_at();


CREATE OR REPLACE FUNCTION normalize_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email = LOWER(TRIM(NEW.email));
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_normalize_email
    BEFORE INSERT OR UPDATE ON "user"
                         FOR EACH ROW EXECUTE FUNCTION normalize_email();


CREATE OR REPLACE FUNCTION create_dorm_aggregate()
RETURNS TRIGGER AS $$
BEGIN
INSERT INTO dorm_aggregate (dorm_id)
VALUES (NEW.id)
    ON CONFLICT (dorm_id) DO NOTHING;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_dorm_create_aggregate
    AFTER INSERT ON dorm
    FOR EACH ROW EXECUTE FUNCTION create_dorm_aggregate();


CREATE OR REPLACE FUNCTION refresh_dorm_aggregate()
    RETURNS TRIGGER AS $$
DECLARE
    target_dorm_id uuid;
    agg dorm_aggregate%ROWTYPE;
    old_count int;
    new_count int;
BEGIN

    -- Fast path: INSERT of VISIBLE review
    IF TG_OP = 'INSERT' AND NEW.status = 'VISIBLE' THEN
        SELECT * INTO agg FROM dorm_aggregate WHERE dorm_id = NEW.dorm_id;

        old_count := COALESCE(agg.review_count, 0);
        new_count := old_count + 1;

        UPDATE dorm_aggregate SET
                                  avg_overall = ROUND(((COALESCE(agg.avg_overall, 0) * old_count + NEW.overall_rating) / new_count)::numeric, 2),
                                  review_count = new_count,

                                  avg_cleanliness = (SELECT ROUND(AVG(cleanliness)::numeric, 2) FROM review WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND cleanliness IS NOT NULL),
                                  cleanliness_count = (SELECT COUNT(*) FROM review WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND cleanliness IS NOT NULL),

                                  avg_location = (SELECT ROUND(AVG(location)::numeric, 2) FROM review WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND location IS NOT NULL),
                                  location_count = (SELECT COUNT(*) FROM review WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND location IS NOT NULL),

                                  avg_noise = (SELECT ROUND(AVG(noise)::numeric, 2) FROM review WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND noise IS NOT NULL),
                                  noise_count = (SELECT COUNT(*) FROM review WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND noise IS NOT NULL),

                                  avg_value = (SELECT ROUND(AVG(value)::numeric, 2) FROM review WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND value IS NOT NULL),
                                  value_count = (SELECT COUNT(*) FROM review WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND value IS NOT NULL),

                                  avg_social = (SELECT ROUND(AVG(social)::numeric, 2) FROM review WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND social IS NOT NULL),
                                  social_count = (SELECT COUNT(*) FROM review WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND social IS NOT NULL),

                                  avg_room_quality = (SELECT ROUND(AVG(room_quality)::numeric, 2) FROM review WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND room_quality IS NOT NULL),
                                  room_quality_count = (SELECT COUNT(*) FROM review WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND room_quality IS NOT NULL),

                                  avg_bathroom = (SELECT ROUND(AVG(bathroom)::numeric, 2) FROM review WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND bathroom IS NOT NULL),
                                  bathroom_count = (SELECT COUNT(*) FROM review WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND bathroom IS NOT NULL),

                                  last_updated_at = now()
        WHERE dorm_id = NEW.dorm_id;

        RETURN NULL;
    END IF;

    -- Slow path: UPDATE or DELETE
    target_dorm_id := COALESCE(NEW.dorm_id, OLD.dorm_id);

    UPDATE dorm_aggregate SET
                              avg_overall = (SELECT ROUND(AVG(overall_rating)::numeric, 2) FROM review WHERE dorm_id = target_dorm_id AND status = 'VISIBLE'),
                              review_count = (SELECT COUNT(*) FROM review WHERE dorm_id = target_dorm_id AND status = 'VISIBLE'),

                              avg_cleanliness = (SELECT ROUND(AVG(cleanliness)::numeric, 2) FROM review WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND cleanliness IS NOT NULL),
                              cleanliness_count = (SELECT COUNT(*) FROM review WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND cleanliness IS NOT NULL),

                              avg_location = (SELECT ROUND(AVG(location)::numeric, 2) FROM review WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND location IS NOT NULL),
                              location_count = (SELECT COUNT(*) FROM review WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND location IS NOT NULL),

                              avg_noise = (SELECT ROUND(AVG(noise)::numeric, 2) FROM review WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND noise IS NOT NULL),
                              noise_count = (SELECT COUNT(*) FROM review WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND noise IS NOT NULL),

                              avg_value = (SELECT ROUND(AVG(value)::numeric, 2) FROM review WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND value IS NOT NULL),
                              value_count = (SELECT COUNT(*) FROM review WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND value IS NOT NULL),

                              avg_social = (SELECT ROUND(AVG(social)::numeric, 2) FROM review WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND social IS NOT NULL),
                              social_count = (SELECT COUNT(*) FROM review WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND social IS NOT NULL),

                              avg_room_quality = (SELECT ROUND(AVG(room_quality)::numeric, 2) FROM review WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND room_quality IS NOT NULL),
                              room_quality_count = (SELECT COUNT(*) FROM review WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND room_quality IS NOT NULL),

                              avg_bathroom = (SELECT ROUND(AVG(bathroom)::numeric, 2) FROM review WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND bathroom IS NOT NULL),
                              bathroom_count = (SELECT COUNT(*) FROM review WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND bathroom IS NOT NULL),

                              last_updated_at = now()
    WHERE dorm_id = target_dorm_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_review_aggregate
    AFTER INSERT OR UPDATE OR DELETE ON review
    FOR EACH ROW EXECUTE FUNCTION refresh_dorm_aggregate();
