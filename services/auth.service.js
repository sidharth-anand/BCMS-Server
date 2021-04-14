const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const db = require("../db/db");

const appLogger = require("../logging/appLogger");

const authConfig = require("../config/config.dev.json").authConfig;

async function register(user, callback) {
    if (!user.username || !user.password || !user.email || !user.name) {
        callback(
            {name: "Incomplete User Details", message: "Details missing"},
            null
        );
    }

    const securePassword = await bcrypt.hash(user.password, 10);

    await db.query(
        "INSERT INTO bcms_user(username, password, email, display_name, phone_no, verified) VALUES($1, $2, $3, $4, $5, $6)",
        [
            user.username,
            securePassword,
            user.email,
            user.name,
            user.phone_no,
            false,
        ],
        callback
    );

    let res = await db.query("SELECT uid from bcms_user WHERE username = $1", [
        user.username,
    ]);
    const uid = res.rows[0].uid;

    res = await db.query("SELECT rid FROM bcms_role WHERE label = $1", [
        "student",
    ]);
    const rid = res.rows[0].rid;

    db.query("INSERT INTO bcms_user_role(uid, rid) values($1, $2);", [uid, rid]);

    appLogger.info("Registered new user: " + user.username);
}

async function login(username, password, callback) {
    try {
        const queryRes = await db.query(
            "SELECT * FROM bcms_user WHERE username = $1",
            [username]
        );
        const user = queryRes.rows[0];

        const role = await db.query(
            "SELECT r.label FROM bcms_user_role AS ur, bcms_role AS r WHERE ur.uid = $1 AND r.rid = ur.rid",
            [user.uid]
        );

        const token = jwt.sign(
            {
                id: user.uid,
                username: user.username,
                name: user.display_name,
                email: user.email,
                bio: user.bio,
                // role: role.rows[0].label,
                role: role.rows.map((value) => {
                    return value.label
                }),
            },
            authConfig.tokenKey,
            {
                algorithm: authConfig.tokenAlgorithm,
            }
        );

        console.log(token);

        callback(null, {
            accessToken: token,
            refreshToken: "fuckOffYouDontGetOne",
        });

        appLogger.info("Logged in: " + username);
    } catch (err) {
        callback(err, null);

        appLogger.error(
            `Could not login user with username: ${username} and pw: ${password}`
        );
    }
}

function validate(roles) {
    return function (req, res, next) {
        let token;
        try {
            token = req.headers["authorization"].split(" ")[1];
        } catch (err) {
            res.status(403).send();
        }

        try {
            payload = jwt.verify(token, authConfig.tokenKey);

            if (!roles || roles.includes(payload.role)) {
                next();
            } else {
                return res.status(401).send();
            }
        } catch (e) {
            return res.status(401).send();
        }
    };
}

function extractToken(req) {
    return req.headers["authorization"].split(" ")[1];
}

function getInfoFromToken(token) {
    return jwt.decode(token);
}

module.exports = {
    login,
    register,
    validate,
    extractToken,
    getInfoFromToken,
};
