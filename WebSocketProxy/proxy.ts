import { ChildProcess, fork } from "node:child_process";
import { ExchangeName, ExchangeServerURL } from "./types/ExchangeServers";
import { WebSocket } from "ws";

const config_data = require("./config.json");
const exchangeConnections = {};

interface ExchangeServers {
  exchangeName: ExchangeName;
  exchangeServerURL: ExchangeServerURL;
  port: number;
  pingMessage: string;
  pingInterval: number;
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
  const pingMessage = process.argv[6];
  const pingInterval = parseInt(process.argv[7]);

  const wss = new WebSocket.Server({ port: parseInt(portToServe) });

  wss.on("connection", (ws: WebSocket) => {
    console.log("New client connected");
    ws.send(exchangeName);

    ws.on("message", (message: string) => {
      console.log(`Received message: ${message}`);
      ws.send(`Server received your message: ${message}`);
    });

    const exchangeWs = new WebSocket(exchangeServerURL);

    ws.on("close", () => {
      console.log("Client disconnected");
      exchangeWs.close();
    });

    exchangeWs.on("open", () => {
      switch (exchangeName) {
        case "bybit":
          exchangeWs.send(
            JSON.stringify({
              req_id: "test",
              op: "subscribe",
              args: ["tickers.BTCUSDT"],
            })
          );
          break;
        case "hyperliquid":
          exchangeWs.send(
            JSON.stringify({
              method: "subscribe",
              subscription: {
                type: "activeAssetCtx",
                coin: "BTC",
              },
            })
          );
          break;
        default:
          break;
      }
    });

    exchangeWs.on("close", () => {
      console.log("Disconnected from server");
    });

    exchangeWs.on("message", (message: Buffer) => {
      const response = JSON.parse(message.toString("ascii"));
      switch (exchangeName) {
        case "bybit":
          if ("topic" in response)
            wss.clients.forEach((client) => {
              client.send(message.toString());
            });
          break;
        case "hyperliquid":
          if (response["channel"] == "activeAssetCtx")
            wss.clients.forEach((client) => {
              client.send(message.toString());
            });
          break;
        default:
          break;
      }
    });

    setInterval(() => {
      exchangeWs.send(pingMessage);
    }, pingInterval);
  });
} else {
  const children: ChildProcess[] = [];
  const config: Config = config_data;
  const exchangeServers = config.childProcessConfig;

  for (let i = 0; i < exchangeServers.length; i++) {
    const controller = new AbortController();
    const { signal } = controller;
    const { exchangeName, exchangeServerURL, port, pingMessage, pingInterval } =
      exchangeServers[i];

    const child: ChildProcess = fork(
      __filename,
      [
        "child",
        exchangeName,
        exchangeServerURL,
        port.toString(),
        pingMessage,
        pingInterval.toString(),
      ],
      { signal }
    );
    children.push(child);
    child.on("error", (err) => {
      // This will be called with err being an AbortError if controller aborts
      console.log("ABORTED");
    });
  }
}
