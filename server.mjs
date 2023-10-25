import express from "express";
import next from "next";
import { createServer } from "http";
import { Server } from "socket.io";
import Message from "./src/app/models/Message";

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
    })

    socket.on("message", async (message) => {
      const {content, to, from} = message

      const newMessage = new Message({
        fromUserID: from,
        toUserID: to,
        content: content
      })
      try {

      await newMessage.save()
      } catch (err) {
        console.log('Could not save message to database:', err)
      }

      const recipientSocketId = userToSocketMap.get(to)
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receive_message', content)
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
