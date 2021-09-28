var express = require("express");
var app = express();
app.use(express.static(__dirname));
var http = require("http").Server(app);
var WebSocketServer = require("ws").Server;
var webSocketServer;
const PORT = 3000;
const Readline = require("@serialport/parser-readline");
const SerialPort = require("serialport");
var comport;
var parser;
var newport;
SerialPort.list().then(function (ports) {
  ports.forEach(function (ports) {
    if (
      ports.pnpId.includes("VID_10C4&PID_EA60") ||
      ports.pnpId.includes("VID_1A86&PID_7523")
    ) {
      comport = ports.path;
      console.log("PlayComputer Connected at :", comport);
      console.log("Visit 'http://localhost:3000' on your browser");
      newport = new SerialPort(comport, {
        baudRate: 115200,
        dataBits: 8,
        parity: "none",
        stopBits: 1,
        flowControl: false,
      });
      parser = newport.pipe(new Readline({ delimiter: "\r\n" }));
    }
  });
  if (!newport) {
    console.log("PlayComputer not connected \nConnect and reopen again");
  }
});

server = http.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});

webSocketServer = new WebSocketServer({ server: server });

webSocketServer.on("connection", function (socket) {
  console.log("New client connection");
  parser.on("data", async function (data) {
    pressed = true;
    data = await data.toString("utf-8").trim();
    // console.log(typeof data);
    // console.log("movement from esp32:", data);
    socket.send(data);
  });
  // socket.onmessage = function (message) {
  //   if (message.data == "stop") {
  //     parser.write("stop", function (err) {
  //       if (err) {
  //         console.log(err);
  //       }
  //     });
  //   }
  // };
});

app.get("/", (req, res) => {
  //send html file
  res.sendFile(__dirname + "/index.html");
});
