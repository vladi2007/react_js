import { io } from "socket.io-client";


export const createSocket = (userId: string, username: string) => {
  return io(`http://localhost:3001?userid=${userId}&name=${username}`, {
    query: {
      userId,
      username,
    }
  });
};
