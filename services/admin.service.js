const db = require("../db/db");
const appLogger = require("../logging/appLogger");

async function addRole(id, rid, callback) {
    try {
        await db.query("INSERT INTO bcms_user_role (uid, rid) VALUES ($1, $2)", [id, rid], callback)
    } catch (err) {
        callback(err, null)
    }
}

async function createCourse(instructorId, course, callback) {
    try {
        const statement = 'INSERT INTO bcms_course (name, code, year, sem, instructor_id) VALUES ($1, $2, $3, $4, $5)'
        const params = [course.name, course.code, course.year, course.sem, instructorId]
        await db.query(statement, params, callback)
    } catch (err) {
        callback(err, null)
    }
}

async function deleteCourse(cid, callback) {
    try {
        await db.query('DELETE FROM bcms_course WHERE cid = $1', [cid], callback)
    } catch (err) {
        callback(err, null)
    }
}

module.exports = {
    addRole,
    createCourse,
    deleteCourse
}