const baseRepository = require("../repositories/base.repository");
const { initializeUser } = require("../helpers");
const User = require("../models/User");

module.exports = {
  createUninvitedUser: async (userData) => {
    try {
      const defaultInviter = await User.findOne(
        { isDefaultInviter: true },
        "_id"
      );
      if (defaultInviter) {
        userData = await initializeUser(userData, defaultInviter._id);
      } else {
        userData = await initializeUser(userData, "");
      }
      const newUser = await baseRepository.save(userData, User);
      if (defaultInviter)
        await User.findByIdAndUpdate(defaultInviter, {
          $push: { invitees: newUser._id },
        });
      return newUser;
    } catch (error) {
      console.error(error);
    }
  },

  createNewUserInvitedByCode: async (userData, inviterCode) => {
    try {
      // Getting the invitor via his invitation code
      const inviter = await baseRepository.findOne({ code: inviterCode }, User);
      // Storing the inviterId in the new user

      // Initializing the new user
      userData = await initializeUser(userData, inviter._id);

      // Storing the user
      return baseRepository.save(userData, User);
    } catch (error) {
      console.error(error);
    }
  },

  createNewUserInvitedByEmail: async (userData, inviterEmail) => {
    try {
      // Getting the invitor via his invitation code
      const inviter = await baseRepository.findOne(
        { email: inviterEmail },
        User
      );

      userData = await initializeUser(userData, inviter._id);

      // Storing the user
      return baseRepository.save(userData, User);
    } catch (error) {
      console.error(error);
    }
  },
};
