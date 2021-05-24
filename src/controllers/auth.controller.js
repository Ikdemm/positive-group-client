const User = require("../models/User");
const repository = require("../repositories/base.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync")

const usersService = require("../services/users.service")

module.exports = {

    login: catchAsync(async (req, res) => {
        const userData = await repository.findOne({ email: req.body.email }, User);
        const user = { email: userData.email };
        if (await bcrypt.compare(req.body.password, userData.password)) {
            jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
                if (err) {
                    console.log(err);
                }
                res.status(201).send({
                    token,
                    user: userData,
                });
            });
        } else {
            res.status(405).send({
                message: "WRONG PASSWORD",
            });
        }
    }),

    signup: catchAsync(async (req, res) => {

        let inviterCode = req.body.inviterCode;
        let inviterEmail = req.body.inviterEmail;
        let isInvited = !!inviterCode || !!inviterEmail;
        let userData = req.body;

        let user = null;

        if (isInvited) {
            user = (inviterCode) ?
                await usersService.createNewUserInvitedByCode(
                    userData,
                    inviterCode
                ) :
                await usersService.createNewUserInvitedByEmail(
                    userData,
                    inviterEmail
                )
        } else {
            user = await usersService.createUninvitedUser(userData)
        }

        isInvited && await User.findByIdAndUpdate({ _id: userData.inviter }, { $push: { invitees: user._id } })

        // Sending back the response
        res.status(201).send({ user: user, message: "Created" });
    }),

    updatePassword: catchAsync(async (req, res) => {

        let payload = req.body
        let user = await repository.findOne({ email: payload.email }, User);
        if (!bcrypt.compareSync(payload.oldPassword, user.password)) {
            res.status(401).send({ message: "Wrong old password!" });
        } else if (payload.newPassword == payload.oldPassword) {
            res.status(405).send({ message: "Same old and new password!" });
        } else {
            payload.newPassword = bcrypt.hashSync(payload.newPassword, 10);
            let updatedUser = await repository.findOneAndUpdate(
                { email: payload.email },
                { password: payload.newPassword },
                User
            );
            res.status(200).send({ message: "Success" });
        }
    }),

}