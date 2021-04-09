const db = require("../db/db");

const appLogger = require("../logging/appLogger");

async function getAllUsers(callback) {
    await db.query("SELECT * FROM bcms_user", [], callback);
    appLogger.info("getting list of all users");
}

async function getUserInfo(id, callback) {
    try {
        let res = await db.query("SELECT * from bcms_user WHERE uid = $1", [id]);
        const user = res.rows[0];
        
        res = await db.query("SELECT r.label FROM bcms_user_role AS ur, bcms_role AS r WHERE ur.uid = $1 AND r.rid = ur.rid", [user.uid]);
        const roles = res.rows;
        appLogger.info("Fetched info for user: " + user.username);

        callback(null, {
            ...user,
            roles
        });
    } catch(err) {
        callback(err, null);
    }
}

async function getCoursesOfUser(id, callback) {
    await db.query("SELECT c.cid, c.name, c.code, c.sem, c.year, c.instructor_id, i.display_name as instructor_name FROM bcms_user as u, bcms_user i, bcms_course as c, bcms_registered_in as e WHERE u.uid = $1 AND e.uid = u.uid AND e.cid = c.cid AND i.uid = c.instructor_id;", [id], callback);

    appLogger.info("Fetched courses for user with uid: " + id);
}

async function getCourseTakenByProf(userId, callback) {
    await db.query("SELECT cid AS course_id, name, code, year, sem FROM bcms_course WHERE instructor_id = $1", [userId], callback)

    appLogger.info(`Fetches courses the prof with uid ${id} takes`)
}

module.exports = {
    getAllUsers,
    getUserInfo,
    getCoursesOfUser,
    getCourseTakenByProf
}