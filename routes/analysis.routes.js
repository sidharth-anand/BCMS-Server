const express = require("express");

const router = express.Router();

const authService = require("../services/auth.service");
const analysisService = require("../services/analysis.service");

router.get("/students", authService.validate(["admin"]), (req, res, next) => {
    analysisService.studentsPerDay((err, queryRes) => {
        if(!err) {
            res.send(queryRes.rows);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    });
});

router.get("/posts", authService.validate(["admin"]), (req, res, next) => {
    analysisService.postsPerDay((err, queryRes) => {
        if(!err) {
            res.send(queryRes.rows);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    });
});

router.get("/posts/:courseId", authService.validate(["admin"]), (req, res, next) => {
    const courseId = req.params.courseId;

    analysisService.postsPerDayInCourse(courseId, (err, queryRes) => {
        if(!err) {
            res.send(queryRes.rows);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    });
});

module.exports = router;