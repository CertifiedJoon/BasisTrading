import { ChildProcess, fork } from "node:child_process";
import { ExchangeName, ExchangeServerURL } from "./types/ExchangeServers";
import { WebSocket } from "ws";

const config_data = require("./config.json");

interface ExchangeServers {
  exchangeName: ExchangeName;
  exchangeServerURL: ExchangeServerURL;
  port: number;
}

interface Config {
  childProcessConfig: ExchangeServers[];
}

if (process.argv[2] == "child") {
  console.log(
    `Hello from ${process.argv[2]}!, ${process.argv[3]}, ${process.argv[4]}, ${process.argv[5]}`
  );

  const exchangeName: ExchangeName = process.argv[3];
  const exchangeServerURL: ExchangeServerURL = process.argv[4];
  const portToServe = process.argv[5];

  const wss = new WebSocket.Server({ port: parseInt(portToServe) });
  const exchangeWs = new WebSocket(exchangeServerURL);

  exchangeWs.on("open", () => {
    exchangeWs.send(
      JSON.stringify({
        req_id: "test",
        op: "subscribe",
        args: ["tickers.BTCUSDT"],
      })
    );
  });

  exchangeWs.on("close", () => {
    console.log("Disconnected from server");
  });

  wss.on("connection", (ws: WebSocket) => {
    console.log("New client connected");
    ws.send(exchangeName);

    ws.on("message", (message: string) => {
      console.log(`Received message: ${message}`);
      ws.send(`Server received your message: ${message}`);
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  exchangeWs.on("message", (message: Buffer) => {
    // console.log(message.toString("ascii"));
    wss.clients.forEach((client) => {
      client.send(message.toString());
    });
  });
} else {
  const children: ChildProcess[] = [];
  const config: Config = config_data;
  const exchangeServers = config.childProcessConfig;

  for (let i = 0; i < exchangeServers.length; i++) {
    const controller = new AbortController();
    const { signal } = controller;
    const { exchangeName, exchangeServerURL, port } = exchangeServers[i];

    const child: ChildProcess = fork(
      __filename,
      ["child", exchangeName, exchangeServerURL, port.toString()],
      { signal }
    );
    children.push(child);
    child.on("error", (err) => {
      // This will be called with err being an AbortError if controller aborts
      console.log("ABORTED");
    });
  }
}
