const express = require("express");
const router = express.Router();

const userService = require('../services/user.service');
const authService = require('../services/auth.service');

router.get("/", authService.validate(), (req, res, next) => {
    userService.getAllUsers((err, queryRes) => {
        if(!err) {
            res.send(queryRes.rows);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    });
});

router.get("/:id", authService.validate(),  (req, res, next) => {
    userService.getUserInfo(req.params.id, (err, queryRes) => {
        if(!err) {
            res.send(queryRes);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    });
});

router.get("/:id/courses", authService.validate(),  (req, res, next) => {
    userService.getCoursesOfUser(req.params.id, (err, queryRes) => {
        if(!err) {
            res.send(queryRes.rows);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    });
});

router.post("/create", authService.validate(), (async (req, res) => {
    const username = req.body.user_name
    const displayName = req.body.display_name
    const bio = req.body.bio || ""
    const email = req.body.email
    const phone = req.body.phone
    const password = req.body.password

    const validationResult = await validateUserDetails(username, displayName, bio, email, phone, password)
    if (validationResult.is_valid) {
        await authService.register({
            // todo: add user details over here
        }, (err, queryRes) => {
            if (!err) {
                res.send(queryRes.rows);
            } else {
                res.status(500).send({name: err.name, message: err.message})
            }
        })
    } else {
        res.status(400).send(validationResult.error)
    }
}))

async function validateUserDetails(username, displayName, bio, email, phone, password) {
    if (await authService.isUsernameNotUnique(username)) {
        return {
            is_valid: false,
            error: {
                name: "Username is already taken",
                message: "The username selected by you has already been taken by someone else"
            }
        }
    }

    if (displayName == null && typeof displayName === 'string') {

    }

    // todo: validate other details

    return true
}

module.exports = router;