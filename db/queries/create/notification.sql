CREATE TABLE IF NOT EXISTS bcms_notification(
    uid INTEGER,
    pid INTEGER,
    PRIMARY KEY (uid, pid)
);

-- Setting the foreign keys

-- uid with the bcms_user table
DO $$
BEGIN
    BEGIN
        ALTER TABLE bcms_notification
        ADD CONSTRAINT FK_notification_user
        FOREIGN KEY (uid)
        REFERENCES bcms_user(uid);
    EXCEPTION
        WHEN duplicate_object THEN RAISE NOTICE 'Foreign Key FK_notification_user already exists';
    END;
END $$;

-- pid with the bcms_post table
DO $$
BEGIN
    BEGIN
        ALTER TABLE bcms_notification
        ADD CONSTRAINT FK_notification_post
        FOREIGN KEY (pid)
        REFERENCES bcms_post(pid);
    EXCEPTION
        WHEN duplicate_object THEN RAISE NOTICE 'Foreign Key FK_notification_post already exists';
    END;
END $$;
