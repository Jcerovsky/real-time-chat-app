import express from "express";
import next from "next";
import { createServer } from "http";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";
import cors from "cors";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);

  server.use(cors({ origin: "*" }));

  const limiter = rateLimit({
    windowMs: 100 * 600 * 1000,
    max: 100000,
  });

  server.use(limiter);

  const io = new Server(httpServer, {
    path: "/socket.io",
    cors: { origin: "*" },
  });

  const userToSocketMap = new Map();

  io.on("connection", (socket) => {
    socket.on("register", (userId) => {
      userToSocketMap.set(userId, socket.id);
    });

    socket.on("message", async (message) => {
      const recipientSocketId = userToSocketMap.get(message.to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receive_message", message);
      }
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(+PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
