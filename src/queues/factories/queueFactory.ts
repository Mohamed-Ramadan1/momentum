import { injectable, inject } from "inversify";
import { Queue } from "bullmq";
import { Logger } from "winston";
import { EventEmitter } from "events";

// shared imports
import { TYPES } from "@shared/index";

//Config imports
import { queueRedis } from "@config/index";
import { ILoggerFactory } from "@shared/interfaces";

// interfaces imports
import {
  IAdvancedQueueFactory,
  GenerateQueueData,
  QueueFactoryConfig,
  QueueFactoryOptions,
  QueueStats,
  QueueFactoryEvents,
} from "../interfaces/queueFactory.interface";

@injectable()
export class QueueFactory
  extends EventEmitter
  implements IAdvancedQueueFactory
{
  private queues: Map<string, Queue> = new Map();
  private logger: Logger;
  private config: Required<QueueFactoryConfig>;
  private options: QueueFactoryOptions;
  private healthCheckInterval?: NodeJS.Timeout;

  constructor(
    @inject(TYPES.LoggerFactory) private readonly loggerFactory: ILoggerFactory,
    options: QueueFactoryOptions = {}
  ) {
    super();

    this.logger = loggerFactory.getLogger("QueueFactory");
    this.options = options;

    this.config = {
      defaultPrefix: options.defaultPrefix || "momentum-jobs",
      defaultAttempts: options.defaultAttempts || 5,
      defaultRemoveOnComplete: options.defaultRemoveOnComplete || 10,
      defaultRemoveOnFail: options.defaultRemoveOnFail || 5,
    };

    // Setup health check if enabled
    if (options.healthCheckInterval) {
      this.setupHealthCheck(options.healthCheckInterval);
    }

    this.logger.info("QueueFactory initialized", {
      config: this.config,
      options: this.options,
    });
  }

  private validateQueueName(name: string): void {
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new Error("Queue name must be a non-empty string");
    }
  }

  private checkMaxQueues(): void {
    if (
      this.options.maxConcurrentQueues &&
      this.queues.size >= this.options.maxConcurrentQueues
    ) {
      throw new Error(
        `Maximum number of concurrent queues (${this.options.maxConcurrentQueues}) reached`
      );
    }
  }

  private setupHealthCheck(interval: number): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        const unhealthyQueues = [];

        for (const [name, queue] of this.queues) {
          const health = await this.getQueueHealth(name);
          if (!health.isConnected) {
            unhealthyQueues.push(name);
          }
        }

        if (unhealthyQueues.length > 0) {
          this.logger.warn(
            `Unhealthy queues detected: ${unhealthyQueues.join(", ")}`
          );
        }
      } catch (error) {
        this.logger.error("Health check failed:", error);
      }
    }, interval);
  }

  private emitEvent<K extends keyof QueueFactoryEvents>(
    event: K,
    ...args: Parameters<QueueFactoryEvents[K]>
  ): void {
    if (this.options.enableEvents) {
      this.emit(event, ...args);
    }
  }

  async createQueue(data: GenerateQueueData): Promise<Queue> {
    try {
      this.validateQueueName(data.queueName);
      this.checkMaxQueues();

      const queueKey = data.queueName;

      // Clean up existing queue if it exists
      if (this.queues.has(queueKey)) {
        await this.deleteQueue(queueKey);
      }

      const queue = new Queue(data.queueName, {
        connection: queueRedis,
        prefix: this.config.defaultPrefix,
        defaultJobOptions: {
          attempts: data.attempts || this.config.defaultAttempts,
          removeOnComplete:
            data.removeOnComplete || this.config.defaultRemoveOnComplete,
          removeOnFail: data.removeOnFail || this.config.defaultRemoveOnFail,
          backoff: {
            type: data.backoff?.type || "exponential",
            delay: data.backoff?.delay || 2000,
          },
        },
      });

      this.queues.set(queueKey, queue);
      this.logger.info(`Queue ${queueKey} created successfully`);
      this.emitEvent("queueCreated", queueKey);

      return queue;
    } catch (err: any) {
      this.logger.error(`Failed to create queue ${data.queueName}:`, err);
      this.emitEvent("queueError", data.queueName, err);
      throw err;
    }
  }

  getQueue(name: string): Queue | undefined {
    this.validateQueueName(name);
    const queue = this.queues.get(name);
    if (!queue) {
      this.logger.warn(`Queue ${name} does not exist.`);
    }
    return queue;
  }

  listQueues(): Queue[] {
    return Array.from(this.queues.values());
  }

  queueExists(name: string): boolean {
    this.validateQueueName(name);
    return this.queues.has(name);
  }

  async deleteQueue(name: string): Promise<boolean> {
    try {
      this.validateQueueName(name);
      if (this.queues.has(name)) {
        const queue = this.queues.get(name);
        await queue?.close();
        this.queues.delete(name);
        this.logger.info(`Queue ${name} deleted successfully`);
        this.emitEvent("queueDeleted", name);
        return true;
      } else {
        this.logger.warn(`Attempted to delete non-existent queue: ${name}`);
        return false;
      }
    } catch (err: any) {
      this.logger.error(`Failed to delete queue ${name}:`, err);
      this.emitEvent("queueError", name, err);
      throw err;
    }
  }

  async pauseQueue(name: string): Promise<boolean> {
    try {
      this.validateQueueName(name);
      if (this.queues.has(name)) {
        const queue = this.queues.get(name);
        await queue?.pause();
        this.logger.info(`Queue ${name} paused successfully`);
        this.emitEvent("queuePaused", name);
        return true;
      } else {
        this.logger.warn(`Attempted to pause non-existent queue: ${name}`);
        return false;
      }
    } catch (err: any) {
      this.logger.error(`Failed to pause queue ${name}:`, err);
      this.emitEvent("queueError", name, err);
      throw err;
    }
  }

  async resumeQueue(name: string): Promise<boolean> {
    try {
      this.validateQueueName(name);
      if (this.queues.has(name)) {
        const queue = this.queues.get(name);
        await queue?.resume();
        this.logger.info(`Queue ${name} resumed successfully`);
        this.emitEvent("queueResumed", name);
        return true;
      } else {
        this.logger.warn(`Attempted to resume non-existent queue: ${name}`);
        return false;
      }
    } catch (err: any) {
      this.logger.error(`Failed to resume queue ${name}:`, err);
      this.emitEvent("queueError", name, err);
      throw err;
    }
  }

  async emptyQueueCompleted(name: string): Promise<boolean> {
    try {
      this.validateQueueName(name);
      if (this.queues.has(name)) {
        const queue = this.queues.get(name);
        await queue?.clean(0, 0, "completed");
        this.logger.info(`Completed jobs cleared from queue ${name}`);
        return true;
      } else {
        this.logger.warn(
          `Attempted to clear completed jobs from non-existent queue: ${name}`
        );
        return false;
      }
    } catch (err: any) {
      this.logger.error(
        `Failed to clear completed jobs from queue ${name}:`,
        err
      );
      this.emitEvent("queueError", name, err);
      throw err;
    }
  }

  async emptyQueueFailed(name: string): Promise<boolean> {
    try {
      this.validateQueueName(name);
      if (this.queues.has(name)) {
        const queue = this.queues.get(name);
        await queue?.clean(0, 0, "failed");
        this.logger.info(`Failed jobs cleared from queue ${name}`);
        return true;
      } else {
        this.logger.warn(
          `Attempted to clear failed jobs from non-existent queue: ${name}`
        );
        return false;
      }
    } catch (err: any) {
      this.logger.error(`Failed to clear failed jobs from queue ${name}:`, err);
      this.emitEvent("queueError", name, err);
      throw err;
    }
  }

  async emptyWaitingQueue(name: string): Promise<boolean> {
    try {
      this.validateQueueName(name);
      if (this.queues.has(name)) {
        const queue = this.queues.get(name);
        await queue?.clean(0, 0, "waiting");
        this.logger.info(`Waiting jobs cleared from queue ${name}`);
        return true;
      } else {
        this.logger.warn(
          `Attempted to clear waiting jobs from non-existent queue: ${name}`
        );
        return false;
      }
    } catch (err: any) {
      this.logger.error(
        `Failed to clear waiting jobs from queue ${name}:`,
        err
      );
      this.emitEvent("queueError", name, err);
      throw err;
    }
  }

  async closeQueue(name: string): Promise<boolean> {
    try {
      this.validateQueueName(name);
      if (this.queues.has(name)) {
        const queue = this.queues.get(name);
        await queue?.close();
        this.logger.info(`Queue ${name} closed successfully`);
        return true;
      } else {
        this.logger.warn(`Attempted to close non-existent queue: ${name}`);
        return false;
      }
    } catch (err: any) {
      this.logger.error(`Failed to close queue ${name}:`, err);
      this.emitEvent("queueError", name, err);
      throw err;
    }
  }

  async closeAllQueues(): Promise<void> {
    try {
      const closePromises = Array.from(this.queues.values()).map((queue) =>
        queue.close()
      );
      await Promise.all(closePromises);
      this.logger.info(`All ${this.queues.size} queues closed successfully`);
      this.emitEvent("allQueuesClosed");

      // Clear health check interval
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
      }
    } catch (err: any) {
      this.logger.error("Failed to close all queues:", err);
      throw err;
    }
  }

  async pauseAllQueues(): Promise<void> {
    try {
      const pausePromises = Array.from(this.queues.values()).map((queue) =>
        queue.pause()
      );
      await Promise.all(pausePromises);
      this.logger.info(`All ${this.queues.size} queues paused successfully`);
    } catch (err: any) {
      this.logger.error("Failed to pause all queues:", err);
      throw err;
    }
  }

  async resumeAllQueues(): Promise<void> {
    try {
      const resumePromises = Array.from(this.queues.values()).map((queue) =>
        queue.resume()
      );
      await Promise.all(resumePromises);
      this.logger.info(`All ${this.queues.size} queues resumed successfully`);
    } catch (err: any) {
      this.logger.error("Failed to resume all queues:", err);
      throw err;
    }
  }

  async drainQueue(name: string): Promise<boolean> {
    try {
      this.validateQueueName(name);
      if (this.queues.has(name)) {
        const queue = this.queues.get(name);
        await queue?.drain();
        this.logger.info(`Queue ${name} drained successfully`);
        return true;
      } else {
        this.logger.warn(`Attempted to drain non-existent queue: ${name}`);
        return false;
      }
    } catch (err: any) {
      this.logger.error(`Failed to drain queue ${name}:`, err);
      this.emitEvent("queueError", name, err);
      throw err;
    }
  }

  async getQueueStats(name: string): Promise<QueueStats | null> {
    try {
      this.validateQueueName(name);
      const queue = this.getQueue(name);
      if (queue) {
        const waiting = await queue.getWaiting();
        const active = await queue.getActive();
        const completed = await queue.getCompleted();
        const failed = await queue.getFailed();

        return {
          name,
          waiting: waiting.length,
          active: active.length,
          completed: completed.length,
          failed: failed.length,
        };
      }
      return null;
    } catch (err: any) {
      this.logger.error(`Failed to get stats for queue ${name}:`, err);
      this.emitEvent("queueError", name, err);
      throw err;
    }
  }

  getQueueCount(): number {
    return this.queues.size;
  }

  getQueueNames(): string[] {
    return Array.from(this.queues.keys());
  }

  // Advanced interface methods

  async getAllQueueStats(): Promise<QueueStats[]> {
    try {
      const statsPromises = this.getQueueNames().map((name) =>
        this.getQueueStats(name)
      );
      const results = await Promise.all(statsPromises);
      return results.filter((stats): stats is QueueStats => stats !== null);
    } catch (err: any) {
      this.logger.error("Failed to get all queue stats:", err);
      throw err;
    }
  }

  async emptyQueue(name: string): Promise<boolean> {
    try {
      this.validateQueueName(name);
      if (this.queues.has(name)) {
        const queue = this.queues.get(name);
        await Promise.all([
          queue?.clean(0, 0, "completed"),
          queue?.clean(0, 0, "failed"),
          queue?.clean(0, 0, "waiting"),
        ]);
        this.logger.info(`All jobs cleared from queue ${name}`);
        return true;
      } else {
        this.logger.warn(
          `Attempted to clear all jobs from non-existent queue: ${name}`
        );
        return false;
      }
    } catch (err: any) {
      this.logger.error(`Failed to clear all jobs from queue ${name}:`, err);
      this.emitEvent("queueError", name, err);
      throw err;
    }
  }

  async isQueuePaused(name: string): Promise<boolean> {
    try {
      this.validateQueueName(name);
      const queue = this.getQueue(name);
      if (queue) {
        return await queue.isPaused();
      }
      return false;
    } catch (err: any) {
      this.logger.error(`Failed to check if queue ${name} is paused:`, err);
      this.emitEvent("queueError", name, err);
      throw err;
    }
  }

  async getQueueHealth(name: string): Promise<{
    isConnected: boolean;
    isPaused: boolean;
    hasJobs: boolean;
    lastJobTimestamp?: Date;
  }> {
    try {
      this.validateQueueName(name);
      const queue = this.getQueue(name);

      if (!queue) {
        return {
          isConnected: false,
          isPaused: false,
          hasJobs: false,
        };
      }

      const [isPaused, waiting, active, completed] = await Promise.all([
        queue.isPaused(),
        queue.getWaiting(),
        queue.getActive(),
        queue.getCompleted(0, 0),
      ]);

      const hasJobs = waiting.length > 0 || active.length > 0;
      let lastJobTimestamp: Date | undefined;

      if (completed.length > 0) {
        const lastCompleted = completed[0];
        lastJobTimestamp = new Date(
          lastCompleted.finishedOn || lastCompleted.processedOn || 0
        );
      }

      return {
        isConnected: true,
        isPaused,
        hasJobs,
        lastJobTimestamp,
      };
    } catch (err: any) {
      this.logger.error(`Failed to get health for queue ${name}:`, err);
      this.emitEvent("queueError", name, err);
      return {
        isConnected: false,
        isPaused: false,
        hasJobs: false,
      };
    }
  }

  async pauseQueues(names: string[]): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();

    const pausePromises = names.map(async (name) => {
      try {
        const result = await this.pauseQueue(name);
        results.set(name, result);
      } catch (err) {
        results.set(name, false);
      }
    });

    await Promise.all(pausePromises);
    return results;
  }

  async resumeQueues(names: string[]): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();

    const resumePromises = names.map(async (name) => {
      try {
        const result = await this.resumeQueue(name);
        results.set(name, result);
      } catch (err) {
        results.set(name, false);
      }
    });

    await Promise.all(resumePromises);
    return results;
  }

  async gracefulShutdown(timeout: number = 30000): Promise<void> {
    try {
      this.logger.info("Starting graceful shutdown...");

      // First, pause all queues to prevent new jobs
      await this.pauseAllQueues();

      // Wait for active jobs to complete with timeout
      const shutdownPromise = this.closeAllQueues();
      const timeoutPromise = new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error("Shutdown timeout")), timeout)
      );

      await Promise.race([shutdownPromise, timeoutPromise]);

      this.logger.info("Graceful shutdown completed");
    } catch (err: any) {
      this.logger.error("Graceful shutdown failed:", err);
      // Force close as fallback
      await this.closeAllQueues();
      throw err;
    }
  }
}
