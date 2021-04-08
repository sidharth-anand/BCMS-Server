const db = require("./db");

(function(){
    db.processFileSequence([
        "./db/queries/insert/role.sql",
        "./db/queries/insert/user.sql",
        "./db/queries/insert/user_role.sql",
        "./db/queries/insert/course.sql"
    ])
})();