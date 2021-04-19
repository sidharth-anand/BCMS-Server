CREATE TABLE IF NOT EXISTS bcms_user_role(
    uid INTEGER,
    rid INTEGER,
    PRIMARY KEY(uid, rid)
);

-- Setting the foreign keys

-- uid with bcms_user table
DO $$
BEGIN
    BEGIN
        ALTER TABLE bcms_user_role
        ADD CONSTRAINT FK_user_role_user
        FOREIGN KEY (uid)
        REFERENCES bcms_user(uid);
    EXCEPTION
        WHEN duplicate_object THEN RAISE NOTICE 'Foreign Key FK_user_role_user already exists';
    END;
END $$;

-- rid with bcms_role table
DO $$
BEGIN
    BEGIN
        ALTER TABLE bcms_user_role
        ADD CONSTRAINT FK_user_role_role
        FOREIGN KEY (rid)
        REFERENCES bcms_role(rid);
    EXCEPTION
        WHEN duplicate_object THEN RAISE NOTICE 'Foreign Key FK_user_role_user already exists';
    END;
END $$;

-- Creating index on uid
CREATE INDEX IF NOT EXISTS idx_user_role_uid
ON bcms_user_role (uid);