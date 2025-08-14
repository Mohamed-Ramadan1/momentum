export interface QueueConfig {
  connection: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  };
  prefix?: string;
  defaultJobOptions?: {
    attempts?: number;
    removeOnComplete?: number;
    removeOnFail?: number;
    backoff?: {
      type: "exponential" | "fixed";
      delay: number;
    };
  };
  settings?: {
    stalledInterval?: number;
    maxStalledCount?: number;
    retryProcessDelay?: number;
  };
}

// Usage with defaults
