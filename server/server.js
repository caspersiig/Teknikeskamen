var express = require('express');
var app = express();
var server = app.listen(8080);

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

const osc = require('node-osc');

var oldmsg = 1;
oscserver = new osc.Server(12000, "127.0.0.1");
client = new osc.Client("127.0.0.1", 6448);

function newConnection(socket) {
  console.log(socket.id + "Har lige Connected");

  socket.on('disconnect', function () {
    console.log(socket.id + " Har lige disconnected");
  });

  oscserver.on("message", (msg) => {
    if (msg[0] == "/wek/outputs") {
      if (msg[1] == 1 && oldmsg !== 1) {
        socket.emit("stå");
        console.log("står!");
      }
      if (msg[1] == 2 && oldmsg !== 2) {
        socket.emit("løb");
        console.log("løb!");
      }
      if (msg[1] == 3 && oldmsg !== 3) {
        socket.emit("hop");
        console.log("hop!");
      }
      oldmsg = msg[1];
    }
    
  });

  socket.on("pew", (data) => {
    console.log(data);

    const msg = new osc.Message('/wek/inputs', data.a, data.b, data.e, data.f);
    client.send(msg);

  });
}