const db = require("../db/db");
const appLogger = require("../logging/appLogger");

async function getTestMessage(text, callback) {
    await db.query("SELECT $1::text as message", [text], callback);
    appLogger.info("Executed test message");
}

async function getUpperMessage(text, callback) {
    try {
        const queryRes = await db.query("SELECT $1::text as message", [text]);
        let res = queryRes.rows[0];
        res.message = res.message.toUpperCase();
        callback(null, res);

        appLogger.info("Executed test upper message");
    } catch(err) {
        callback(err, null);

        appLogger.error("Error executing test upper message", {err});
    }
}

module.exports.getTestMessage = getTestMessage;
module.exports.getUpperMessage = getUpperMessage;