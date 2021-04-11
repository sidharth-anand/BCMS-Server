const db = require("../db/db");
const appLogger = require("../logging/appLogger");

async function getNotifications(uid, callback) {
    await db.query("SELECT p.pid, p.title, p.posted_in, c.name, p.created_at, p.updated_at FROM bcms_notification n, bcms_post p, bcms_course c WHERE n.uid = $1 AND p.pid = n.pid AND p.posted_in = c.cid", [uid], callback)
    appLogger.info(`User with id: ${uid} requested for notifications`)
}

async function clearNotification(uid, pid, callback) {
    await db.query("DELETE FROM bcms_notification WHERE uid = $1 AND pid = $2", [uid, pid], callback)
    appLogger.info(`User with id: ${uid} cleared notification for post id: ${pid}`)
}

async function clearAllNotifications(uid, callback) {
    await db.query("DELETE FROM bcms_notification WHERE uid = $1", [uid], callback)
    appLogger.info(`User with id: ${uid} cleared all notifications`)
}

module.exports = {
    getNotifications,
    clearNotification,
    clearAllNotifications
}