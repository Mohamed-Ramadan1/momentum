import "reflect-metadata";
import { Container } from "inversify";
const container: Container = new Container();
import { sharedModule } from "@shared/di-binding/shard.module";

// Load the modules of each module and add it to the load container

container.load(sharedModule);
console.log(sharedModule);
export { container };
