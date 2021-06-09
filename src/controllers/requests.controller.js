require("dotenv").config();
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync")

module.exports = {

    requestActivation: catchAsync(async (req, res) => {
        let userId = req.params.userId;
        await User.findByIdAndUpdate(userId, { accountType: 'pending' })
        res.status(200).send('Requested')
    }),

    requestCourse: catchAsync(async (req, res) => {
        let userId = req.params.userId;
        let courseId = req.body.courseId;
        console.log(courseId)
        await User.findByIdAndUpdate(userId, { $push: { courseRequests: courseId } })
        res.status(200).send("Request Created")
    }),

    getUserCoursesRequests: catchAsync(async (req, res) => {
        let userId = req.params.userId
        let coursesRequests = await User.findById(userId, { 'courseRequests': 1, '_id': 0 })
        res.status(200).send(coursesRequests)
    })
}