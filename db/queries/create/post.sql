CREATE TABLE IF NOT EXISTS bcms_post (
    pid SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    posted_in INTEGER NOT NULL
);

DROP TRIGGER IF EXISTS set_timestamp ON bcms_post;
DROP TRIGGER IF EXISTS add_notifications ON bcms_post;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON bcms_post
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER add_notifications
AFTER INSERT ON bcms_post
FOR EACH ROW
EXECUTE PROCEDURE create_notification_func();

DO $$
BEGIN
    BEGIN
        ALTER TABLE bcms_post
        ADD CONSTRAINT FK_post_course
        FOREIGN KEY (posted_in)
        REFERENCES bcms_course(cid) ON DELETE CASCADE;
    EXCEPTION
        WHEN duplicate_object THEN RAISE NOTICE 'Foreign Key FK_post_course already exists';
    END;
END $$;

-- Creating index on uid
CREATE INDEX IF NOT EXISTS idx_post_posted_in
ON bcms_post (posted_in);