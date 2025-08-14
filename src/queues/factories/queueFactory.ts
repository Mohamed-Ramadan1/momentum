//packages imports
import { injectable } from "inversify";
import { Queue } from "bullmq";

// logging imports
import {} from "@shared/logs/index";

@injectable()
export class QueueFactory {
  private queues: Map<string, Queue> = new Map();

  public createQueue() {}

  public getQueue(name: string): Queue | undefined {
    return undefined;
  }

  public getAllQueues(): Queue[] {
    return Array.from(this.queues.values());
  }

  public deleteQueue(name: string): void {}
}
