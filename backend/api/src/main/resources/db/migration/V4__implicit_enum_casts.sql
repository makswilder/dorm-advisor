-- Hibernate 7 binds enum parameters as varchar. PostgreSQL has no implicit
-- cast from varchar to a custom enum type, so derived queries with enum
-- WHERE clauses fail. These implicit casts restore the expected behaviour
-- without requiring explicit CAST() calls in every query.

CREATE CAST (character varying AS entity_status)    WITH INOUT AS IMPLICIT;
CREATE CAST (character varying AS content_status)   WITH INOUT AS IMPLICIT;
CREATE CAST (character varying AS forum_thread_type) WITH INOUT AS IMPLICIT;
CREATE CAST (character varying AS author_type_enum) WITH INOUT AS IMPLICIT;
CREATE CAST (character varying AS mod_action_enum)  WITH INOUT AS IMPLICIT;
CREATE CAST (character varying AS mod_entity_enum)  WITH INOUT AS IMPLICIT;
