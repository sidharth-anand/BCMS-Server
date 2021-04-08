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
        
          res = await db.query("SELECT r.label FROM user_role AS ur, role AS r, WHERE ur.uid = $1 AND r.rid = ur.rid", [user.uid]);
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
    await db.query("SELECT c.cid, c.name, c.code, c.instructor FROM bcms_user as u, COURSES as c, enrolled_in as e WHERE u.uid = $1 AND e.uid = u.uid AND u.cid = c.cid", [id], callback);

    appLogger.info("Fetched courses for user with uid: " + id);
}

module.exports = {
    getAllUsers,
    getUserInfo,
    getCoursesOfUser
}