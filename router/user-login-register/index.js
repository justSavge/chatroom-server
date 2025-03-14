const express = require("express");
const {
  login,
  register,
  isNameExist,
  updateUserName,
  updateUserCustom,
} = require("../../control/user-login-register");

const router = express.Router();

router.route("/login").get(login);

router.route("/register").post(register);

router.route("/isNameExist").post(isNameExist);

router.route("/updateUserName").post(updateUserName);

router.route("/updateUserCustom").post(updateUserCustom);

module.exports = router;
