const db = require("../db/db");
const appLogger = require("../logging/appLogger");

async function createPost(title, body, courseId, callback) {
    appLogger.info(`Inserting a post titled ${body.substring(10)} in course ${courseId}`)
    try {
        const post = await db.query("INSERT INTO bcms_post (title, body, posted_in) VALUES ($1, $2, $3) RETURNING *;", [title, body, postedIn])
        callback(null, post.rows[0])
    } catch (err) {
        callback(err, null)
    }
}

async function getAllPostsInCourse(courseId, callback) {
    appLogger.info(`Getting all posts for course with id ${courseId}`)
    try {
        const posts = await db.query("SELECT pid, title, body, created_at, updated_at FROM bcms_post WHERE posted_in = $1;", [courseId])
        callback(null, posts.rows)
    } catch (err) {
        callback(err, null)
    }
}

async function getPostById(postId, callback) {
    try {
        let res = await db.query("SELECT * FROM bcms_post WHERE pid = $1", [postId]);
        const post = res.rows[0];
    
        res = await db.query("SELECT t.tag FROM bcms_tag as t, bcms_post_tag as pt WHERE t.tid = pt.tid AND pt.pid = $1", [postId]);
        const tags = res.rows;

        callback(null, {
            ...post,
            tags
        });
    } catch(err) {
        callback(err, null);
    }
}

async function updatePost(postId, title, body, callback) {
    appLogger.info(`Updating post content of post id: ${postId}`)
    try {
        const updatedPost = await db.query("UPDATE bcms_posts SET title = $1, body = $2 WHERE posted_in = $3 RETURNING *;", [title, body, postId])
        callback(null, updatedPost.rows[0])
    } catch (err) {
        callback(err, null)
    }
}

async function deletePost(postId, callback) {
    appLogger.info(`Deleting post with post id: ${postId}`)
    try {
        await db.query("DELETE FROM bcms_posts WHERE pid = $1;", [postId], callback)
    } catch (err) {
        callback(err, null)
    }
}

// Checks whether the user is the instructor of the course by matching the instructor_id of the course and the user's uid
async function isInstructorOfCourse(userInfo, courseId) {
    const coursesUnderUid = await db.query("SELECT * FROM bcms_course WHERE instructor_id = $1 AND cid = $2;", [userInfo.uid, courseId])
    return (coursesUnderUid != null && coursesUnderUid.length > 0)
}

// Gets the courseId from the postId. Returns null if there's no match
async function getCourseId(postId) {
    const courseId = await db.query("SELECT posted_in AS course_id FROM bcms_post WHERE pid = $1;", [postId])
    if (courseId != null && courseId.length == 1) {
        return courseId[0].course_id
    } else {
        return null
    }
}

// Checks whether the user is enrolled in  the course (student), or user is instructor (profs), or user is admin
async function canViewCoursePosts(userInfo, courseId) {
    if (userInfo.role == 'admin') {
        return true
    } else if (userInfo.role == 'prof') {
        return isInstructorOfCourse(userInfo, courseId)
    } else {
        const registered = await db.query("SELECT * FROM bcms_registered_in WHERE uid = $1 AND cid = $2;", [userInfo.uid, courseId])
        return (registered != null && registered.length == 1)
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
