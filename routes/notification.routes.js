const express = require("express");
const router = express.Router();
const notificationService = require("../services/notification.service");
const authService = require("../services/auth.service");

router.get('/', authService.validate(), async (req, res, next) => {
    const userInfo = await authService.getInfoFromToken(req.headers.authorization.split(' ')[1])
    notificationService.getNotifications(userInfo.id, (err, queryRes) => {
        if (!err) {
            res.send(queryRes.rows)
        } else {
            res.status(500).send({
                name: err.name,
                message: err.message
            })
        }
    })
})

router.post('/read/all', authService.validate(), async (req, res, next) => {
    // const uid = authService.getInfoFromToken(req.headers.token).uid
    const userInfo = await authService.getInfoFromToken(req.headers.authorization.split(' ')[1])
    const pid = req.params.id
    notificationService.clearAllNotifications(userInfo.id, (err, queryRes) => {
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
    // const uid = authService.getInfoFromToken(req.headers.token).id
    const userInfo = await authService.getInfoFromToken(req.headers.authorization.split(' ')[1])
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