/**
 * Interface for managing token revocation operations in Redis.
 */
export interface IRedisTokenManager {
  /**
   * Revokes a specific token for a given user in Redis.
   * @param userId - The unique identifier of the user.
   * @param token - The token to be revoked.
   * @param expiresInSeconds - Optional expiration time for the revoked token in seconds.
   * @returns A promise that resolves when the token is revoked.
   */
  revokeToken(
    userId: string,
    token: string,
    expiresInSeconds?: number
  ): Promise<void>;

  /**
   * Checks if a specific token is revoked for a given user in Redis.
   * @param userId - The unique identifier of the user.
   * @param token - The token to check.
   * @returns A promise that resolves to true if the token is revoked, false otherwise.
   */
  isTokenRevoked(userId: string, token: string): Promise<boolean>;

  /**
   * Lists all revoked tokens for a given user in Redis.
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves to an array of revoked token strings.
   */
  listRevokedTokens(userId: string): Promise<string[]>;

  /**
   * Performs a health check on the Redis service.
   * @returns A promise that resolves to true if the Redis service is healthy, false otherwise.
   */
  healthCheck(): Promise<boolean>;
}
