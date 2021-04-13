const express = require("express")
const router = express.Router()

const authService = require('../services/auth.service')
const tagsService = require('../services/tags.service')

router.get("/", authService.validate(), (req, res, next) => {
    tagsService.getTags((err, queryRes) => {
        if(!err) {
            res.send(queryRes);
        } else {
            res.status(500).send({
                name: err.name,
                message: err.message
            });
        }
    });
});

module.exports = router