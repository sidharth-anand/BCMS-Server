const db = require('./db');

async function init() {
    db.processFile("./db/queries/create/common.sql");

    db.processFile("./db/queries/create/user.sql");
    db.processFile("./db/queries/create/course.sql");
    db.processFile("./db/queries/create/post.sql");
}

module.exports = {
    init
}