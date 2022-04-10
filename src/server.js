import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const server = http.createServer(app);
const io = SocketIO(server);

io.on("connection", (socket) => {
  socket.on("enter_room", (msg, done) => {
    console.log(msg);
    setTimeout(() => {
      done();
    }, 5000);
  });
});

// const wss = new WebSocket.Server({ server });
// const sockets = [];
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket.nickname = "who?";
//   console.log("connected to server");
//   socket.on("close", () => console.log("disconnected to broswer"));
//   socket.on("message", (message) => {
//     const { type, payload } = JSON.parse(message);
//     switch (type) {
//       case "nickname":
//         console.log(payload);
//         socket.nickname = payload;
//         break;
//       case "message":
//         sockets.forEach((s) => s.send(`${socket.nickname}: ${payload}`));
//         break;
//       default:
//         break;
//     }
//   });
// });

server.listen(3000, () => console.log("listing port:3000"));
