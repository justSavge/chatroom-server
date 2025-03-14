module.exports = function (res, errMsg = "账号或密码错误") {
  return res.status(404).json({
    data: errMsg,
    status: 404,
  });
};
