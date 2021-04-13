const express = require("express");
const router = express.Router();
const notificationService = require("../services/notification.service");
const authService = require("../services/auth.service");

router.get('/', authService.validate(), async (req, res, next) => {
    const userInfo = authService.getInfoFromToken(authService.extractToken(req));
    console.log(userInfo);
    notificationService.getNotifications(userInfo.id, (err, queryRes) => {
        if (!err) {
            res.send(queryRes);
        } else {
            res.status(500).send({
                name: err.name,
                message: err.message
            })
        }
    })
})

router.post('/read/all', authService.validate(), async (req, res, next) => {
    const uid = authService.getInfoFromToken(authService.extractToken(req)).id;
    const pid = req.params.id;

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

router.post('/read/:id', authService.validate(), async (req, res, next) => {
    const userInfo = authService.getInfoFromToken(authService.extractToken(req));
    const pid = req.params.id
    notificationService.clearNotification(userInfo.id, pid, (err, queryRes) => {
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