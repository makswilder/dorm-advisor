-- Fix: when the last visible review is removed, AVG() returns NULL which violates
-- the NOT NULL constraint on avg_overall. Wrap with COALESCE so it falls back to 0.

CREATE OR REPLACE FUNCTION refresh_dorm_aggregate()
    RETURNS TRIGGER AS $$
DECLARE
    target_dorm_id uuid;
    agg dorm_aggregates%ROWTYPE;
    old_count int;
    new_count int;
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'VISIBLE' THEN
        SELECT * INTO agg FROM dorm_aggregates WHERE dorm_id = NEW.dorm_id;

        old_count := COALESCE(agg.review_count, 0);
        new_count := old_count + 1;

        UPDATE dorm_aggregates SET
            avg_overall        = ROUND(((COALESCE(agg.avg_overall, 0) * old_count + NEW.overall_rating) / new_count)::numeric, 2),
            review_count       = new_count,

            avg_cleanliness    = (SELECT ROUND(AVG(cleanliness)::numeric, 2)   FROM reviews WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND cleanliness  IS NOT NULL),
            cleanliness_count  = (SELECT COUNT(*)                               FROM reviews WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND cleanliness  IS NOT NULL),

            avg_location       = (SELECT ROUND(AVG(location)::numeric, 2)      FROM reviews WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND location     IS NOT NULL),
            location_count     = (SELECT COUNT(*)                               FROM reviews WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND location     IS NOT NULL),

            avg_noise          = (SELECT ROUND(AVG(noise)::numeric, 2)         FROM reviews WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND noise        IS NOT NULL),
            noise_count        = (SELECT COUNT(*)                               FROM reviews WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND noise        IS NOT NULL),

            avg_value          = (SELECT ROUND(AVG(value)::numeric, 2)         FROM reviews WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND value        IS NOT NULL),
            value_count        = (SELECT COUNT(*)                               FROM reviews WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND value        IS NOT NULL),

            avg_social         = (SELECT ROUND(AVG(social)::numeric, 2)        FROM reviews WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND social       IS NOT NULL),
            social_count       = (SELECT COUNT(*)                               FROM reviews WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND social       IS NOT NULL),

            avg_room_quality   = (SELECT ROUND(AVG(room_quality)::numeric, 2)  FROM reviews WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND room_quality IS NOT NULL),
            room_quality_count = (SELECT COUNT(*)                               FROM reviews WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND room_quality IS NOT NULL),

            avg_bathroom       = (SELECT ROUND(AVG(bathroom)::numeric, 2)      FROM reviews WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND bathroom     IS NOT NULL),
            bathroom_count     = (SELECT COUNT(*)                               FROM reviews WHERE dorm_id = NEW.dorm_id AND status = 'VISIBLE' AND bathroom     IS NOT NULL),

            last_updated_at    = now()
        WHERE dorm_id = NEW.dorm_id;

        RETURN NULL;
    END IF;

    -- slow path: UPDATE or DELETE
    target_dorm_id := COALESCE(NEW.dorm_id, OLD.dorm_id);

    UPDATE dorm_aggregates SET
        avg_overall        = COALESCE((SELECT ROUND(AVG(overall_rating)::numeric, 2) FROM reviews WHERE dorm_id = target_dorm_id AND status = 'VISIBLE'), 0),
        review_count       = (SELECT COUNT(*)                                         FROM reviews WHERE dorm_id = target_dorm_id AND status = 'VISIBLE'),

        avg_cleanliness    = (SELECT ROUND(AVG(cleanliness)::numeric, 2)       FROM reviews WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND cleanliness  IS NOT NULL),
        cleanliness_count  = (SELECT COUNT(*)                                   FROM reviews WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND cleanliness  IS NOT NULL),

        avg_location       = (SELECT ROUND(AVG(location)::numeric, 2)          FROM reviews WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND location     IS NOT NULL),
        location_count     = (SELECT COUNT(*)                                   FROM reviews WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND location     IS NOT NULL),

        avg_noise          = (SELECT ROUND(AVG(noise)::numeric, 2)             FROM reviews WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND noise        IS NOT NULL),
        noise_count        = (SELECT COUNT(*)                                   FROM reviews WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND noise        IS NOT NULL),

        avg_value          = (SELECT ROUND(AVG(value)::numeric, 2)             FROM reviews WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND value        IS NOT NULL),
        value_count        = (SELECT COUNT(*)                                   FROM reviews WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND value        IS NOT NULL),

        avg_social         = (SELECT ROUND(AVG(social)::numeric, 2)            FROM reviews WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND social       IS NOT NULL),
        social_count       = (SELECT COUNT(*)                                   FROM reviews WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND social       IS NOT NULL),

        avg_room_quality   = (SELECT ROUND(AVG(room_quality)::numeric, 2)      FROM reviews WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND room_quality IS NOT NULL),
        room_quality_count = (SELECT COUNT(*)                                   FROM reviews WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND room_quality IS NOT NULL),

        avg_bathroom       = (SELECT ROUND(AVG(bathroom)::numeric, 2)          FROM reviews WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND bathroom     IS NOT NULL),
        bathroom_count     = (SELECT COUNT(*)                                   FROM reviews WHERE dorm_id = target_dorm_id AND status = 'VISIBLE' AND bathroom     IS NOT NULL),

        last_updated_at    = now()
    WHERE dorm_id = target_dorm_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
