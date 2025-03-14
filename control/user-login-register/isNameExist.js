const UserModel = require("../../model/mongoDB-model");
const handle200 = require("./handle200");
const handle404 = require("./handle404");

const isNameExist = async (req, res) => {
  const { account, name } = req.body;
  const isReqUserIsExist = Boolean(await UserModel.findOne({ account }));
  if (!isReqUserIsExist) return handle404(res);
  const isReqNameIsExist = Boolean(await UserModel.findOne({ name }));
  return handle200(res, { isReqNameIsExist });
};
module.exports = isNameExist;
