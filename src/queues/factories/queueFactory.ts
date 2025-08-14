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
import { QueueConfig } from "../interfaces/queueFactory.interface";

// const defaultConfig: Partial<QueueConfig> = {
//   prefix: "momentum-jobs",
//   defaultJobOptions: {
//     attempts: 3,
//     removeOnComplete: 10,
//     removeOnFail: 5,
//     backoff: {
//       type: "exponential",
//       delay: 2000,
//     },
//   },
// };

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

  createQueue() {
    const queue: Queue = new Queue("default", {
      connection: queueRedis,
    });
  }

  getQueue(name: string): Queue | undefined {
    return undefined;
  }

  listQueues(): Queue[] {
    return Array.from(this.queues.values());
  }
  queueExists(name: string): boolean {
    return this.queues.has(name);
  }
  deleteQueue(name: string): void {}
  pauseQueue(name: string): void {}
  resumeQueue(name: string): void {}
  emptyQueue(name: string): void {}
  closeQueue(name: string): void {}
  closeAllQueues(): void {}
  getQueueMetrics(name: string): void {}
  isHealthy(name: string): void {}
  monitorQueue(name: string): void {}
  pauseAllQueues(): void {}
  resumeAllQueues(): void {}
  drainQueue(name: string): void {}
  getQueueState(name: string): void {}
}
