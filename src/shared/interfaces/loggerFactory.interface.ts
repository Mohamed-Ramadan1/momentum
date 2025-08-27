// src/shared/logs/interfaces/ILoggerFactory.ts
import { Logger } from "winston";

export interface ILoggerFactory {
  /**
   * Returns a Winston logger instance.
   *
   * @param moduleName Optional module name to scope logs.
   */
  getLogger(moduleName?: string): Logger;
}
