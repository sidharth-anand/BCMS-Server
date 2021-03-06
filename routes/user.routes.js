const express = require("express");
const router = express.Router();

const userService = require('../services/user.service');
const authService = require('../services/auth.service');

router.get("/", authService.validate(), (req, res) => {
    userService.getAllUsers((err, queryRes) => {
        if (!err) {
            res.send(queryRes.rows);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    });
});

router.get("/:id", authService.validate(), (req, res) => {
    userService.getUserInfo(req.params.id, (err, queryRes) => {
        if (!err) {
            res.send(queryRes);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    });
});

router.get("/:id/courses/student", (req, res) => {
    userService.getCoursesOfUser(req.params.id, (err, queryRes) => {
        if (!err) {
            res.send(queryRes.rows);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    });

});

router.get("/:id/courses/prof", (req, res) => {
    userService.getCourseTakenByProf(req.params.id, (err, queryRes) => {
        if (!err) {
            res.send(queryRes.rows);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    });
});

module.exports = router;