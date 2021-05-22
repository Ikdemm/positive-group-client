require("dotenv").config();
const User = require("../models/User");
const ActivationCode = require("../models/ActivationCode");

const repository = require("../repositories/base.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");

const catchAsync = require("../utils/catchAsync");
const Course = require("../models/Course");

module.exports = {

  updateUser: catchAsync(async (req, res) => {
    let newUser = await repository.findOneAndUpdate({ _id: req.params.userId }, req.body.payload, User);
    res.status(200).send(newUser);
  }),

  getUserByToken: catchAsync(async (req, res) => {
    let userEmail = jwtDecode(req.params.token).email;
    let user = await repository.findOne({ email: userEmail }, User);
    res.status(200).send(user);
  }),

  getInvitees: catchAsync(async (req, res) => {
    // Get user id from params
    let userId = req.params.userId;

    // Get level 1 invitees
    let user = await User.findById(userId);
    let level1Invitees = user.invitees, isUserActivated = user.isActivated;

    let response = {}

    for (let i = 1; i <= 10; i++) {
      response[`level${i}Invitees`] = []
    }

    await Promise.all(level1Invitees.map(async (invitee) => {
      let currentInvitee = await User.findById(invitee);
      if (currentInvitee != null) {
        let responseInvitee = {
          inviteeId: invitee,
          isActivated: currentInvitee.isActivated
        }
        response.level1Invitees.push(responseInvitee)
      } else {
        User.findByIdAndUpdate(invitee, { $pullAll: { invitees: [invitee] } })
      }

    }))

    for (let i = 1; i < 10; i++) {

      try {
        await Promise.all(
          response[`level${i}Invitees`].map(async (invitee) => {
            let invitedUsers = await User.findById(invitee.inviteeId).select({ "invitees": 1, "_id": 0 })
            if (invitedUsers.invitees) {
              await Promise.all(invitedUsers.invitees.map(async (inviteeId) => {
                let currentInvitee = await User.findById(inviteeId);
                if (currentInvitee != null) {
                  let responseInvitee = {
                    inviteeId: inviteeId,
                    isActivated: currentInvitee.isActivated
                  }
                  response[`level${i + 1}Invitees`].push(responseInvitee)
                } else {
                  User.findByIdAndUpdate(invitee, { $pullAll: { invitees: [inviteeId] } })
                }
              }))
            }
          })
        )
      } catch (err) {
        console.error(err)
      }
    }

    res.send(response)

  }),

  activateAccount: catchAsync(async (req, res) => {
    let userId = req.params.userId;
    let codeUsedBy = await ActivationCode.findOne({ code: req.body.code }, 'usedBy');
    if (!codeUsedBy) {
      await ActivationCode.findOneAndUpdate({ code: req.body.code }, { usedBy: userId });
    } else {
      res.status(405).send("Code is already used!")
    }
    let user = await User.findByIdAndUpdate({ _id: userId }, { isActivated: true })
    res.status(200).send(user)
  }),

  updateUser: catchAsync(async (req, res) => {
    const newUserData = req.body;
    // If the user uploaded a new image, call cloudinary API to save the new image
    newUserData.image = req.file ?
      await filesRepository.saveFileToCloudinary("category", req.file.path, req.body.name)
      // Otherwise, we keep the same old image 
      : newUserData.image;
    const updatedUser = await repository.updateOne(User, req.params.userId, newUserData)
    res.status(200).send(updatedUser)
  })

};
