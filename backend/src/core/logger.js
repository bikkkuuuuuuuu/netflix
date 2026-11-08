
const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const fs = require("fs");
const path = require("path");

const IS_VERCEL = process.env.VERCEL === "1";
const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const CONSOLE_LOG_LEVEL = process.env.CONSOLE_LOG_LEVEL || "info";

const LOG_DIR = path.resolve(process.env.LOG_DIR || "logs");

const fileFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const extra =
      Object.keys(meta).length > 0
        ? ` ${JSON.stringify(meta)}`
        : "";

    return `${timestamp} ${level}: ${stack || message}${extra}`;
  })
);

const transports = [
  new winston.transports.Console({
    level: CONSOLE_LOG_LEVEL,
    format: consoleFormat,
  }),
];

// File logging is only enabled in local/server environments
// where persistent filesystem writes are supported.
if (!IS_VERCEL) {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }

  transports.push(
    new DailyRotateFile({
      level: LOG_LEVEL,
      filename: path.join(LOG_DIR, "application-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: fileFormat,
    }),

    new DailyRotateFile({
      level: "error",
      filename: path.join(LOG_DIR, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      format: fileFormat,
    })
  );
}

const exceptionHandlers = [
  new winston.transports.Console({
    format: consoleFormat,
  }),
];

const rejectionHandlers = [
  new winston.transports.Console({
    format: consoleFormat,
  }),
];

if (!IS_VERCEL) {
  exceptionHandlers.push(
    new DailyRotateFile({
      filename: path.join(LOG_DIR, "exceptions-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxFiles: "30d",
      format: fileFormat,
    })
  );

  rejectionHandlers.push(
    new DailyRotateFile({
      filename: path.join(LOG_DIR, "rejections-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxFiles: "30d",
      format: fileFormat,
    })
  );
}

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: fileFormat,
  transports,
  exceptionHandlers,
  rejectionHandlers,
  exitOnError: false,
});

module.exports = logger;
