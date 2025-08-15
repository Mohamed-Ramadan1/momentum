export interface GenerateQueueData {
  queueName: string;
  attempts?: number;
  removeOnComplete?: number;
  removeOnFail?: number;
  backoff?: {
    type: "exponential" | "fixed";
    delay: number;
  };
}
