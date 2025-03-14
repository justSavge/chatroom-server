const UserModel = require("../../model/mongoDB-model");
const handle200 = require("./handle200");
const handle404 = require("./handle404");

const updateUserCustom = async (req, res) => {
  const { account, custom } = req.body;
  const isReqUserIsExist = Boolean(await UserModel.findOne({ account }));
  if (!isReqUserIsExist) return handle404(res);
  console.log("接收的custom", custom);
  const updateUser = await UserModel.findOneAndUpdate(
    { account },
    { $set: { custom } },
    { new: true }
  );
  return handle200(res, {
    custom: updateUser.custom,
    name: updateUser.name,
    account: updateUser.account,
  });
};
module.exports = updateUserCustom;
