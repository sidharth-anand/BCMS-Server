const express = require("express")
const router = express.Router()

const postsService = require('../services/posts.service')
const authService = require('../services/auth.service')

router.post("/:courseId", authService.validate(), async (req, res) => {
    const userInfo = authService.getInfoFromToken(authService.extractToken(req));

    const courseId = req.params.courseId

    const title = req.body.title
    const body = req.body.body
    const tags = req.body.tags // array of tids

    if (userInfo != null && title != null && body != null && tags != null) {
        if (await postsService.isInstructorOfCourse(userInfo, courseId)) {
            postsService.createPost(title, body, courseId, tags,(err, queryResult) => {
                if (!err) {
                    res.status(205).send()
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
                message: "You must be the  instructor of this course to create a post"
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

router.put("/:postId", authService.validate(), async (req, res) => {
    const userInfo = authService.getInfoFromToken(authService.extractToken(req));
    const postId = req.params.postId

    const updatedTitle = req.body.updated_title
    const updatedBody = req.body.updated_body
    const updatedTags = req.body.updated_tags // array of tids

    if (updatedTitle != null && updatedBody != null && updatedTags != null) {
        const courseId = await postsService.getCourseId(postId)
        if (courseId != null) {
            if (await postsService.isInstructorOfCourse(userInfo, courseId)) {
                postsService.updatePost(postId, updatedTitle, updatedBody, updatedTags, (err, queryResult) => {
                    if (!err) {
                        res.status(205).send()
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

router.delete("/:postId", authService.validate(), async (req, res) => {
    const userInfo = authService.getInfoFromToken(authService.extractToken(req));
    const postId = req.params.postId

    const courseId = await postsService.getCourseId(postId)
    if (courseId != null) {
        if (await postsService.isInstructorOfCourse(userInfo, courseId)) {
            postsService.deletePost(postId, (err, queryResult) => {
                if (!err) {
                    res.status(205).send()
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