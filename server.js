const app = require("./app");
const io = require("./control/user-chat/user-chat-socketio");
const connectToDatabase = require("./model/connctionDB");

connectToDatabase();
app.listen(6657, () => {
  console.log("注册/登录 服务启动");
});
io.listen(6658);
