const Course = require("../models/Course");
const User = require("../models/User");
const repository = require("../repositories/base.repository");
const CourseCode = require("../models/CourseCode");
const CreditCode = require("../models/CreditCode");
const catchAsync = require("../utils/catchAsync");

module.exports = {
  getAllCourses: catchAsync(async (req, res) => {
    const courses = await repository.findAll(Course);
    res.status(200).send(courses);
  }),

  getCourseById: catchAsync(async (req, res) => {
    const course = await repository.findOneById(req.params.courseId, Course);
    res.status(200).send(course);
  }),

  unlockCourse: catchAsync(async (req, res) => {
    let userId = req.body.userId;
    let courseId = req.params.courseId;

    let courseCode = await CourseCode.findOne({ code: req.body.code });

    if (courseCode) {
      // Checking if the code exists
      if (!courseCode) {
        res.send("Le code n'existe pas!");
      } else if (courseCode.course != courseId) {
        res.send("Le code n'est pas pour ce cours!");
      } else if (courseCode.usedBy) {
        res.send("Le code est déjà utilisé!");
      } else {
        // Adding the code to the codes list of the user
        await User.findByIdAndUpdate(userId, { $push: { courses: courseId } });
        // Marking the code as used
        await CourseCode.findOneAndUpdate(
          { code: req.body.code },
          { usedOn: Date.now(), usedBy: userId }
        );
        res.status(200).send({ message: "success" });
      }
    } else {
      const creditCode = await CreditCode.findOne({ code: req.body.code });
      const course = await Course.findById(courseId);
      if (!creditCode) {
        res.send("Le code n'existe pas!");
      } else if (creditCode.value < course.price) {
        res.send("Solde du code insuffisant!");
      } else if (creditCode.usedBy) {
        res.send("Le code est déjà utilisé!");
      } else {
        await User.findByIdAndUpdate(userId, { $push: { courses: courseId } });
        // Marking the code as used
        await CreditCode.findOneAndUpdate(
          { code: req.body.code },
          { usedOn: Date.now(), usedBy: userId }
        );
        res.status(200).send({ message: "success" });
      }
    }
  }),
};
