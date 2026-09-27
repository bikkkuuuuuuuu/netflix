const express = require("express");
const dbConnect = require("./db.config");
dbConnect();
const apiRouter = require("../router/router");
const cors = require("cors");
require("./passport.config");
const logger = require("../core/logger");
const { requestLogger } = require("../middlewares/logger.middleware");
const { connectRedis } = require("./redis.config.js");
const rateLimiter = require("../middlewares/rateLimiter.middleware.js");
// const { connectRabbitMq, consumeFromQueue } = require("./rabbitmq.config.js");

const app = express();

// const startRabbitMq = async () => {
//   try {
//     await connectRabbitMq();
//     await consumeFromQueue();
//   } catch (error) {
//     console.error("RabbitMQ startup failed:", error);
//   }
// };
// startRabbitMq();

app.use(requestLogger);

connectRedis();
//body parser

app.use(express.json()); //json parser
app.use(cors());
app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.use(
  rateLimiter({
    keyPrefix: "global",
    capacity: 100,
    refillRate: 10,
    refillInterval: 1000,
  }),
);
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/api/v1", apiRouter);

app.get("*name", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.use((error, req, res, next) => {
  let code = +error.code || 500;
  const detail = error.detail || {};
  let message = error.message || "Internal Sever Error";
  let status = error.status || "INTERNAL_SERVER_ERROR";

  //uniqueness validation failed
  if (+error.code === 11000) {
    code = 400;
    //{keyPattern:{email:1,name:1}}=>['email','name']
    Object.keys(error.keyPattern).map((key) => {
      detail[key] = `${key} should be unique`;
    });
    status = "VALIDATION_FAILED";
    message = "Validation Failed";
  }

  console.log(error);
  logger.error("Request failed", {
    method: req.method,
    path: req.originalUrl,
    statusCode: code,
    status,
    error: message,
    stack: error.stack,
  });
  res.status(code).json({
    data: detail,
    message: message,
    status: status,
    options: null,
  });
});
module.exports = app;
