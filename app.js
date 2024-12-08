const express = require("express");
const { Server } = require("socket.io");

const app = express();
const http = require("http").createServer(app);
const io = new Server(http, {
  cors: {
    origin: "*", // 允许所有来源
    methods: ["GET", "POST"], // 允许的请求方法
  },
});
let count = 0;
let userName = "";
app.post("/login", (req, res) => {
  // TODO:对数据库操作，验证数据
  userName = req.body.userName;
  console.log("也是有http");
});
app.post("/register", (req, res) => {
  console.log("也是有http了");
});
// 登录以后建立ws连接，可以正确得到用户名
io.on("connect", (scoket) => {
  count++;
  console.log("连上了", count);
  scoket.on("message", (message) => {
    console.log(message);
    io.emit("messageHuman", { ...message, userName });
  });
});

http.listen(6657, () => {
  console.log("http建立连接");
});
