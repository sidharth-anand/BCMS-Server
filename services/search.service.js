const db = require("../db/db");

async function search(queryString, callback) {
    try {
        const courseSearch = await db.query("SELECT bc.cid, bc.code, bc.name, bu.display_name as instructor_name  FROM bcms_course as bc, bcms_user as bu WHERE bc.search_idx @@ to_tsquery($1) AND bu.uid = bc.instructor_id", [queryString + ":*"]);
        const userSearch = await db.query("SELECT uid, username, display_name, email FROM bcms_user WHERE search_idx @@ to_tsquery($1)", [queryString + ":*"]);
        const postSearch = await db.query("SELECT bp.pid, bp.title, bp.body, bp.posted_in, bc.name as course_name FROM bcms_post as bp, bcms_course as bc WHERE bp.search_idx @@ to_tsquery($1) AND bp.posted_in = bc.cid", [queryString + ":*"]);

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