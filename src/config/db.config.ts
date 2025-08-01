import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables.");
}

// Create the connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // return an error after 2 seconds
});

// Create drizzle instance
export const db = drizzle(pool);

// Validation function to test database connectivity
export async function validateDatabaseConnection(): Promise<boolean> {
  try {
    // Test the connection with a simple query
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();

    console.log("✅ Database connection validated successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

// Optional: Initialize and validate on module load
export async function initializeDatabase(): Promise<void> {
  try {
    const isValid = await validateDatabaseConnection();
    if (!isValid) {
      throw new Error("Failed to establish database connection");
    }
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

// Handle pool events for better monitoring
pool.on("connect", (client) => {
  console.log("🔗 New client connected to database");
});

pool.on("error", (err, client) => {
  console.error("❌ Unexpected error on idle client", err);
});

pool.on("remove", (client) => {
  console.log("🔌 Client removed from pool");
});

// Graceful shutdown function
export async function closeDatabaseConnection(): Promise<void> {
  try {
    await pool.end();
    console.log("📴 Database pool closed successfully");
  } catch (error) {
    console.error("Error closing database pool:", error);
    throw error;
  }
}

export { pool };
