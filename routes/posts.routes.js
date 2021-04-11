const express = require("express")
const router = express.Router()

const postsService = require('../services/posts.service')
const authService = require('../services/auth.service')

const appLogger = require("../logging/appLogger");

router.post("/:courseId", authService.validate(), async (req, res) => {
    const userInfo = authService.getInfoFromToken(authService.extractToken(req));

    const courseId = req.params.courseId

    const title = req.body.title
    const body = req.body.body

    if (userInfo != null && title != null && body != null) {
        if (postsService.isInstructorOfCourse(userInfo, courseId)) {
            postsService.createPost(title, body, courseId, (err, queryResult) => {
                if (!err) {
                    res.send(queryResult)
                } else {
                    res.status(500).send({
                        name: err.name,
                        message: err.message
                    })
                }
            })
        } else {
            res.status(403).send({
                name: "User not instructor of course",
                message: "You must be the instructor of this course to create a post"
            })
        }
    } else {
        res.status(400).send({
            name: 'Invalid parameters',
            message: 'The parameters sent are invalid'
        })
    }
})


router.get("/:postId", authService.validate(), (req, res, next) => {
    const postID = req.params.postId;
    postsService.getPostById(postID, (err, queryRes) => {
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

router.put("/:postId", authService.validate(), (req, res) => {
    const userInfo = authService.getInfoFromToken(authService.extractToken(req));
    const postId = req.params.postId

    const updatedTitle = req.body.updated_title
    const updatedBody = req.body.updated_body

    if (updatedTitle != null && updatedBody != null) {
        const courseId = postsService.getCourseId(postId)
        if (courseId != null) {
            if (postsService.isInstructorOfCourse(userInfo, courseId)) {
                postsService.updatePost(postId, updatedTitle, updatedBody, (err, queryResult) => {
                    if (!err) {
                        res.send(queryResult)
                    } else {
                        res.status(500).send({
                            name: err.name,
                            message: err.message
                        })
                    }
                })
            } else {
                res.status(403).send({
                    name: "User not instructor of course",
                    message: "You must be the instructor of this course to update this post"
                })
            }
        } else {
            res.status(404).send({
                name: "Invalid post",
                message: "The post doesn't correspond to any available course"
            })
        }
    } else {
        res.status(400).send({
            name: 'Invalid parameters',
            message: 'The parameters sent are invalid'
        })
    }
})

router.delete("/:postId", authService.validate(), (req, res) => {
    const userInfo = authService.getInfoFromToken(authService.extractToken(req));
    const postId = req.params.postId

    const courseId = postsService.getCourseId(postId)
    if (courseId != null) {
        if (postsService.isInstructorOfCourse(userInfo, courseId)) {
            postsService.deletePost(postId, (err, queryResult) => {
                if (!err) {
                    res.status(205)
                } else {
                    res.status(500).send({
                        name: err.name,
                        message: err.message
                    })
                }
            })
        } else {
            res.status(403).send({
                name: "User not instructor of course",
                message: "You must be the instructor of this course to delete this post"
            })
        }
    } else {
        res.status(404).send({
            name: "Invalid post",
            message: "The post doesn't correspond to any available course"
        })
    }
})

module.exports = router