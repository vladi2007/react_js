import { useEffect, useState } from "react";
import { createSocket } from "../api/socket.ts";

export default function Chat() {
    const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
    let socket:any=null
   const handleLogin = () => {
    if (!username || !userId) return;

     socket = createSocket(userId, username);

    socket.on("chat_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("system_message", (msg) => {
      setMessages((prev) => [...prev, { system: true, text: msg }]);
    });

    socket.on("user_list", (list) => setUsers(list));

    setIsLogged(true);
  };

  
  

  const sendMessage = () => {
    if (!message) return;
    
    socket.emit("chat_message", message);
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
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value, soc)}
              />
              <button onClick={sendMessage}>Отправить</button>
            </div>
          </>
        )}
      </div>

      <div style={{ width: 200 }}>
        <h3>Онлайн:</h3>
        {users.map((u, i) => (
          <div key={i}>• {u}</div>
        ))}
      </div>
    </div>
  );
}
