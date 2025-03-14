const UserModel = require("../../model/mongoDB-model");
const handle200 = require("./handle200");
const handle409 = require("./handle409");

const register = async (req, res) => {
  const { name, account, password, custom = {} } = req.body;
  console.log("接收登录参数" + req.body);
  console.log("解析", name, account, password);
  const isNameExist = !!(await UserModel.findOne({ name }));
  const isAccountExist = !!(await UserModel.findOne({ account }));
  if (isNameExist || isAccountExist) {
    const errorMessage = isNameExist
      ? "名字已存在"
      : "" + isAccountExist
      ? "账号已存在"
      : "" + ",请尝试其他id";
    return handle409(res, errorMessage);
  }
  const standardData = { name, account, password, custom };
  const standardSendData = { name, account, custom };
  UserModel.create(standardData);
  return handle200(res, standardSendData);
};
module.exports = register;
