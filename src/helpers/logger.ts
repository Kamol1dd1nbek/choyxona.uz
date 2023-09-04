import * as winston from "winston";
import { format, createLogger, transports } from "winston";
const { timestamp, label, printf } = format;
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${label}] ${message}`
})
const myLogger = () => {
  return createLogger({
    level: 'info',
    format: winston.format.combine(timestamp(), myFormat),
    defaultMeta: { service: "user-service" },
    transports: [
      new transports.File({ filename: "error.log", level: "error" }),
      new transports.File({ filename: "combined.log" })
    ]
  })
}
export default myLogger;