const logger = require("../core/logger");
const crypto = require("crypto");

function requestLogger(req, res, next) {
  const requestId = crypto.randomUUID();

  req.requestId = requestId;

  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const duration = Number(process.hrtime.bigint() - start) / 1_000_000;

    logger.info("HTTP request", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
      ip: req.ip,
    });
  });

  next();
}
module.exports = { requestLogger };
