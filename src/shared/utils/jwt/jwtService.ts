// packages imports
import { inject, injectable } from "inversify";

// interfaces imports

import {
  IJWTService,
  IJWTConfig,
  ITokenRevocation,
  ITokenGenerator,
  ITokenValidator,
  ITokenPair,
} from "@shared/interfaces/index";

import { TYPES } from "../../const/containerTypes";

@injectable()
export class JWTService implements IJWTService {
  constructor(
    @inject(TYPES.JWTConfig) private jwtConfig: IJWTConfig,
    @inject(TYPES.TokenGenerator) private tokenGenerator: ITokenGenerator,
    @inject(TYPES.TokenValidator) private tokenValidator: ITokenValidator,
    @inject(TYPES.TokenRevocation) private tokenRevocation: ITokenRevocation
  ) {}

  public async healthCheck(): Promise<boolean> {
    return await this.tokenRevocation.healthCheck();
  }
}
