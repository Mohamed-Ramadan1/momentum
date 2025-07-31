import dotenv from "dotenv";
import app from "./app";
import { testDatabaseConnection } from "@config/index";
// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, async () => {
  console.log(
    `Server is running on port ${PORT}`,
    `full URL: http://localhost:${PORT}`
  );
  await testDatabaseConnection();
});
