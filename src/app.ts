import express from "express";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "The most powerful API in my career" });
});

export default app;
