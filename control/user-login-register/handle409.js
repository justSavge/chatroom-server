module.exports = function (res, message) {
  return res.status(409).json({
    data: message,
    status: 409,
  });
};
