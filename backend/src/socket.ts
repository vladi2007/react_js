import { Server } from "socket.io";
import http from "http";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const socketsByUserId = new Map();
const users = new Map();

io.on("connection", (socket) => {
  const { userid, name } = socket.handshake.query;
 
  // Привязываем userId <-> socket.id
  socketsByUserId.set(userid, socket.id);
  users.set(socket.id, name);

  console.log("Connected:", userid, name);
   io.emit("user_list",  Array.from(users.values()))
  socket.on("chat_message", (msg) => {
    io.emit("chat_message", {
      id: socket.id,
      username: name,
      text: msg,
      time: Date.now(),
    });
  });

  socket.on("private_message", ({ toUserId, text }) => {
    const targetSocketId = socketsByUserId.get(toUserId);
    console.log(targetSocketId)
    if (targetSocketId) {
      io.to(targetSocketId).emit("private_message", {
       id: socket.id,
       private: true,
        username: name,
        text:text,
        time: Date.now(),
      });
    }
      socket.emit("private_message", {
       id: socket.id,
       private: true,
        username: name,
        text:text,
        time: Date.now(),
      })
  });

  socket.on("disconnect", () => {
    socketsByUserId.delete(userid);
    users.delete(socket.id);
    io.emit("system_message", `${name} отключился.`);
  });
});

server.listen(3001, () => {
    console.log("hello world")
});
