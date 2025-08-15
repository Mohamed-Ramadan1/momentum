//packages imports
import { injectable, inject } from "inversify";
import { Queue } from "bullmq";
import { Logger } from "winston";

// shared imports
import { TYPES } from "@shared/index";

//Config imports
import { queueRedis } from "@config/index";
import { ILoggerFactory } from "@shared/interfaces";

// interfaces imports
import { GenerateQueueData } from "../interfaces/queueFactory.interface";

@injectable()
export class QueueFactory {
  private queues: Map<string, Queue> = new Map();
  private logger: Logger;
  // private queueConfig: QueueConfig;

  constructor(
    @inject(TYPES.LoggerFactory) private readonly loggerFactory: ILoggerFactory
  ) {
    this.logger = loggerFactory.getLogger("QueueFactory");
  }

  async createQueue(data: GenerateQueueData): Promise<Queue> {
    try {
      // Use the actual queue name as the key
      const queueKey = data.queueName;

      // Clean up existing queue if it exists
      if (this.queues.has(queueKey)) {
        const existingQueue = this.queues.get(queueKey);
        await existingQueue?.close();
      }

      const queue = new Queue(data.queueName, {
        connection: queueRedis,
        prefix: "momentum-jobs",
        defaultJobOptions: {
          attempts: data.attempts || 5,
          removeOnComplete: data.removeOnComplete || 10,
          removeOnFail: data.removeOnFail || 5,
          backoff: {
            type: data.backoff?.type || "exponential",
            delay: data.backoff?.delay || 2000,
          },
        },
      });

      // Store with the actual queue name
      this.queues.set(queueKey, queue);

      return queue;
    } catch (err: any) {
      this.logger.error(`Failed to create queue ${data.queueName}:`, err);
      throw err; // Re-throw to let caller handle
    }
  }

  getQueue(name: string): Queue | undefined {
    if (this.queues.has(name)) {
      return this.queues.get(name);
    } else {
      this.logger.warn(`Queue ${name} does not exist.`);
      return undefined;
    }
  }

  listQueues(): Queue[] {
    return Array.from(this.queues.values());
  }

  // TODO
  queueExists(name: string): boolean {
    return this.queues.has(name);
  }

  // TODO
  deleteQueue(name: string): void {}

  // TODO
  pauseQueue(name: string): void {}

  // TODO
  resumeQueue(name: string): void {}
  // TODO
  emptyQueue(name: string): void {}
  // TODO
  closeQueue(name: string): void {}
  // TODO
  closeAllQueues(): void {}

  // TODO
  getQueueMetrics(name: string): void {}
  // TODO
  isHealthy(name: string): void {}

  // TODO
  monitorQueue(name: string): void {}
  // TODO
  pauseAllQueues(): void {}
  // TODO
  resumeAllQueues(): void {}
  // TODO
  drainQueue(name: string): void {}

  // TODO
  getQueueState(name: string): void {}
}
