import dotenv from "dotenv";
import app from "./app";
import { prisma } from "./config";
// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, async () => {
  // Ensure the database connection is established
  try {
  
    console.log(
      `Server is running on port ${PORT}`,
      `full URL: http://localhost:${PORT}`
    );
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process if database connection fails
  }
});
