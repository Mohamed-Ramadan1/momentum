import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// moc sending email
import { EmailTransporter } from "./shared/utils/mailTransporter";

const emailTransporter = new EmailTransporter();
// middlewares imports
import { databaseHealthCheck } from "./shared/index";
// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", async (req, res) => {
  try {
    await emailTransporter.sendEmail(
      "mohamedramadan11b@gmail.com",
      "Welcome to the API",
      "Hello, welcome to our API!",
      "<p>Hello, welcome to our API!</p>"
    );
  } catch (error) {
    console.error("Error sending email:", error);
  }
  res.json({ message: "Welcome to the API" });
});

// Health check route
app.get("/health", databaseHealthCheck);

export default app;
