import express from "express";
import dotenv from "dotenv";

import { pool } from "@config/index";
// Load environment variables
dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "The most powerful API in my career",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default app;
