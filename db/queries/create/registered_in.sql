CREATE TABLE IF NOT EXISTS bcms_registered_in(
    uid INTEGER,
    cid INTEGER,
    PRIMARY KEY(uid, cid)
);

-- Setting the foreign keys
-- uid with bcms_user table
ALTER TABLE bcms_registered_in
ADD CONSTRAINT FK_registered_in_user
FOREIGN KEY (uid)
REFERENCES bcms_user(uid)

-- cid with bcms_course table
ALTER TABLE bcms_registered_in
ADD CONSTRAINT FK_registered_in_course
FOREIGN KEY (cid)
REFERENCES bcms_post(cid)
