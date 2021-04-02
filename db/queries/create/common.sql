-- Function that gets triggered when table is updated
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_notification_func()
RETURNS TRIGGER AS $$
DECLARE
    uids INT[];
    userId INT;
BEGIN
    SELECT ARRAY(SELECT uid::INT from bcms_registered_in
    WHERE cid = NEW.posted_in) INTO uids;
    FOREACH userId in ARRAY uids LOOP
        INSERT INTO bcms_notification VALUES (userId, NEW.pid);
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;