const express = require("express");

const router = express.Router();

const authService = require("../services/auth.service");

router.post("/register", (req, res, next) => {
    authService.register({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone_no: req.body.phone_no || null
    }, (err, queryRes) => {
        if(!err) {
            res.send(queryRes);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    });
});

router.post("/login", (req, res, next) => {
    authService.login(req.body.username, req.body.password, (err, queryRes) => {
        if(!err) {
            res.send(queryRes);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    });
});

module.exports = router;