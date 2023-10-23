import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";

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

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    io.attach(req.socket.server);
    res.end();
    return;
  }

  return res.status(405).end();
};
