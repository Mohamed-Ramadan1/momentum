import dotenv from "dotenv";
import app from "./app";

// app.ts or server.ts
import { initializeDatabase } from "@config/db.config";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, async () => {
  // Ensure the database connection is established
  try {
    // Validate database connection before starting the server
    await initializeDatabase();

    console.log("Database connected successfully");
    console.log(
      `Server is running on port ${PORT}`,
      `full URL: http://localhost:${PORT}`
    );
  } catch (error) {
    console.error("Database connection failed:", error);

    process.exit(1); // Exit the process if database connection fails
  }
});
