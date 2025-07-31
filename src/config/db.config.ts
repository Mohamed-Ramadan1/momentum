import pg from "pg";
import dotenv from "dotenv";
// Load environment variables
dotenv.config();

const { Pool } = pg;
export const pool: pg.Pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
});

// Function to test database connection
export async function testDatabaseConnection() {
  try {
    // Test the connection with a simple query
    const result = await pool.query(
      "SELECT NOW() as current_time, current_user, current_database()"
    );
    console.log("✅ Database connected successfully!");
    console.log("Connection details:", {
      time: result.rows[0].current_time,
      user: result.rows[0].current_user,
      database: result.rows[0].current_database,
    });
    return true;
  } catch (error: any) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
}
