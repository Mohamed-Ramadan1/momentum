// //packages imports
// import { injectable, inject } from "inversify";
// import { Queue } from "bullmq";
// import { Logger } from "winston";

// // shared imports
// import { TYPES } from "@shared/index";

// //Config imports
// import { queueRedis } from "@config/index";
// import { ILoggerFactory } from "@shared/interfaces";

// // interfaces imports
// import { GenerateQueueData } from "../interfaces/queueFactory.interface";

// @injectable()
// export class QueueFactory {
//   private queues: Map<string, Queue> = new Map();
//   private logger: Logger;
//   // private queueConfig: QueueConfig;

//   constructor(
//     @inject(TYPES.LoggerFactory) private readonly loggerFactory: ILoggerFactory
//   ) {
//     this.logger = loggerFactory.getLogger("QueueFactory");
//   }

//   async createQueue(data: GenerateQueueData): Promise<Queue> {
//     try {
//       // Use the actual queue name as the key
//       const queueKey = data.queueName;

//       // Clean up existing queue if it exists
//       if (this.queues.has(queueKey)) {
//         const existingQueue = this.queues.get(queueKey);
//         await existingQueue?.close();
//       }

//       const queue = new Queue(data.queueName, {
//         connection: queueRedis,
//         prefix: "momentum-jobs",
//         defaultJobOptions: {
//           attempts: data.attempts || 5,
//           removeOnComplete: data.removeOnComplete || 10,
//           removeOnFail: data.removeOnFail || 5,
//           backoff: {
//             type: data.backoff?.type || "exponential",
//             delay: data.backoff?.delay || 2000,
//           },
//         },
//       });

//       // Store with the actual queue name
//       this.queues.set(queueKey, queue);

//       return queue;
//     } catch (err: any) {
//       this.logger.error(`Failed to create queue ${data.queueName}:`, err);
//       throw err; // Re-throw to let caller handle
//     }
//   }

//   getQueue(name: string): Queue | undefined {
//     if (this.queues.has(name)) {
//       return this.queues.get(name);
//     } else {
//       this.logger.warn(`Queue ${name} does not exist.`);
//       return undefined;
//     }
//   }

//   listQueues(): Queue[] {
//     return Array.from(this.queues.values());
//   }

//   queueExists(name: string): boolean {
//     return this.queues.has(name);
//   }

//   deleteQueue(name: string): void {
//     if (this.queues.has(name)) {
//       const queue = this.queues.get(name);
//       queue?.close();
//       this.queues.delete(name);
//     }
//   }

//   pauseQueue(name: string): void {
//     if (this.queues.has(name)) {
//       const queue = this.queues.get(name);
//       queue?.pause();
//     }
//   }

//   resumeQueue(name: string): void {
//     if (this.queues.has(name)) {
//       const queue = this.queues.get(name);
//       queue?.resume();
//     }
//   }

//   emptyQueueCompleted(name: string): void {
//     if (this.queues.has(name)) {
//       const queue = this.queues.get(name);
//       queue?.clean(0, 0, "completed");
//     }
//   }

//   emptyQueueFailed(name: string): void {
//     if (this.queues.has(name)) {
//       const queue = this.queues.get(name);
//       queue?.clean(0, 0, "failed");
//     }
//   }

//   emptyWaitingQueue(name: string): void {
//     if (this.queues.has(name)) {
//       const queue = this.queues.get(name);
//       queue?.clean(0, 0, "waiting");
//     }
//   }

//   closeQueue(name: string): void {
//     if (this.queues.has(name)) {
//       const queue = this.queues.get(name);
//       queue?.close();
//     }
//   }

//   closeAllQueues(): void {
//     this.queues.forEach((queue) => {
//       queue.close();
//     });
//   }

//   pauseAllQueues(): void {
//     this.queues.forEach((queue) => {
//       queue.pause();
//     });
//   }

//   resumeAllQueues(): void {
//     this.queues.forEach((queue) => {
//       queue.resume();
//     });
//   }

//   drainQueue(name: string): void {
//     if (this.queues.has(name)) {
//       const queue = this.queues.get(name);
//       queue?.drain();
//     }
//   }
// }
