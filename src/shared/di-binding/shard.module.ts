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
} from "../interfaces";

// utils class imports
import {
  JWTConfig,
  JWTService,
  TokenGenerator,
  TokenRevocation,
  TokenValidator,
  ErrorUtils,
} from "../utils";

export const sharedModule = new ContainerModuleBuilder()
  .addSingleton<IJWTConfig>(TYPES.JWTConfig, JWTConfig)
  .addSingleton<IJWTService>(TYPES.JWTService, JWTService)
  .addSingleton<ITokenGenerator>(TYPES.TokenGenerator, TokenGenerator)
  .addSingleton<ITokenRevocation>(TYPES.TokenRevocation, TokenRevocation)
  .addSingleton<ITokenValidator>(TYPES.TokenValidator, TokenValidator)
  .addSingleton<IErrorUtils>(TYPES.ErrorUtils, ErrorUtils)
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
