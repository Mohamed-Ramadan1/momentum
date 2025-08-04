import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { usersTable } from "./db/schema/users";
import { db } from "@config/db.config";
// middlewares imports
import { databaseHealthCheck } from "@shared/index";
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
    const user = await db.insert(usersTable).values({
      name: "John Doe",
      age: 30,
      email: "john.doe@example.com",
    });
    console.log(user);
    return res.json({ message: "Welcome to the API", user });
  } catch (error) {
    console.error("Error sending email:", error);
  }
});

// Health check route
app.get("/health", databaseHealthCheck);

export default app;
