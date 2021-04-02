const express = require("express");
const router = express.Router();
const notificationService = require("../services/admin.service");
const authService = require("../services/auth.service");

router.get('/', authService.validate(), (req, res, next) => {
    const uid = authService.getInfoFromToken(req.headers.token).uid
    notificationService.getNotifications(uid, (err, queryRes) => {
        if (!err) {
            res.send(queryRes)
        } else {
            res.status(500).send({
                name: err.name,
                message: err.message
            })
        }
    })
})

router.post('/read/:id', authService.validate(), (req, res, next) => {
    const uid = authService.getInfoFromToken(req.headers.token).uid
    const pid = req.params.id
    notificationService.clearNotification(uid, pid, (err, queryRes) => {
        if (!err) {
            res.send(queryRes)
        } else {
            res.status(500).send({
                name: err.name,
                message: err.message
            })
        }
    })
})

router.post('/read/all', authService.validate(), (req, res, next) => {
    const uid = authService.getInfoFromToken(req.headers.token).uid
    notificationService.clearAllNotifications(uid, (err, queryRes) => {
        if (!err) {
            res.send(queryRes)
        } else {
            res.status(500).send({
                name: err.name,
                message: err.message
            })
        }
    })
})

module.exports = router