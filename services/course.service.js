const db = require("../db/db");
const appLogger = require("../logging/appLogger");

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

module.exports = {
    deleteCourse,
    updateCourse,
    getAllCourses
}