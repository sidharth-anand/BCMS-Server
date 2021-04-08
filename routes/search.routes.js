const express = require("express");

const router = express.Router();

const authService = require("../services/auth.service");
const searchService = require("../services/search.service");

router.get("/", (req, res, next) => {
    const searchText = req.query.search;

    searchService.search(searchText, (err, queryRes) => {
        if(!err) {
            res.send(queryRes);
        } else {
            res.status(500).send({name: err.name, message: err.message});
        }
    })

});

module.exports = router;