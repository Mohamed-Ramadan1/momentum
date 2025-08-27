// export interface GenerateQueueData {
//   queueName: string;
//   attempts?: number;
//   removeOnComplete?: number;
//   removeOnFail?: number;
//   backoff?: {
//     type: "exponential" | "fixed";
//     delay: number;
//   };
// }
import { Queue } from "bullmq";

// Base interface for queue creation data
export interface GenerateQueueData {
  queueName: string;
  attempts?: number;
  removeOnComplete?: number;
  removeOnFail?: number;
  backoff?: {
    type?: "fixed" | "exponential";
    delay?: number;
  };
}

// Configuration interface for QueueFactory
export interface QueueFactoryConfig {
  defaultPrefix?: string;
  defaultAttempts?: number;
  defaultRemoveOnComplete?: number;
  defaultRemoveOnFail?: number;
}

// Queue statistics interface
export interface QueueStats {
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}

// Main QueueFactory interface
export interface IQueueFactory {
  /**
   * Creates a new queue with the specified configuration
   * @param data Queue configuration data
   * @returns Promise resolving to the created Queue instance
   * @throws Error if queue creation fails
   */
  createQueue(data: GenerateQueueData): Promise<Queue>;

  /**
   * Retrieves an existing queue by name
   * @param name Queue name
   * @returns Queue instance if found, undefined otherwise
   */
  getQueue(name: string): Queue | undefined;

  /**
   * Returns all active queues
   * @returns Array of all Queue instances
   */
  listQueues(): Queue[];

  /**
   * Checks if a queue exists
   * @param name Queue name
   * @returns True if queue exists, false otherwise
   */
  queueExists(name: string): boolean;

  /**
   * Deletes a queue and closes its connection
   * @param name Queue name
   * @returns Promise resolving to true if successful, false if queue doesn't exist
   * @throws Error if deletion fails
   */
  deleteQueue(name: string): Promise<boolean>;

  /**
   * Pauses a queue (stops processing jobs)
   * @param name Queue name
   * @returns Promise resolving to true if successful, false if queue doesn't exist
   * @throws Error if pause operation fails
   */
  pauseQueue(name: string): Promise<boolean>;

  /**
   * Resumes a paused queue
   * @param name Queue name
   * @returns Promise resolving to true if successful, false if queue doesn't exist
   * @throws Error if resume operation fails
   */
  resumeQueue(name: string): Promise<boolean>;

  /**
   * Clears all completed jobs from a queue
   * @param name Queue name
   * @returns Promise resolving to true if successful, false if queue doesn't exist
   * @throws Error if cleanup fails
   */
  emptyQueueCompleted(name: string): Promise<boolean>;

  /**
   * Clears all failed jobs from a queue
   * @param name Queue name
   * @returns Promise resolving to true if successful, false if queue doesn't exist
   * @throws Error if cleanup fails
   */
  emptyQueueFailed(name: string): Promise<boolean>;

  /**
   * Clears all waiting jobs from a queue
   * @param name Queue name
   * @returns Promise resolving to true if successful, false if queue doesn't exist
   * @throws Error if cleanup fails
   */
  emptyWaitingQueue(name: string): Promise<boolean>;

  /**
   * Closes a queue connection
   * @param name Queue name
   * @returns Promise resolving to true if successful, false if queue doesn't exist
   * @throws Error if close operation fails
   */
  closeQueue(name: string): Promise<boolean>;

  /**
   * Closes all queue connections
   * @returns Promise that resolves when all queues are closed
   * @throws Error if any queue fails to close
   */
  closeAllQueues(): Promise<void>;

  /**
   * Pauses all active queues
   * @returns Promise that resolves when all queues are paused
   * @throws Error if any queue fails to pause
   */
  pauseAllQueues(): Promise<void>;

  /**
   * Resumes all paused queues
   * @returns Promise that resolves when all queues are resumed
   * @throws Error if any queue fails to resume
   */
  resumeAllQueues(): Promise<void>;

  /**
   * Drains a queue (removes all jobs)
   * @param name Queue name
   * @returns Promise resolving to true if successful, false if queue doesn't exist
   * @throws Error if drain operation fails
   */
  drainQueue(name: string): Promise<boolean>;

  /**
   * Gets statistics for a specific queue
   * @param name Queue name
   * @returns Promise resolving to queue statistics or null if queue doesn't exist
   * @throws Error if stats retrieval fails
   */
  getQueueStats(name: string): Promise<QueueStats | null>;

  /**
   * Gets the total number of active queues
   * @returns Number of active queues
   */
  getQueueCount(): number;

  /**
   * Gets names of all active queues
   * @returns Array of queue names
   */
  getQueueNames(): string[];
}

// Extended interface for additional queue management features
export interface IAdvancedQueueFactory extends IQueueFactory {
  /**
   * Gets statistics for all active queues
   * @returns Promise resolving to array of queue statistics
   */
  getAllQueueStats(): Promise<QueueStats[]>;

  /**
   * Clears all jobs (completed, failed, waiting) from a queue
   * @param name Queue name
   * @returns Promise resolving to true if successful, false if queue doesn't exist
   */
  emptyQueue(name: string): Promise<boolean>;

  /**
   * Checks if a queue is paused
   * @param name Queue name
   * @returns Promise resolving to true if paused, false otherwise
   */
  isQueuePaused(name: string): Promise<boolean>;

  /**
   * Gets health status of a queue
   * @param name Queue name
   * @returns Promise resolving to health status object
   */
  getQueueHealth(name: string): Promise<{
    isConnected: boolean;
    isPaused: boolean;
    hasJobs: boolean;
    lastJobTimestamp?: Date;
  }>;

  /**
   * Bulk operation to pause multiple queues
   * @param names Array of queue names
   * @returns Promise resolving to results map
   */
  pauseQueues(names: string[]): Promise<Map<string, boolean>>;

  /**
   * Bulk operation to resume multiple queues
   * @param names Array of queue names
   * @returns Promise resolving to results map
   */
  resumeQueues(names: string[]): Promise<Map<string, boolean>>;

  /**
   * Gracefully shutdown all queues with timeout
   * @param timeout Timeout in milliseconds
   * @returns Promise that resolves when shutdown is complete
   */
  gracefulShutdown(timeout?: number): Promise<void>;
}

// Event interface for queue factory events
export interface QueueFactoryEvents {
  queueCreated: (queueName: string) => void;
  queueDeleted: (queueName: string) => void;
  queuePaused: (queueName: string) => void;
  queueResumed: (queueName: string) => void;
  queueError: (queueName: string, error: Error) => void;
  allQueuesClosed: () => void;
}

// Factory options for creating QueueFactory instances
export interface QueueFactoryOptions extends QueueFactoryConfig {
  enableEvents?: boolean;
  healthCheckInterval?: number;
  maxConcurrentQueues?: number;
}
