CREATE OR REPLACE FUNCTION update_search_idx_user()
RETURNS TRIGGER AS $$
BEGIN   
    new.search_idx := setweight(to_tsvector('english', coalesce(new.display_name, '')), 'A') || setweight(to_tsvector('english', coalesce(new.username, '')), 'B');
    return new;
END
$$ LANGUAGE plpgsql;

ALTER TABLE bcms_user
     ADD COLUMN search_idx tsvector;
    
UPDATE bcms_user
     SET search_idx = setweight(to_tsvector(display_name), 'A') || setweight(to_tsvector(username), 'B');

CREATE INDEX bcms_user_doc_idx
    ON bcms_user
    USING GIN (search_idx);

DROP TRIGGER IF EXISTS search_idx_update on bcms_user;

CREATE TRIGGER search_idx_update
BEFORE INSERT OR UPDATE ON bcms_user
FOR EACH ROW
EXECUTE PROCEDURE update_search_idx_user();