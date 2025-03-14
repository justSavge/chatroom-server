require("dotenv").config();

const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const { sendAIQuestion } = require("./ai");

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
app.post("/api/ai-chat", async (req, res) => {
  const { body } = req;
  const {
    question: { message },
  } = body;
  const answer = await sendAIQuestion(message);
  res.status(200).json({
    message: answer,
  });
});
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
  // socket就是对应客户端的唯一实例
  count++;
  console.log(socket.id);
  socket.emit("postUserNameForCurrentUser", { userName, remember });
  socket.on("message", (clientData) => {
    console.log(clientData);
    // io就是广播
    io.emit("messageHuman", clientData);
  });
});
http.listen(6657, () => {
  console.log("http建立连接");
});
