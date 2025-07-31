import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { prisma } from "./config";
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
  const users = await prisma.User.findMany();
  res.json({ message: "Welcome to the API", users });
});

export default app;
