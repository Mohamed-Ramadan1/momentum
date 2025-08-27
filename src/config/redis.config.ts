import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  //   password: process.env.REDIS_PASSWORD,
  //   db: parseInt(process.env.REDIS_DB || "0"),
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  connectTimeout: 10000,
  commandTimeout: 5000,
  keepAlive: 30000,
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis connected successfully");
});

redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

export default redisClient;
