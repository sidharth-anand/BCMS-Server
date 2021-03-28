const express = require("express");
const router = express.Router();
const testService = require("../services/test.service");
const authService = require("../services/auth.service");

const appLogger = require("../logging/appLogger");

router.get("/text", (req, res, next) => {
    const text = req.query.text;

    testService.getTestMessage(text, (err, queryRes) => {
        if(!err) {
            res.send(queryRes.rows[0]);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    })
});

router.get("/upper", (req, res, next) => {
    const text = req.query.text;

    testService.getUpperMessage(text, (err, queryRes) => {
        if(!err) {
            res.send(queryRes);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    });
});

module.exports = router;