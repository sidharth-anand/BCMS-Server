CREATE TABLE IF NOT EXISTS bcms_tag(
    tid SERIAL PRIMARY KEY,
    tag TEXT UNIQUE NOT NULL
);