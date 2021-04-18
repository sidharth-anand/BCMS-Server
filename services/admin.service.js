const db = require("../db/db");
const appLogger = require("../logging/appLogger");

async function addRole(id, rid, callback) {
    await db.query("INSERT INTO bcms_user_role (uid, rid) VALUES ($1, $2)", [id, rid], callback)
    appLogger.info(`Added role: ${rid} for user: ${id}`)
}

async function deleteRole(id, rid, callback) {
    await db.query("DELETE FROM bcms_user_role WHERE uid = $1 AND rid = $2", [id, rid], callback)
    appLogger.info(`Deleted role: ${rid} for user: ${id}`)
}

async function createCourse(instructorId, course, callback) {
    const statement = 'INSERT INTO bcms_course (name, code, year, sem, instructor_id) VALUES ($1, $2, $3, $4, $5)'
    const params = [course.name, course.code, course.year, course.sem, instructorId]
    await db.query(statement, params, callback)
    appLogger.info(`Created new course: ${course.name} with instructor id: ${instructorId}`)
}

async function deleteCourse(cid, callback, callback) {
    await db.query('DELETE FROM bcms_course WHERE cid = $1', [cid], callback)
    appLogger.info(`Deleted course with cid: ${cid}`)
}

async function getAllRoles(callback) {
    await db.query('SELECT * FROM bcms_role', [], callback);
    appLogger.info(`Requested all roles`);
}

module.exports = {
    addRole,
    deleteRole,
    getAllRoles,
    createCourse,
    deleteCourse
}