import dotenv from "dotenv";
import app from "./app";

// app.ts or server.ts
import { initializeDatabase } from "@config/db.config";
import { LoggerFactory } from "@shared/logs/loggerFactory";
import { log } from "console";

// Or "info", "error", etc.

dotenv.config();

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, async () => {
  // Ensure the database connection is established
  // LoggerFactory initialization
  LoggerFactory.init("info");
  const logger = LoggerFactory.getLogger("MomentumApp");
  logger.info("Logger initialized");

  try {
    // Validate database connection before starting the server
    await initializeDatabase();

    logger.info(`Server is running on port ${PORT}`);
    logger.info(`Database connection established`);
  } catch (error) {
    logger.error("Database connection failed:", error);
    process.exit(1);
  }
});
