CREATE OR REPLACE FUNCTION update_search_idx_post()
RETURNS TRIGGER AS $$
BEGIN
    new.search_idx := setweight(to_tsvector('english'), coalesce(new.title, ''), 'A');
    return new;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE bcms_post
    ADD COLUMN search_idx tsvector;

UPDATE bcms_post
    SET search_idx = setweight(to_tsvector(title), 'A');

CREATE INDEX bcms_post_doc_idx
    ON bcms_post
    USING GIN (search_idx);

DROP TRIGGER IF EXISTS search_idx_update ON bcms_post;

CREATE TRIGGER search_idx_update
BEFORE INSERT OR UPDATE ON bcms_post
FOR EACH ROW
EXECUTE PROCEDURE update_search_idx_post();