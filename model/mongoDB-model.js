const mongoose = require("mongoose");
const crypto = require("crypto");
// 结构要求
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "必须有用户名"],
    unique: true,
  },
  account: {
    type: String,
    required: [true, "必须有账号名"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "必须有密码"],
  },
  custom: Object,
});
// 再密码保存前哈希加密
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hash = crypto.createHash("sha256");
  // 更新哈希内容
  hash.update(this.password);
  // 生成十六进制的哈希值
  this.password = hash.digest("hex");
  next();
});

// 在用户模式中添加密码校验方法
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  try {
    // 对输入的密码进行哈希处理
    const hash = crypto.createHash("sha256");
    hash.update(candidatePassword);
    const candidateHash = hash.digest("hex");
    // 比较哈希值
    return candidateHash === userPassword;
  } catch (error) {
    throw error;
  }
};

// 创建实例
const User = mongoose.model("User", UserSchema);

module.exports = User;
