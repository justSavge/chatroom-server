const isNameExist = require("./isNameExist");
const login = require("./login");
const register = require("./register");
const update = require("./update");
const updateUserCustom = require("./updateUserCustom");
const updateUserName = require("./updateUserName");

module.exports = {
  login,
  register,
  update,
  isNameExist,
  updateUserName,
  updateUserCustom,
};
