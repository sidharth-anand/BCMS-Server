const express = require("express");

const router = express.Router();

const courseService = require("../services/course.service");
const authService = require("../services/auth.service");
const adminService = require('../services/admin.service');

router.get('/', authService.validate(), (req, res, next) => {
    courseService.getAllCourses((err, queryRes) => {
        if(!err) {
            res.send(queryRes.rows);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    });
});

router.post('/create', authService.validate(['faculty']), (req, res, next) => {
    const courseDetails = req.body.course;
    const instructorId = authService.decode(req.headers['authorization'].split(' ')[1]).uid;
    if (courseDetails != null && instructorId != null) {
        adminService.createCourse(instructorId, courseDetails, (err, queryRes) => {
            if (!err) {
                res.send(queryRes)
            } else {
                res.status(500).send({name: err.name, message: err.message});
            }
        })
    } else {
        res.status(400).send({name: 'Invalid parameters', message: 'The parameters sent are invalid'});
    }
});

router.get("/:id", authService.validate(), (req, res, next) => {
    const cid = req.params.id;
    courseService.getCourseByID(cid, (err, queryRes) => {
        if(!err) {
            res.send(queryRes.rows[0]);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    });
});

router.delete('/:id', authService.validate(['faculty']), (req, res, next) => {
    const instructorId = authService.decode(req.headers['authorization'].split(' ')[1]).uid;
    courseService.deleteCourse(id, instructorId, (err, queryRes) => {
        if (!err) {
            res.send(queryRes)
        } else {
            res.status(500).send({name: err.name, message: err.message})
        }
    })
});

router.put('/:id', authService.validate(['faculty']), (req, res, next) => {
    const instructorId = authService.decode(req.headers['authorization'].split(' ')[1]).uid;
    const updateValues = req.body.updateValues;
    if(instructorId && updateValues) {
        courseService.updateCourse(id, instructorId, updateValues, (err, queryRes) => {
            if (!err) {
                res.send(queryRes)
            } else {
                res.status(500).send({name: err.name, message: err.message});
            }
        });
    } else {
        res.status(400).send({name: 'Invalid parameters', message: 'The parameters sent are invalid'});
    }
});

router.get("/:id/students", authService.validate(['faculty', 'admin']), (req, res, next) => {
    const cid = req.params.id;
    courseService.getStudentsInCourse(cid, (err, queryRes) => {
        if(!err) {
            res.send(queryRes.rows);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    })
});

router.post("/:id/enroll", authService.validate(), (req, res, next) => {
    const cid = req.params.id;
    const uid = req.body.id;
    courseService.enrollStudentInCourse(cid, uid, (err, queryRes) => {
        if(!err) {
            res.send({enrolled: true});
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    });
});

router.post("/:id/disenroll", authService.validate(), (req, res, next) => {
    const cid = req.params.id;
    const uid = req.body.id;
    courseService.disenrollStudentFromCourse(cid, uid, (err, queryRes) => {
        if(!err) {
            res.send({disenrolled: true});
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    });
});

module.exports = router