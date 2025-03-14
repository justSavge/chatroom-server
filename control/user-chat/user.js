require("dotenv").config();

const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");

/**
 *     api:localhost:6657/
 *
 *     这个api提供两个连接方式
 *     1. websocket 连接，用于与其他用户实现聊天交互
 *     2. http 连接，用于登陆注册功能
 *
 */
const app = express();
app.use(express.json());
app.use(cors());
const http = require("http").createServer(app);
const io = new Server(http, {
  cors: {
    origin: "*", // 允许所有来源
    methods: ["GET", "POST"], // 允许的请求方法
  },
});
let count = 0;
let userName = "";
let remember;

/**
 *
 *                        http 模块
 *
 */
app.post("/login", async (req, res) => {
  // userName = req.body.userName;
  console.log("login在运行了", req.body);
  // TODO:对数据库操作，验证数据
  userName = req.body.userName;
  remember = req.body.remember;
  res.send(JSON.stringify({ isSuccess: true }));
});
app.post("/register", (req, res) => {
  console.log("也是有http了");
});

/**
 *
 *                       websocket 模块
 *
 */
// 登录以后建立ws连接，可以正确得到用户名
// io是后端唯一服务器，socket是前端实例
io.on("connect", (socket) => {
  // socket就是对应客户端的唯一实例
  count++;
  console.log(socket.id);
  socket.emit("postUserNameForCurrentUser", { userName, remember });
  socket.on("messageText", (clientData) => {
    console.log(clientData);
    // io就是广播
    io.emit("messageText", clientData);
  });
});

module.exports = http;
