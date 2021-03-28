const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../db/db');

const appLogger = require("../logging/appLogger");

const authConfig = require("../config/config.dev.json").authConfig;

async function register(user, callback) {
    if(!user.username || !user.password || !user.email || !user.name) {
        callback('Incomplete User Details', null);
    }

    const securePassword = await bcrypt.hash(user.password, 10);

    await db.query("INSERT INTO user(username, password, email, name, phone) VALUES($1, $2, $3, $4, $5)", [user.username, securePassword, user.email, user.name, user.phone || null], callback);
    appLogger.info("Registered new user: " + user.username);
}

async function login(username, password, callback) {
    try {
        const user = await db.query("SELECT * FROM user WHERE username = $1", [username])[0];

        const role = await db.query("SELECT r.label FROM user_role AS ur, role AS r, WHERE ur.uid = $1 AND r.rid = ur.rid", [user.uid]);

        const token = jwt.sign({
            id: user.uid,
            username: user.username,
            name: user.name,
            email: user.email,
            role: role
        }, authConfig.tokenKey, {
            algorithm: authConfig.tokenAlgorithm
        });

        callback(null, token);

        appLogger.info("Logged in: " + username);
    } catch(err) {
        callback(err, null);

        appLogger.error(`Could not login user with username: ${username} and pw: ${password}`);
    }
}


function verify(roles) {
    return (req, res, next) => {
        try {
            const token = req.headers['authorization'].split(' ')[1];
        } catch(err) {
            res.status(403).send();
        }

        try{
            payload = jwt.verify(accessToken, authConfig.tokenKey);

            if(!roles || roles.includes(payload.role)) {
                next();
            } else {
                return res.status(401).send();
            }
        }
        catch(e){
            return res.status(401).send();
        }

    }    
}