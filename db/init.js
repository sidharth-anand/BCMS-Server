const db = require('./db');

async function init() {
    db.processFile("./db/queries/create/common.sql");

    db.processFile("./db/queries/create/user.sql");
    db.processFile("./db/queries/create/course.sql");
    db.processFile("./db/queries/create/post.sql");
    db.processFile("./db/queries/create/role.sql");
    db.processFile("./db/queries/create/tag.sql");
    db.processFile("./db/queries/create/notification.sql");

    db.processFile("./db/queries/create/registered_in.sql");
    db.processFile("./db/queries/create/post_tag.sql");
    db.processFile("./db/queries/create/user_role.sql");
}

module.exports = {
    init
}