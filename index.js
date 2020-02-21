const path = require("path");
let express = require("express");

var app = express();
let PORT = 8000;
var server = require("http").Server(app);
var io = require("socket.io")(server);

let DIST_DIR = path.join(__dirname, "src");

app.use(express.static(DIST_DIR));

app.get("*", (req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

const reloader = () => {
  io.on("connection", () => {
    // io.sockets.emit("reload", {});
  });
  io.on("disconnect", () => {
    console.log("user disconnected");
  });
};

// reloader();
server.listen(PORT, () => {
  console.log(`go to http://localhost:${PORT}`);
});
