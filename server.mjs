import express from "express";
import next from "next";
import { Server } from "socket.io";


const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});


const io = new Server({
  noServer: true,
  path: "/socket.io",
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("client connected");

  socket.on("message", (message) => {
    console.log(`Received message: ${message}`);
    socket.send("Hello! You sent:" + message);
  });
});

export default (req, res) => {
  if (req.method === "GET") {
    io.attach(req.socket.server);
    res.end();
    return;
  }

  return res.status(405).end();
};

