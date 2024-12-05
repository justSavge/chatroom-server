const { Server } = require("socket.io");

const io = new Server(6657, {
  cors: {
    origin: "*", // 允许所有来源
    methods: ["GET", "POST"], // 允许的请求方法
  },
});
let count = 1;
io.on("connect", (scoket) => {
  count++;
  console.log("连上了", count);
  scoket.on("message", (message) => {
    console.log(message);
    io.emit("messageHuman", message);
  });
});
