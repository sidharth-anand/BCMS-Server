CREATE TABLE IF NOT EXISTS bcms_post (
    pid SERIAL PRIMARY KEY,
    title VARCHAR(64) NOT NULL,
    body TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    posted_in INTEGER NOT NULL
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON bcms_post
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

ALTER TABLE bcms_post
ADD CONSTRAINT FK_post_course
FOREIGN KEY (posted_in)
REFERENCES bcms_course(cid) ON DELETE CASCADE;