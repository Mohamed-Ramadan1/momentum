// packages imports
import { inject, injectable } from "inversify";
import { Worker, Queue } from "bullmq";
import { TYPES } from "@shared/index";

import { IAdvancedQueueFactory } from "../interfaces/index";

@injectable()
export class WorkerFactory {
  constructor(
    @inject(TYPES.QueueFactory) private queryInstance: IAdvancedQueueFactory
  ) {}

  // public createWorker(): Worker {}
}
/*

create queue 
add worker 
worker need to processor function to do somthinkg 


when i will need a new queue  and assign processor and assign 


have multable types of jobs at the same queue how they will be assign to the workeer adn how the workr gon know wich processro suppose to use to handel thsi 



now to create the email queue 

we will have queues folder inside of it have emailQueueClass will inject the email processor / queueFactory class / workerFactory class

and what is is the next step
*/
