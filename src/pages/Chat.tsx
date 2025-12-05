import { useEffect, useState, useRef  } from "react";
import { createSocket } from "../api/socket.ts";

export default function Chat() {
    const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [toUserId, setToUserId] =useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
    const socketRef = useRef(null);

   const handleLogin = () => {
    if (!username || !userId) return;

     socketRef.current = createSocket(userId, username);

    socketRef.current.on("chat_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socketRef.current.on("private_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socketRef.current.on("system_message", (msg) => {
      setMessages((prev) => [...prev, { system: true, text: msg }]);
    });

    socketRef.current.on("user_list", (list) => setUsers(list));

    setIsLogged(true);
  };

  
  
  const sendPrivateMessage = () => {
   if (!message) return;

  socketRef.current.emit("private_message", {
    toUserId:toUserId,
    text: message,
  });

  setMessage("");
};
  const sendMessage = () => {
    if (!message) return;
    
    socketRef.current.emit("chat_message", message);
    setMessage("");
  };

  return (
    <div style={{ display: "flex", gap: 20, padding: 20 }}>
      <div style={{ flex: 1 }}>
        {!isLogged ? (
          <div>
            <h2>Введите ваше имя</h2>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />


            <h2>Введите ваш id</h2>
            <input type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={handleLogin}>Войти</button>
          </div>
          
          
        ) : (
          <>
            <h2>Чат</h2>
            <div
              style={{
                border: "1px solid #ccc",
                padding: 10,
                height: 300,
                overflowY: "auto",
              }}
            >
              {messages.map((m, i) => (
                <div key={i} style={{ marginBottom: 5 }}>
                  {m.system ? (
                    <i style={{ color: "#999" }}>{m.text}</i>
                  ) : (
                    <div>
                      <strong>{m.username}:</strong> {m.text}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 10 }}>
              <h2>Введите сообщение</h2>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Отправить сообщение всем</button>
            </div>
              <div style={{ marginTop: 10 }}>
             <h2>Введите id кому хотите отправить приватное сообщение</h2>
            <input type="number"
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
            />
              <button onClick={sendPrivateMessage}>Отправить приватное сообщение</button>
            </div>
          </>
        )}
      </div>

      <div style={{ width: 200 }}>
        <h3>Онлайн:{users.length}</h3>
        {users.map((u, i) => (
          <div key={i}>• {u}</div>
        ))}
      </div>
    </div>
  );
}
