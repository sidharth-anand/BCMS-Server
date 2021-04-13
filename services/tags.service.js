const db = require("../db/db")

async function getTags(callback) {
    try {
        const tags = await db.query("SELECT * FROM bcms_tag;", [])
        callback(null, tags.rows)
    } catch (err) {
        callback(err, null)
    }
}

module.exports = {
    getTags
}