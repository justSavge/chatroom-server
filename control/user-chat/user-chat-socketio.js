const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "*",
  },
});

// 监听客户端连接事件
const allUsers = [];
const socketHash = {};
const files = [];
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
    const { account, name, message, custom = {} } = msg;
    console.log("接收客户端广播信息", msg);
    console.log("我需要查看发送给客户端的数据", {
      senderId: socket.id,
      account,
      name,
      message,
      custom,
    });
    io.emit("server-broadcast-message", {
      senderId: socket.id,
      account,
      name,
      message,
      custom,
    });
  });
  // 这里发送占位符 需要客户端发送文件请求才发送文件
  socket.on("user-broadcast-file", (msg) => {
    // message就是文件
    const { account, name, message, custom = {} } = msg;
    const len = files.length;
    console.log("接收客户端广播文件", message.name);
    files.push({
      name: message.name,
      data: message.value,
      size: message.value?.length,
    });
    // 只发送名字以及存储的index
    const responseData = {
      senderId: socket.id,
      account,
      name,
      message: message.name,
      custom: { ...custom, fileIndex: len, type: "file" },
    };
    io.emit("server-broadcast-file", responseData);
  });
  socket.on("user-broadcast-file_data", (msg) => {
    const { fileIndex, name, message, custom = {} } = msg;
    const sendData = {
      fileData: files[fileIndex],
      name,
      message,
      custom,
    };
    io.emit("server-broadcast-file_data", sendData);
  });
  // -----------------------
  // |  以下都是单聊相关的   |
  // -----------------------
  socket.on("user-toSelectUser-request", (msg) => {
    // senderData 包含name,custom
    const { senderId, receiverId, senderData, receiverData } = msg;
    const sendSocket = socketHash[receiverId];
    // 给对面发送一个 好友请求
    // const toFriend = { name, custom, senderId, receiverId };
    sendSocket.emit("server-toSelectUser-request_receiver", msg);
    // 给自己发送一个 等待好友请求
    // const toMe = { name, custom, senderId, receiverId };
    socket.emit("server-toSelectUser-request_self", msg);
  });
  // 好友请求 回复 同意/拒绝
  socket.on("user-toSelectUser-answer", (msg) => {
    const { senderId, receiverId, receiverStatus } = msg;
    console.log("查看user-toSelectUser-answer字段消息", msg);
    let senderData;
    let receiverData;
    // 给自己发送
    allUsers.forEach((item) => {
      const { id } = item;
      if (id === senderId) {
        senderData = item;
      }
      if (id === receiverId) {
        receiverData = item;
      }
    });
    const msgAndSenderInformation = {
      senderId,
      receiverId,
      receiverStatus,
      senderData,
    };
    socket.emit("server-toSelectUser-answer_self", msgAndSenderInformation);
    // 给请求方发送
    const msgAndReceiverInformation = {
      senderId,
      receiverId,
      receiverStatus,
      receiverData,
    };
    const sendSocket = socketHash[senderId];
    sendSocket.emit(
      "server-toSelectUser-answer_requester",
      msgAndReceiverInformation
    );
  });
  socket.on("user-toSelectUser-message", (msg) => {
    const { senderId, receiverId, message } = msg;
    // 找到接收者
    const receiverSocket = socketHash[receiverId];
    // 为接收者，发送者都发送数据
    receiverSocket.emit("server-toSelectUser-message_receiver", msg);
    socket.emit("server-toSelectUser-message_sender", msg);
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
