const db = require('./db');

async function init() {
    db.processFile("./db/queries/create/common.sql");

    db.processFile("./db/queries/create/user.sql");
}

module.exports = {
    init
}