const router = require("express").Router();
const coursesController = require("../controllers/courses.controller");
const authenticateToken = require("../middlewares/authenticateToken");
const Course = require("../models/Course");

// Retrieving existing Courses
router.get("/", coursesController.getAllCourses);
router.get("/:courseId", coursesController.getCourseById)
// router.post("/:courseId", coursesController.getCourseById)
router.post("/unlock/:courseId", coursesController.unlockCourse)

module.exports = router;

/**
 * @swagger
 *  /courses:
 *   get:
 *     tags:
 *       - courses
 *     summary: Returns the full list of courses
 *     responses:
 *       "500":
 *         description: Error
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
*/

/**
 * @swagger
 *  /courses/unlock/{courseId}:
 *   post:
 *     tags:
 *       - courses
 *     summary: Unlocks a course by course code
 *
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the course
 *
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: string
 *                  description: the id of the user
 *                code:
 *                  type: string
 *                  description: the activation code of the course
 *
 *     responses:
 *       "500":
 *         description: Error
 *       "405":
 *         description: Code does not exist
 *       "403":
 *         description: Code does not exist on that course
 *       "200":
 *         description: Success
*/

/**
 * @swagger
 *  /courses/{courseId}:
 *   get:
 *     tags:
 *       - courses
 *     summary: Returns the full list of courses
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the course
 *     responses:
 *       "500":
 *         description: Error
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
*/

/**
 * @swagger
 *  components:
 *    schemas:
 *      Course:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *          name:
 *            type: string
 *          description:
 *            type: string
 *          duration:
 *            type: number
 *          chapters:
 *            type: array
 *            items:
 *              type: string
*/