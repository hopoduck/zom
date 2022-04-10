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

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) publicRooms.push(key);
  });
  return publicRooms;
}

io.on("connection", (socket) => {
  socket.nickname = "Anonymous";
  socket.on("enter_room", (roomName, done) => {
    console.log(roomName);
    done();
    socket.join(roomName);
    socket.to(roomName).emit("welcome", socket.nickname);
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      console.log("bye", room);
      socket.to(room).emit("bye", socket.nickname);
    });
  });
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (message, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${message}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket.nickname = nickname));
});

server.listen(3000, () => console.log("listing port:3000"));
