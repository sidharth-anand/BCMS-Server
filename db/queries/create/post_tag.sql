CREATE TABLE IF NOT EXISTS bcms_post_tag(
    pid INTEGER,
    tid INTEGER,
    PRIMARY KEY(pid, tid)
);

-- Setting the foreign keys

-- pid with the bcms_post table
DO $$
BEGIN
    BEGIN
        ALTER TABLE bcms_post_tag
        ADD CONSTRAINT FK_post_tag_post
        FOREIGN KEY (pid)
        REFERENCES bcms_post(pid);
    EXCEPTION
        WHEN duplicate_object THEN RAISE NOTICE 'Foreign Key FK_post_tag_post already exists';
    END;
END $$;



-- tid with the bcms_tid table
DO $$
BEGIN
    BEGIN
        ALTER TABLE bcms_post_tag
        ADD CONSTRAINT FK_post_tag_tag
        FOREIGN KEY (tid)
        REFERENCES bcms_tag(tid);
    EXCEPTION
        WHEN duplicate_object THEN RAISE NOTICE 'Foreign Key FK_post_tag_tag already exists';
    END;
END $$;