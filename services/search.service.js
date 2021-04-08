const db = require("../db/db");

async function search(queryString, callback) {
    try {
        const courseSearch = await db.query("SELECT code, name FROM bcms_course WHERE search_idx @@ to_tsquery($1)", [queryString + ":*"]);
        const userSearch = await db.query("SELECT username, display_name, email FROM bcms_user WHERE search_idx @@ to_tsquery($1)", [queryString + ":*"]);
        const postSearch = await db.query("SELECT title, body, posted_in FROM bcms_post WHERE search_idx @@ to_tsquery($1)", [queryString + ":*"]);

        callback(null, {
            courses: courseSearch.rows,
            users: userSearch.rows,
            posts: postSearch.rows
        });

    } catch(e) {
        callback(e, null);
    }
}

module.exports = {
    search
}