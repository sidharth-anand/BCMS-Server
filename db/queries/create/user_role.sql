CREATE TABLE IF NOT EXISTS bcms_user_role(
    uid INTEGER,
    rid INTEGER,
    PRIMARY KEY(uid, rid)
);

-- Setting the foreign keys
-- uid with bcms_user table
ALTER TABLE bcms_user_role
ADD CONSTRAINT FK_user_role_user
FOREIGN KEY (uid)
REFERENCES bcms_user(uid);

-- rid with bcms_role table
ALTER TABLE bcms_user_role
ADD CONSTRAINT FK_user_role_role
FOREIGN KEY (rid)
REFERENCES bcms_role(rid);
