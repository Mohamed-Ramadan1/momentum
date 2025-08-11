import { Queue } from "bullmq";

export class QueueFactory {
  private static queues: Map<string, any> = new Map();

  public static createQueue(name: string): Queue {
    return new Queue(name);
  }
}
