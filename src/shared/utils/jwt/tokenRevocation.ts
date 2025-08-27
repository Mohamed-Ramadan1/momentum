// packages imports
import { inject, injectable } from "inversify";

// interfaces imports
import { ITokenRevocation, IRedisTokenManager } from "@shared/interfaces";

// types imports
import { TYPES } from "../../const/containerTypes";

/**
 * A service class for managing token revocation operations.
 * Implements the ITokenRevocation interface and interacts with Redis for token management.
 */
@injectable()
export class TokenRevocation implements ITokenRevocation {
  /**
   * Creates an instance of TokenRevocation.
   * @param redisTokenManager - The Redis token manager for handling token operations.
   */
  constructor(
    @inject(TYPES.RedisTokenManager)
    private redisTokenManager: IRedisTokenManager
  ) {}

  /**
   * Revokes a specific token for a given user.
   * @param userId - The unique identifier of the user.
   * @param token - The token to be revoked.
   * @returns A promise that resolves when the token is revoked.
   */
  public async revokeToken(userId: string, token: string): Promise<void> {
    await this.redisTokenManager.revokeToken(userId, token);
  }

  /**
   * Checks if a specific token is revoked for a given user.
   * @param userId - The unique identifier of the user.
   * @param token - The token to check.
   * @returns A promise that resolves to true if the token is revoked, false otherwise.
   */
  public async isTokenRevoked(userId: string, token: string): Promise<boolean> {
    return await this.redisTokenManager.isTokenRevoked(userId, token);
  }

  /**
   * Lists all revoked tokens for a given user.
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves to an array of revoked token strings.
   */
  public async listRevokedTokens(userId: string): Promise<string[]> {
    return await this.redisTokenManager.listRevokedTokens(userId);
  }

  /**
   * Performs a health check on the Redis token manager.
   * @returns A promise that resolves to true if the Redis service is healthy, false otherwise.
   */
  public async healthCheck(): Promise<boolean> {
    return await this.redisTokenManager.healthCheck();
  }
}
