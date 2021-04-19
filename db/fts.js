const db = require('./db');

async function fts() {
    db.processFileSequence([
        './db/queries/fts/course.sql',
        './db/queries/fts/user.sql',
        './db/queries/fts/post.sql'
    ]);

};

module.exports = {
    fts
};