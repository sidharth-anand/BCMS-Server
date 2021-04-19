const db = require('./db');

async function init() {
    if(process.env.NODE_ENV === 'dev') {
        db.processFileSequence([
            "./db/queries/create/common.sql",
    
            "./db/queries/create/user.sql",
            "./db/queries/create/course.sql",
            "./db/queries/create/post.sql",
            "./db/queries/create/role.sql",
            "./db/queries/create/tag.sql",
            "./db/queries/create/notification.sql",
    
            "./db/queries/create/registered_in.sql",
            "./db/queries/create/post_tag.sql",
            "./db/queries/create/user_role.sql"
        ]);
    }
}

module.exports = {
    init
}