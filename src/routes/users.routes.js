const router = require("express").Router();
const usersController = require("../controllers/users.controller");
const requestsController = require("../controllers/requests.controller");

const upload = require("../middlewares/multer");

// router.post("/bonus/:id", usersController.generateCode)

// router.get("/bonus/:userId", usersController.getInvitees)
router.put("/activate-account/:userId", usersController.activateAccount);

router.post("/activation/:userId", requestsController.requestActivation);

router.get("/:token", usersController.getUserByToken);
router.put("/:userId", usersController.updateUser);

router.post(
  "/image/:userId",
  upload.single("image"),
  usersController.updateUserImage
);

module.exports = router;

/**
 * @swagger
 *  /users/activate-account/{userId}:
 *   put:
 *     tags:
 *       - users
 *     summary: Activates the user's account with activation code
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the user
 *     responses:
 *       "400":
 *         description: Error
 *       "200":
 *         description: Success
 */

/**
 * @swagger
 *  /users/activation/{userId}:
 *   post:
 *     tags:
 *       - users
 *     summary: Sends an account activation request to the Admin
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the user
 *     responses:
 *       "400":
 *         description: Error
 *       "200":
 *         description: Success
 */

/**
 * @swagger
 *  /users/{userId}:
 *   put:
 *     tags:
 *       - users
 *     summary: Updates the user data by id
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the user
 *     requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               user:
 *                 schema:
 *                   $ref: "#/components/schemas/User"
 *     responses:
 *       "400":
 *         description: Error
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 *  /users/{token}:
 *   get:
 *     tags:
 *       - users
 *     summary: Gets user by Token
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/User"
 *     responses:
 *       "400":
 *         description: Error
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 *  components:
 *
 *    schemas:
 *
 *      User:
 *        type: object
 *        properties:
 *          _id:
 *            description: id of the user
 *            type: string
 *          firstName:
 *            description: first name of the user
 *            type: string
 *          lastName:
 *            description: last name of the user
 *            type: string
 *          birthDate:
 *            description: birthdate of the user
 *            type: string
 *          gender:
 *            description: gender of the user
 *            type: string
 *          job:
 *            description: job of the user
 *            type: string
 *          email:
 *            description: email of the user
 *            type: string
 *          password:
 *            description: password of the user
 *            type: string
 *          invitees:
 *            description: users invited by this user (level1)
 *            type: array
 *            items:
 *              type: string
 *          inviter:
 *            description: the user who invited this user, null if none
 *            type: string
 *          bonus:
 *            description: bonus cumulated by the user
 *            type: string
 *          image:
 *            description: image of the user
 *            type: string
 *          phone:
 *            description: phone number of the user
 *            type: string
 *          accountType:
 *            description: one value of Enum (free (default), pending, premium)
 *            type: string
 *          location:
 *            description: location by governorate of the user
 *            type: string
 *          courseRequests:
 *            description: The requested courses by the user
 *            type: array
 *            items:
 *              type: string
 *              description: courseId
 *
 */
