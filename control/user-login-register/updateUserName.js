const UserModel = require("../../model/mongoDB-model");
const handle200 = require("./handle200");
const handle404 = require("./handle404");

const updateUserName = async (req, res) => {
  const { account, name } = req.body;
  const isReqUserIsExist = Boolean(await UserModel.findOne({ account }));
  if (!isReqUserIsExist) return handle404(res);
  const isReqNameIsExist = Boolean(await UserModel.findOne({ name }));
  if (isReqNameIsExist) return handle404(res, "该用户名已存在");
  const updateUser = await UserModel.findOneAndUpdate(
    { account },
    { $set: { name } },
    { new: true }
  );
  return handle200(res, {
    custom: updateUser.custom,
    name: updateUser.name,
    account: updateUser.account,
  });
};

module.exports = updateUserName;
