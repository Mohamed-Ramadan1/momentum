import "reflect-metadata";
import { Container } from "inversify";

const container: Container = new Container();

// modules imports
import { sharedModule } from "@shared/di-binding/shard.module";
import { queueModule } from "@queues/index";
import { TYPES } from "@shared/index";

// Load modules
container.load(sharedModule, queueModule);

console.log("🧪 Testing all services...");

// Test all your services
const servicesToTest = [
  { name: "JWTConfig", symbol: TYPES.JWTConfig },
  { name: "JWTService", symbol: TYPES.JWTService },
  { name: "TokenGenerator", symbol: TYPES.TokenGenerator },
  { name: "TokenRevocation", symbol: TYPES.TokenRevocation },
  { name: "TokenValidator", symbol: TYPES.TokenValidator },
  { name: "ErrorUtils", symbol: TYPES.ErrorUtils },
  { name: "RedisTokenManager", symbol: TYPES.RedisTokenManager },
  { name: "EmailTransporter", symbol: TYPES.EmailTransporter },
  { name: "LoggerFactory", symbol: TYPES.LoggerFactory },
];

servicesToTest.forEach(({ name, symbol }) => {
  try {
    const service = container.get<any>(symbol);
    console.log(`✅ ${name}:`, service.constructor.name);
  } catch (error: any) {
    console.error(`❌ ${name} failed:`, error.message);
  }
});

console.log("🎉 Container is working perfectly!");

export { container };
