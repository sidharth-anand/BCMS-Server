CREATE TABLE IF NOT EXISTS bcms_user(
    uid SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    bio TEXT NOT NULL DEFAULT '',
    email TEXT UNIQUE NOT NULL,
    phone_no TEXT,
    password TEXT,
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