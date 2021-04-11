const { builtinModules } = require("module");
const db = require("../db/db");

const appLogger = require("../logging/appLogger");

async function studentsPerDay(callback) {
    await db.query(`SELECT date_trunc('day', created_at) "date", count(*) "count" FROM bcms_user GROUP BY 1 ORDER BY 1 `, [], callback);

    appLogger.info("Students by date");
}

async function postsPerDay(callback) {
    await db.query(`SELECT date_trunc('day', created_at) "date", count(*) "count" FROM bcms_post GROUP BY 1 ORDER BY 1 `, [], callback);

    appLogger.info("Posts by date");
}

async function postsPerDayInCourse(cid, callback) {
    await db.query(`SELECT date_trunc('day', created_at) "date", count(*) "count" FROM bcms_post WHERE posted_in = $1 GROUP BY 1 ORDER BY 1 `, [cid], callback);

    appLogger.info("Posts by date in course" + cid);
}

module.exports = {
    studentsPerDay,
    postsPerDay,
    postsPerDayInCourse
};