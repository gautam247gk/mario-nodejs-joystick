var express = require("express");
var app = express();
app.use(express.static(__dirname));
var http = require("http").Server(app);
var WebSocketServer = require("ws").Server;
var webSocketServer;
const PORT = 3000;
var portid = require("./portid");
const SerialPort = require("serialport");
const port = new SerialPort(portid.port, {
  baudRate: 115200,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

server = http.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});

webSocketServer = new WebSocketServer({ server: server });

webSocketServer.on("connection", function (socket) {
  console.log("New client connection");
  port.write("start", function (err) {
    console.log("writing start to esp32");
    if (err) {
      return console.log("Error on write: ", err.message);
    }
  });
  port.on("data", async function (data) {
    pressed = true;
    data = await data.toString("utf-8").trim();
    console.log(typeof data);
    console.log("movement from esp32:", data);
    socket.send(data);
  });
  socket.onmessage(function (message) {
    if (message.data == "stop") {
      port.write("stop", function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
  });
});

app.get("/", (req, res) => {
  //send html file
  res.sendFile(__dirname + "/index.html");
});
