const fs = require("fs");
const cp = require("child_process");

const files = __dirname;

console.log(`Watching for file changes on ${files}`);

let server = "index.js";
const watcher = serverInstance => {
  console.log("Server started");
  fs.watch(
    files,
    {
      persistent: true,
      recursive: true,
      interval: 4000
    },
    (eventType, filename) => {
      serverInstance.kill();
      console.log("Server reloading");
      serverInstance = cp.fork(server);
      if (filename && eventType === "change") {
        console.log(`filenames changed: ${filename}`);
      } else {
        console.log("filename not provided");
      }
    }
  );
};
let serverInstance = cp.fork(server);

watcher(serverInstance);

process.on("SIGINT", function() {
  serverInstance.kill();
  fs.unwatchFile(server);
  process.exit();
});
