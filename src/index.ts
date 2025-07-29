import dotenv from "dotenv";
import app from "./app";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
// Start server
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}`,
    `full URL: http://localhost:${PORT}`
  );
});
