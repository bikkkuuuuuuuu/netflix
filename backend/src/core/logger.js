const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const fs = require("fs");
const path = require("path");

const LOG_DIR = path.resolve(process.env.LOG_DIR || "logs");

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const fileFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp(),
  winston.format.colorize(),
  winston.format.json(),
);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const extra =
      Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";

    return `${timestamp} ${level}: ${stack || message}${extra}`;
  }),
);

const applicationLog = new DailyRotateFile({
  level: process.env.LOG_LEVEL || "info",
  filename: path.join(LOG_DIR, "application-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: fileFormat,
});

const errorLog = new DailyRotateFile({
  level: "error",
  filename: path.join(LOG_DIR, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
  format: fileFormat,
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",

  format: fileFormat,

  transports: [
    applicationLog,
    errorLog,

    new winston.transports.Console({
      level: process.env.CONSOLE_LOG_LEVEL || "info",
      format: consoleFormat,
    }),
  ],

  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(LOG_DIR, "exceptions-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxFiles: "30d",
      format: fileFormat,
    }),
  ],

  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(LOG_DIR, "rejections-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxFiles: "30d",
      format: fileFormat,
    }),
  ],

  exitOnError: false,
});

module.exports = logger;
