const http = require("http");
const app = require("./src/config/express.config");

const httpServer = http.createServer(app);

const port = Number(process.env.PORT) || 9005;
httpServer.listen(port, "192.168.254.16", (err) => {
  if (!err) {
    console.log("Server is running on port ", port);
    console.log("Press Ctrl + C to disconnect");
  }
});
httpServer.on("error", (err) => {});
