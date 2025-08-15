import { ContainerModuleBuilder } from "@shared/index";
// shard imports
import { TYPES } from "@shared/index";

// interfaces imports
import { IAdvancedQueueFactory } from "../interfaces/index";
import { QueueFactory } from "@queues/factories/queueFactory";

export const queueModule = new ContainerModuleBuilder()
  .addSingleton<IAdvancedQueueFactory>(TYPES.QueueFactory, QueueFactory)

  .build();
