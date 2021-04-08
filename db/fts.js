const db = require('./db');

(async function init() {
    db.processFileSequence([
        './db/queries/fts/course.sql',
        './db/queries/fts/user.sql',
        './db/queries/fts/post.sql'
    ]);

})();