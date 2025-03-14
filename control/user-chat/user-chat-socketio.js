const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "*",
  },
});

// 监听客户端连接事件
const allUsers = [];
const socketHash = {};
io.on("connection", (socket) => {
  console.log("新客户端建立连接");
  socket.on("user-newUserJoin", (msg) => {
    const { name, account, custom = {} } = msg;
    // 可能因为渲染导致有重复的新用户消息发送，所以这里检测一下
    if (allUsers.findIndex((u) => u.account === account) !== -1) return;
    const userInformationForAntherUSers = {
      name,
      account,
      custom,
      id: socket.id,
    };
    socketHash[socket.id] = socket;
    allUsers.push(userInformationForAntherUSers);
    io.emit("server-broadcast-userslist ", allUsers);
  });
  socket.on("user-broadcast-message", (msg) => {
    const { account, name, message } = msg;
    console.log("输出广播信息", msg);
    io.emit("server-broadcast-message", {
      senderId: socket.id,
      account,
      name,
      message,
    });
  });
  // 文件处理后面写
  socket.on("user-broadcast-file", (msg) => {
    io.emit("server-broadcast-file", msg);
  });
  // 1 v 1
  socket.on("user-toSelectUser-message", (msg) => {
    const { senderId, receiverId, message } = msg;
    const sendSocket = socketHash[receiverId];
    sendSocket.emit("server-toSelectUser-message", {
      senderId,
      receiverId,
      message,
    });
    socket.emit("server-toSelectUser-message", {
      senderId,
      receiverId,
      message,
    });
  });
  // 文件处理后面写
  socket.on("user-toSelectUser-file", (msg) => {
    io.emit("server-toSelectUser-file", msg);
  });

  // 监听客户端断开连接事件
  socket.on("disconnect", () => {
    const index = allUsers.findIndex((user) => user.id === socket.id);
    allUsers.splice(index, 1);
    io.emit("server-broadcast-userslist ", allUsers);
    console.log("与客户端断开连接,用户id:", socket.id);
  });
});
module.exports = io;
