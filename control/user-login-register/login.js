const UserModel = require("../../model/mongoDB-model");
const handle200 = require("./handle200");
const handle404 = require("./handle404");
const login = async (req, res) => {
  const { account, password } = req.query;
  console.log(account, password, "接收查询数据");
  const user = await UserModel.findOne({ account });
  const isPasswordCorrect = await user.correctPassword(password, user.password);
  if (!user || !isPasswordCorrect) {
    return handle404(res);
  }

  return handle200(res, user);
};

module.exports = login;
