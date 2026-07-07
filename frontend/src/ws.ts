import { io } from "socket.io-client";


const URL = import.meta.env.VITE_BACKEND_PROD_URL || import.meta.env.VITE_BACKEND_LOCAL_URL || "http://localhost:5000";

export function connect() {
  const socket = io(URL, {
    transports: ["websocket"],
  });
  return socket;
}

export const socket = connect();