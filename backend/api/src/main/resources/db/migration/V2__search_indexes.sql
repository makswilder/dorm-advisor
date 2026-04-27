CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_schools_name_trgm ON schools USING GIN (name gin_trgm_ops);
CREATE INDEX idx_dorms_name_trgm   ON dorms   USING GIN (name gin_trgm_ops);
