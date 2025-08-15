import { ContainerModuleBuilder } from "@shared/index";
// shard imports
import { TYPES } from "@shared/index";

import { QueueFactory } from "@queues/factories/queueFactory";

export const queueModule = new ContainerModuleBuilder()
  .addSingleton<QueueFactory>(TYPES.QueueFactory, QueueFactory)

  .build();
