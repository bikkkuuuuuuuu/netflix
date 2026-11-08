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
const path = require("node:path");
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

// const publicDir = path.resolve(process.env.LOCAL_STORAGE_PATH || "./public");
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

const publicDir = path.resolve(process.env.LOCAL_STORAGE_PATH || "./public");
const moviesDir = path.join(publicDir, "movies");
const uploadsDir = path.join(publicDir, "uploads");
const frontendDir = path.join(publicDir, "app");

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.get("/", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Netflix Backend API is running",
    deployment: "VERCEL-FIX-V2",
  });
});

app.get("/__deploy-check", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Correct Express application loaded",
    version: "V2",
  });
});

// app.use("/movies/:id/images", (req, res, next) => {
//   const movieDir = path.join(publicDir, "movies", req.params.id, "images");

//   express.static(movieDir, {
//     index: false,
//     dotfiles: "deny",
//   })(req, res, next);
// });

// app.use("/movies/:id/hls", (req, res, next) => {
//   const movieDir = path.join(publicDir, "movies", req.params.id, "hls");

//   express.static(movieDir, {
//     index: false,
//     dotfiles: "deny",
//   })(req, res, next);
// });

// Serve movie images
app.use(
  "/movies",
  express.static(moviesDir, {
    index: false,
    dotfiles: "deny",
    fallthrough: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".m3u8")) {
        res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      }
      if (filePath.endsWith(".ts")) {
        res.setHeader("Content-Type", "video/mp2t");
      }
    },
  }),
);
// app.get("*name", (_req, res) => {
//   res.sendFile(path.join(publicDir, "index.html"));
// });

app.use("/api/v1", apiRouter);

app.use("/api", (req, res) => {
  res.status(404).json({
    data: {},
    message: `API route not found: ${req.originalUrl}`,
    status: "NOT_FOUND",
    options: null,
  });
});

// app.use(
//   express.static(frontendDir, {
//     index: false,
//     dotfiles: "deny",
//   }),
// );

// React Router SPA fallback
// app.get("/{*splat}", (req, res, next) => {
//   res.sendFile(path.join(frontendDir, "index.html"), (error) => {
//     if (error) next(error);
//   });
// });



if (process.env.VERCEL !== "1") {
  app.use(
    express.static(frontendDir, {
      index: false,
      dotfiles: "deny",
    }),
  );

  app.get("/{*splat}", (req, res, next) => {
    res.sendFile(
      path.join(frontendDir, "index.html"),
      (error) => {
        if (error) next(error);
      },
    );
  });
}

app.use((req, res) => {
  res.status(404).json({
    data: {},
    message: `Resource not found: ${req.originalUrl}`,
    status: "NOT_FOUND",
    options: null,
  });
});

app.use((error, req, res, next) => {
  let code = Number(error.status || error.statusCode || error.code) || 500;
  const detail = error.detail || {};

  let message = error.message || "Internal Server Error";
  let status = error.status || "INTERNAL_SERVER_ERROR";

  if (Number(error.code) === 11000) {
    code = 400;

    Object.keys(error.keyPattern || {}).forEach((key) => {
      detail[key] = `${key} should be unique`;
    });

    status = "VALIDATION_FAILED";
    message = "Validation Failed";
  }

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
    message,
    status,
    options: null,
  });
});
module.exports = app;
