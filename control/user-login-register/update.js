const UserModel = require("../../model/mongoDB-model");
const handle200 = require("./handle200");
const handle404 = require("./handle404");
const update = async (req, res) => {
  const { account, name, custom } = req.body;
  const user = await UserModel.findOneAndUpdate(
    { account },
    { name, custom },
    { new: true }
  );
  if (!user) {
    return handle404(res, "更新失败没有查询到该用户");
  }

  return handle200(res, user);
};

module.exports = update;
