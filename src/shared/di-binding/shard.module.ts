import { ContainerModuleBuilder } from "@shared/index";
// shard imports
import { TYPES } from "@shared/index";

// interfaces imports
import {
  IJWTConfig,
  IJWTService,
  ITokenGenerator,
  ITokenRevocation,
  ITokenValidator,
  IErrorUtils,
  IRedisTokenManager,
  IEmailTransporter,
  ILoggerFactory,
} from "../interfaces";

// utils class imports
import {
  JWTConfig,
  JWTService,
  TokenGenerator,
  TokenRevocation,
  TokenValidator,
  ErrorUtils,
  RedisTokenManager,
  EmailTransporter,
} from "../utils";

import { LoggerFactory } from "../logs/loggerFactory";

// ADD THESE DEBUG LOGS TO SEE WHAT'S HAPPENING:

console.log("🔍 DEBUG: Checking imports...");
console.log("TYPES object:", TYPES);
console.log("ContainerModuleBuilder:", ContainerModuleBuilder);

// Check if classes are properly imported
console.log("Classes:");
console.log("- JWTConfig:", JWTConfig);
console.log("- JWTService:", JWTService);
console.log("- TokenGenerator:", TokenGenerator);
console.log("- TokenRevocation:", TokenRevocation);
console.log("- TokenValidator:", TokenValidator);
console.log("- ErrorUtils:", ErrorUtils);
console.log("- RedisTokenManager:", RedisTokenManager);
console.log("- EmailTransporter:", EmailTransporter);
console.log("- LoggerFactory:", LoggerFactory);

console.log("🏗️  Creating shared module...");

export const sharedModule = new ContainerModuleBuilder()
  .addSingleton<IJWTConfig>(TYPES.JWTConfig, JWTConfig)
  .addSingleton<IJWTService>(TYPES.JWTService, JWTService)
  .addSingleton<ITokenGenerator>(TYPES.TokenGenerator, TokenGenerator)
  .addSingleton<ITokenRevocation>(TYPES.TokenRevocation, TokenRevocation)
  .addSingleton<ITokenValidator>(TYPES.TokenValidator, TokenValidator)
  .addSingleton<IErrorUtils>(TYPES.ErrorUtils, ErrorUtils)
  .addSingleton<IRedisTokenManager>(TYPES.RedisTokenManager, RedisTokenManager)
  .addSingleton<IEmailTransporter>(TYPES.EmailTransporter, EmailTransporter)
  .addSingleton<ILoggerFactory>(TYPES.LoggerFactory, LoggerFactory)
  .build();

console.log("✅ Shared module created:", sharedModule);
