// services/socket.service.js

const { Server } = require("socket.io");

let io;

const initializeSocket = async (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // for development
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });

  return io;
};



// 👉 export getter
const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

module.exports = { initializeSocket, getIO };