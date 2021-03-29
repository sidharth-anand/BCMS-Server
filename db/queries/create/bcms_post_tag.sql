CREATE TABLE IF NOT EXISTS bcms_post_tag(
    pid INTEGER,
    tid INTEGER,
    PRIMARY KEY(pid, tid)
);

-- Setting the foreign keys
-- pid with the bcms_post table
ALTER TABLE bcms_post_tag
ADD CONSTRAINT FK_post_tag_post
FOREIGN KEY (pid)
REFERENCES bcms_post(pid);

-- tid with the bcms_tid table
ALTER TABLE bcms_post_tag
ADD CONSTRAINT FK_post_tag_tag
FOREIGN KEY (tid)
REFERENCES bcms_tag(tid);