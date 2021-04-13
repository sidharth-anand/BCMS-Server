const db = require("../db/db");
const appLogger = require("../logging/appLogger");

async function getNotifications(uid, callback) {
    try {
        const notifications = (await db.query("SELECT p.pid, p.title, p.posted_in, c.name, p.created_at, p.updated_at FROM bcms_notification n, bcms_post p, bcms_course c WHERE n.uid = $1 AND p.pid = n.pid AND p.posted_in = c.cid", [uid])).rows;

        let notifsWithTags = [];
        for (let i = 0; i < notifications.length; i++) {
            const tags = (await db.query("SELECT t.tid, t.tag FROM bcms_tag t, bcms_post_tag pt WHERE t.tid = pt.tid AND pt.pid = $1;", [notifications[i].pid])).rows;

            notifsWithTags.push({
                ...notifications[i],
                tags
            });
        }
        callback(null, notifsWithTags);
    } catch (err) {
        callback(err, null);
    }
    appLogger.info(`User with id: ${uid} requested for notifications`);
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