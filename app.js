const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");

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
// 登录以后建立ws连接，可以正确得到用户名
io.on("connect", (socket) => {
  count++;
  console.log("连上了", count);
  console.log("post连上了", userName, remember);
  socket.emit("postUserNameForEveryone", { userName, remember });
  socket.on("message", (message) => {
    console.log(message);
    io.emit("messageHuman", { ...message, userName, remember });
  });
});

http.listen(6657, () => {
  console.log("http建立连接");
});
