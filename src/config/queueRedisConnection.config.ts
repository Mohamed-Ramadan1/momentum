import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Dedicated connection for BullMQ queues
export const queueRedis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  connectTimeout: 10000,
  keepAlive: 0,
  maxRetriesPerRequest: null,
});
