CREATE OR REPLACE FUNCTION update_search_idx_course()
RETURNS TRIGGER AS $$
BEGIN
    new.search_idx := setweight(to_tsvector('english', coalesce(new.name, '')), 'A') || setweight(to_tsvector('english', coalesce(new.name, '')), 'B');
    return new;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE bcms_course
    ADD COLUMN search_idx tsvector;

UPDATE bcms_course
    SET search_idx = setweight(to_tsvector(name), 'A') || setweight(to_tsvector(code), 'B');

CREATE INDEX bcms_course_doc_idx
    ON bcms_course
    USING GIN (search_idx);

DROP TRIGGER IF EXISTS search_idx_update ON bcms_course;

CREATE TRIGGER search_idx_update 
BEFORE INSERT OR UPDATE ON bcms_course
FOR EACH ROW
EXECUTE PROCEDURE update_search_idx_course();