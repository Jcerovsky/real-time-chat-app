import express from "express";
import next from "next";
import { createServer } from "http";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);

  const io = new Server(httpServer, {
    path: "/socket.io",
    cors: { origin: "*" },
  });

  const userToSocketMap = new Map()

  io.on("connection", (socket) => {

    socket.on('register', (userId) => {
      userToSocketMap.set(userId, socket.id)
      console.log('user ID from register', userId)
    })

    socket.on("message", async (message) => {
      console.log('message,', message)
      const recipientSocketId = userToSocketMap.get(message.to)
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receive_message', message)
        console.log('emitted,', message)
        console.log('recipientSocketID', recipientSocketId)
      }
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
