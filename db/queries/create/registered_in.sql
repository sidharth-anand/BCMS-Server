CREATE TABLE IF NOT EXISTS bcms_registered_in(
    uid INTEGER,
    cid INTEGER,
    PRIMARY KEY(uid, cid)
);

-- Setting the foreign keys

-- uid with bcms_user table
DO $$
BEGIN
    BEGIN
        ALTER TABLE bcms_registered_in
        ADD CONSTRAINT FK_registered_in_user
        FOREIGN KEY (uid)
        REFERENCES bcms_user(uid);
    EXCEPTION
        WHEN duplicate_object THEN RAISE NOTICE 'Foreign Key FK_registered_in_user already exists';
    END;
END $$;

-- cid with bcms_course table
DO $$
BEGIN
    BEGIN
        ALTER TABLE bcms_registered_in
        ADD CONSTRAINT FK_registered_in_course
        FOREIGN KEY (cid)
        REFERENCES bcms_post(pid);
    EXCEPTION
        WHEN duplicate_object THEN RAISE NOTICE 'Foreign Key FK_registered_in_course already exists';
    END;
END $$;