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

export const sharedModule = new ContainerModuleBuilder()
  .addSingleton<IJWTConfig>(TYPES.JWTConfig, JWTConfig)
  .addSingleton<IJWTService>(TYPES.JWTService, JWTService)
  .addSingleton<ITokenGenerator>(TYPES.TokenGenerator, TokenGenerator)
  .addSingleton<ITokenRevocation>(TYPES.TokenRevocation, TokenRevocation)
  .addSingleton<ITokenValidator>(TYPES.TokenValidator, TokenValidator)
  .addSingleton<IErrorUtils>(TYPES.ErrorUtils, ErrorUtils)
  .addSingleton<IRedisTokenManager>(TYPES.RedisTokenManager, RedisTokenManager)
  .addSingleton<IEmailTransporter>(TYPES.EmailTransporter, EmailTransporter)
  .addSingleton<LoggerFactory>(TYPES.LoggerFactory, LoggerFactory)
  .build();
//////////////////////////////////////////////////
// OLD Virsion - For Reference Only
//////////////////////////////////////////////////
// const sharedModule = new ContainerModule(
//   (options: ContainerModuleLoadOptions) => {
//     options.bind<IJWTConfig>(TYPES.JWTConfig).to(JWTConfig).inSingletonScope();
//     options
//       .bind<IJWTService>(TYPES.JWTService)
//       .to(JWTService)
//       .inSingletonScope();
//     options
//       .bind<ITokenGenerator>(TYPES.TokenGenerator)
//       .to(TokenGenerator)
//       .inSingletonScope();
//     options
//       .bind<ITokenRevocation>(TYPES.TokenRevocation)
//       .to(TokenRevocation)
//       .inSingletonScope();
//     options
//       .bind<ITokenValidator>(TYPES.TokenValidator)
//       .to(TokenValidator)
//       .inSingletonScope();
//   }
// );

// export { sharedModule };
