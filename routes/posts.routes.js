const express = require("express")
const router = express.Router()

const postsService = require('../services/posts.service')
const authService = require('../services/auth.service')

router.post("/posts/:courseId", authService.validate(), async (req, res) => {
    const userInfo = authService.getInfoFromToken(req.headers.token)

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

router.get("/posts/:courseId", authService.validate(), (req, res) => {
    const userInfo = authService.getInfoFromToken(req.headers.token)
    const courseId = req.params.courseId

    if (userInfo != null) {
        if (postsService.canViewCoursePosts(userInfo, courseId)) {
            postsService.getAllPostsInCourse(courseId, (err, queryResult) => {
                if (!err) {
                    res.send(queryResult.rows)
                } else {
                    res.status(500).send({
                        name: err.name,
                        message: err.message
                    })
                }
            })
        } else {
            res.status(403).send({
                name: "Not eligible to view this course's posts",
                message: "You must be registered in this course, be the instructor of this course, or be an admin to view this course's posts"
            })
        }
    } else {
        res.status(400).send({
            name: 'Invalid parameters',
            message: 'The parameters sent are invalid'
        })
    }
})

router.put("/posts/:postId", authService.validate(), (req, res) => {
    const userInfo = authService.getInfoFromToken(req.headers.token)
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
            res.status(400).send({
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

router.delete("/posts/:postId", authService.validate(), (req, res) => {
    const userInfo = authService.getInfoFromToken(req.headers.token)
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
        res.status(400).send({
            name: "Invalid post",
            message: "The post doesn't correspond to any available course"
        })
    }
})
