const router = require("express").Router();
const coursesController = require("../controllers/courses.controller");
const authenticateToken = require("../middlewares/authenticateToken");

// Retrieving existing Courses
router.get("/", coursesController.getAllCourses);
router.get("/:coursesId", coursesController.getCourseById)

module.exports = router;

/**
 * @swagger
 *  /courses:
 *   get:
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
 *  /courses/{coursesId}:
 *   get:
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