CREATE TABLE IF NOT EXISTS bcms_user(
    uid SERIAL PRIMARY KEY,
    username VARCHAR(32) UNIQUE NOT NULL,
    display_name VARCHAR(64),
    email VARCHAR(64) UNIQUE NOT NULL,
    phone_no VARCHAR(15),
    password VARCHAR(64),
    verified BOOLEAN,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--Drop the trigger if created previously
DROP TRIGGER IF EXISTS set_timestamp ON bcms_user;

-- Creating the Trigger
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON bcms_user
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();