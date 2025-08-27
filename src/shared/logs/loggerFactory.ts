import winston, { Logger } from "winston";
import fs from "fs";
import DailyRotateFile from "winston-daily-rotate-file";
import { jsonFormatter } from "./jsonFormatter";
import { injectable } from "inversify";
import { ILoggerFactory } from "@shared/interfaces/loggerFactory.interface";
/**
 * LoggerFactory provides a singleton Winston logger
 * instance configured with console and rotating file transports.
 *
 * Usage:
 * ```ts
 * LoggerFactory.init(); // Initialize once in application
 * const logger = LoggerFactory.getLogger("MyModule");
 * logger.info("Hello");
 * ```
 */

@injectable()
export class LoggerFactory implements ILoggerFactory {
  private static instance: Logger;
  constructor() {
    this.init();
  }

  /**
   * Initializes the logger with the specified log level.
   * Sets up transports for console output and rotating file logs.
   *
   * @param logLevel - Logging level (default: 'info')
   */
  private init(logLevel: string = "info"): void {
    if (LoggerFactory.instance) return;

    const logDir = process.env.LOG_DIR || "logs";
    const isProduction = process.env.NODE_ENV === "production";

    // Ensure log directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    LoggerFactory.instance = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        jsonFormatter // Custom formatter (fallback to winston.format.json if needed)
      ),
      defaultMeta: { service: "global-app" },
      transports: [
        // Console output (formatted differently in dev)
        new winston.transports.Console({
          format: isProduction
            ? winston.format.json()
            : winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
              ),
        }),

        // Rotating file transport for application logs
        new DailyRotateFile({
          dirname: `${logDir}/app`,
          filename: `application-%DATE%.log`,
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "10m",
          maxFiles: "14d",
        }),
      ],

      // Log uncaught exceptions
      exceptionHandlers: [
        new DailyRotateFile({
          dirname: `${logDir}/app`,
          filename: "exceptions-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "10m",
          maxFiles: "30d",
        }),
      ],

      // Log unhandled promise rejections
      rejectionHandlers: [
        new DailyRotateFile({
          dirname: `${logDir}/app`,
          filename: "rejections-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "10m",
          maxFiles: "30d",
        }),
      ],
    });
  }

  /**
   * Returns the singleton logger instance, optionally with a child logger scoped to a module.
   *
   * @param moduleName - Optional module name to scope logs.
   * @returns A Winston Logger instance
   * @throws Error if logger is not initialized
   */
  getLogger(moduleName?: string): Logger {
    if (!LoggerFactory.instance) {
      throw new Error(
        "Logger not initialized. Call LoggerFactory.init() first."
      );
    }

    return moduleName
      ? LoggerFactory.instance.child({ module: moduleName })
      : LoggerFactory.instance;
  }
}
