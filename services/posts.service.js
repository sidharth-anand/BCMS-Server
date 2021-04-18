const db = require("../db/db");
const appLogger = require("../logging/appLogger");

async function createPost(title, body, courseId, tags, callback) {
    try {
        await db.query('BEGIN')
        const post = await db.query("INSERT INTO bcms_post (title, body, posted_in) VALUES ($1, $2, $3) RETURNING *;", [title, body, courseId])

        for (let i = 0; i < tags.length; i++) {
            await db.query("INSERT INTO bcms_post_tag VALUES ($1, $2);", [post.rows[0].pid, tags[i]])
        }
        await db.query('COMMIT')

        callback(null, post)
    } catch (err) {
        await db.query('ROLLBACK')
        callback(err, null)
    }
}

async function getAllPostsInCourse(courseId, callback) {
    appLogger.info(`Getting all posts for course with id ${courseId}`)
    try {
        const posts = await db.query("SELECT p.pid, p.title, p.body, p.created_at, p.updated_at, array_agg(json_build_object('tid', t.tid, 'tag', t.tag)) FILTER ( WHERE t.tid IS NOT NULL) AS tags FROM bcms_post p LEFT OUTER JOIN bcms_post_tag pt ON p.pid = pt.pid LEFT OUTER JOIN bcms_tag t on pt.tid = t.tid WHERE posted_in = $1 GROUP BY p.pid, p.title, p.body, p.created_at, p.updated_at ORDER BY p.pid;", [courseId])
        callback(null, posts.rows)
    } catch (err) {
        callback(err, null)
    }
}

async function getPostById(postId, callback) {
    try {
        const postDetails = (await db.query("SELECT * FROM bcms_post WHERE pid = $1", [postId])).rows[0]
        const tags = (await db.query("SELECT t.tid, t.tag FROM bcms_tag t, bcms_post_tag pt WHERE t.tid = pt.tid AND pt.pid = $1;", [postId])).rows

        callback(null, {
            ...postDetails,
            tags
        })
    } catch (err) {
        callback(err, null)
    }
}

async function updatePost(postId, title, body, tags, callback) {
    appLogger.info(`Updating post content of post id: ${postId}`)
    try {
        await db.query('BEGIN')

        await db.query("UPDATE bcms_post SET title = $1, body = $2 WHERE pid = $3 RETURNING *;", [title, body, postId])
        await db.query("DELETE FROM bcms_post_tag WHERE pid = $1;", [postId])

        for (let i = 0; i < tags.length; i++) {
            await db.query("INSERT INTO bcms_post_tag VALUES ($1, $2);", [postId, tags[i]])
        }

        await db.query('COMMIT')

        callback(null, {
            updated: true
        })
    } catch (err) {
        await db.query('ROLLBACK')
        callback(err, null)
    }
}

async function deletePost(postId, callback) {
    appLogger.info(`Deleting post with post id: ${postId}`)
    try {
        await db.query('BEGIN')
        await db.query("DELETE FROM bcms_post_tag WHERE pid = $1;", [postId])
        await db.query("DELETE FROM bcms_post WHERE pid = $1;", [postId], callback)
        await db.query('COMMIT')
    } catch (err) {
        await db.query('ROLLBACK')
        callback(err, null)
    }
}

// Checks whether the user is the instructor of the course by matching the instructor_id of the course and the user's uid
async function isInstructorOfCourse(userInfo, courseId) {
    const coursesUnderUid = await db.query("SELECT * FROM bcms_course WHERE instructor_id = $1 AND cid = $2;", [userInfo.id, courseId])
    return (coursesUnderUid.rows != null && coursesUnderUid.rows.length > 0)
}

// Gets the courseId from the postId. Returns null if there's no match
async function getCourseId(postId) {
    const courseId = await db.query("SELECT posted_in AS course_id FROM bcms_post WHERE pid = $1;", [postId])
    if (courseId != null && courseId.rows.length === 1) {
        return courseId.rows[0].course_id
    } else {
        return null
    }
}

// Checks whether the user is enrolled in  the course (student), or user is instructor (profs), or user is admin
async function canViewCoursePosts(userInfo, courseId) {
    if (userInfo.roles.includes('admin')) {
        return true
    } else if (userInfo.roles.includes('prof')) {
        return isInstructorOfCourse(userInfo, courseId)
    } else {
        const registered = await db.query("SELECT * FROM bcms_registered_in WHERE uid = $1 AND cid = $2;", [userInfo.uid, courseId])
        return (registered != null && registered.length === 1)
    }
}

module.exports = {
    createPost,
    getAllPostsInCourse,
    getPostById,
    updatePost,
    deletePost,
    isInstructorOfCourse,
    getCourseId,
    canViewCoursePosts
}
