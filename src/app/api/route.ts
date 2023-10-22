import { WebSocketServer } from "ws";
import { NextApiRequest, NextApiResponse } from "next";

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
    ws.send(`Hello! You sent -> ${message}`);
  });

  ws.send("Hi there, I am a WebSocket server");
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  if (
    !req.headers.upgrade ||
    req.headers.upgrade.toLowerCase() !== "websocket"
  ) {
    return res.status(426).end();
  }

  return new Promise<void>((resolve, reject) => {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
      ws.on("error", (err) => reject(err));
      resolve();
    });
  });
};
