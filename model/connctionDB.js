const { default: mongoose } = require("mongoose");

require("dotenv").config();

const MONGODB_PASSWORD = decodeURIComponent(process.env.MONGODB_PASSWORD);
const MONGODB_URL = decodeURIComponent(process.env.MONGODB_URL);
const uri = MONGODB_URL.replace("<PASSWORD>", MONGODB_PASSWORD);

/**
 * 虽然是异步操作但是可以直接再外层调用，如果连接的太慢,mogoose还没有连上,对应的model会进入缓冲队列知道连上以后执行，所以可以放心的直接调用这个异步函数而不使用then/await等操作
 */
async function connectToDatabase() {
  try {
    // 设置严格查询模式
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri).catch(console.error);
    console.log("成功连接到了服务器!");
  } catch (error) {
    console.error("连接失败:", error);
  }
}
module.exports = connectToDatabase;
