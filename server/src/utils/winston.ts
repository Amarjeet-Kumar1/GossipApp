import DailyRotateFile from "winston-daily-rotate-file"
import { createLogger, format, transports } from "winston"
import cluster from "cluster"
const { combine, timestamp, prettyPrint, json, colorize, align, printf } =
  format

const myformat = combine(
  colorize(),
  timestamp(),
  align(),
  printf((info: any) => {
    if (info.stack) {
      try {
        const stackTrace = info.stack.split("backend")[1].split(")")[0].trim()
        return `${info.timestamp} ${cluster?.isPrimary ? `MASTER` : `WORKER`} ${
          cluster?.worker?.id ?? ""
        } ${info.level}: ${info.message} \t Traceback: backend${stackTrace}`
      } catch (err) {
        return `${info.timestamp} ${cluster?.isPrimary ? `MASTER` : `WORKER`} ${
          cluster?.worker?.id ?? ""
        } ${info.level}: ${info.message}`
      }
    }
    return `${info.timestamp} ${cluster?.isPrimary ? `MASTER` : `WORKER`} ${
      cluster?.worker?.id ?? ""
    } ${info.level}: ${info.message}`
  })
)

const ServerTransport = new DailyRotateFile({
  filename: "./logs/server-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "7d",
  level: "info",
  format: combine(json(), timestamp(), prettyPrint()),
})

const ErrorTransport = new DailyRotateFile({
  filename: "./logs/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "7d",
  format: combine(json(), timestamp(), prettyPrint()),
  level: "error",
})

const DebugTransport = new DailyRotateFile({
  filename: "./logs/debug-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "7d",
  format: combine(json(), timestamp(), prettyPrint()),
  level: "debug",
})

const logger = createLogger({
  transports: [
    ServerTransport,
    ErrorTransport,
    DebugTransport,
    new transports.Console({
      level: "info",
      handleExceptions: true,
      format: myformat,
    }),
  ],
  exitOnError: false,
})

;(logger as any).stream = {
  write(message: string) {
    logger.info(message)
  },
}

module.exports = logger
export default logger
