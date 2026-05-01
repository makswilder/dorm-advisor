ALTER TABLE photos ADD COLUMN review_id UUID REFERENCES reviews(id) ON DELETE SET NULL;
CREATE INDEX idx_photo_review_id ON photos(review_id);
