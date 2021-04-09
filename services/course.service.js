const db = require("../db/db");
const appLogger = require("../logging/appLogger");

async function getCourseByID(courseId, callback) {
     await db.query("SELECT c.cid, c.name, c.code, c.instructor_id, i.display_name as instructor_name FROM bcms_user as u, bcms_user i, bcms_course as c WHERE c.cid = $1 AND i.uid = c.instructor_id", [courseId], callback);
     appLogger.info("Return info for course with id: " + courseId);
}

async function deleteCourse(courseId, instructorId, callback) {
    await db.query('DELETE FROM bcms_course WHERE cid = $1 AND uid = $2', [courseId, instructorId], callback);
    appLogger.info(`Deleted course with cid: ${cid}`)
}

async function updateCourse(courseId, instructorId, updateValues, callback) {
    await db.query(`
        UPDATE bcms_course
        SET ${Object.keys(updateValues).map((d, i) => `${d} = $${i + 3}`).join(', ')}
        WHERE cid = $1 AND uid = $2
    `, 
    ([courseId, instructorId].push(Object.values(updateValues))).flat(), 
    callback);
}

async function getAllCourses(callback) {
    await db.query('SELECT * FROM bcms_course', [], callback);
    appLogger.info("Retrieved all courses");
}

async function getStudentsInCourse(courseId, callback) {
    await db.query("SELECT u.uid, u.username, u.display_name, u.email FROM bcms_user as u, bcms_course as c, bcms_registered_in as r WHERE c.cid = $1 AND r.cid = c.cid AND r.uid = u.uid", [courseId], callback);
    appLogger.info("Retrieved students for course: " + courseId);
}

async function enrollStudentInCourse(courseId, userId, callback) {
    await db.query("INSERT INTO bcms_registered_in(uid, cid) VALUES($1, $2)", [userId, courseId], callback);
    appLogger.info(`Registered ${userId} to ${courseId}`);
}

async function disenrollStudentFromCourse(courseId, userId, callback) {
    await db.query("DELETE FROM bcms_registered_in WHERE uid = $1 AND cid = $2", [userId, courseId], callback);
    appLogger.info(`Removed ${userId} from ${courseId}`);
}

module.exports = {
    getCourseByID,
    deleteCourse,
    updateCourse,
    getAllCourses,
    getStudentsInCourse,
    enrollStudentInCourse,
    disenrollStudentFromCourse
}