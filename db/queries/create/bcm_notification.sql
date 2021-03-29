CREATE TABLE IF NOT EXISTS notification(
    uid INTEGER,
    pid INTEGER,
    PRIMARY KEY (uid, pid)
);

-- Setting the foreign keys
-- uid with the bcms_user table
ALTER TABLE notification
ADD CONSTRAINT FK_notification_user
FOREIGN KEY (uid)
REFERENCES bcms_user(uid);

-- pid with the bcms_post table
ALTER TABLE notification
ADD CONSTRAINT FK_notification_post
FOREIGN KEY (pid)
REFERENCES bcms_post(pid);