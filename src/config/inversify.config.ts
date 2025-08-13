import "reflect-metadata";
import { Container } from "inversify";
const container: Container = new Container();

// modules imports
import { sharedModule } from "@shared/di-binding/shard.module";
import { queueModule } from "@queues/index";

// Load the modules of each module and add it to the load container
container.load(sharedModule, queueModule);

export { container };
