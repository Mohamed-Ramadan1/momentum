export { queueModule } from "./di-binding/queue.module";

import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

// Redis connection
const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

// Create the queue
export const queue = new Queue("function-processor", { connection });

// Create the worker to process jobs
const worker = new Worker(
  "function-processor",
  async (job) => {
    console.log("📥 Received job:", job.name, job.data);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate work
    console.log("✅ Job done!");
    return { success: true };
  },
  { connection }
);
