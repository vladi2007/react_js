import { Server } from "socket.io";
import http from "http";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const users = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
    const { userid, name } = socket.handshake.query;
    console.log(socket.handshake.query)
  socket.on("set_username", (username) => {
    users.set(socket.id, username);
    
    io.emit("user_list", Array.from(users.values()));

    io.emit("system_message", `${username} подключился`);
  });

  // Получаем сообщение
  socket.on("chat_message", (msg) => {
    const username = users.get(socket.id) || "Аноним";

    io.emit("chat_message", {
      id: socket.id,
      username,
      text: msg,
      time: Date.now(),
    });
  });

  socket.on("disconnect", () => {
    const username = users.get(socket.id);
    users.delete(socket.id);

    io.emit("system_message", `${username ?? "Аноним"} отключился`);
    io.emit("user_list", Array.from(users.values()));
  });
});

server.listen(3001, () => {
    console.log("hello world")
});
