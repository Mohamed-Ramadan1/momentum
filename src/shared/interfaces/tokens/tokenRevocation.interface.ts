/**
 * Interface for token revocation service.
 * Defines methods for managing token revocation operations.
 */
export interface ITokenRevocation {
  /**
   * Revokes a specific token for a given user.
   * @param userId - The unique identifier of the user.
   * @param token - The token to be revoked.
   * @returns A promise that resolves when the token is revoked.
   */
  revokeToken(userId: string, token: string): Promise<void>;

  /**
   * Checks if a specific token is revoked for a given user.
   * @param userId - The unique identifier of the user.
   * @param token - The token to check.
   * @returns A promise that resolves to true if the token is revoked, false otherwise.
   */
  isTokenRevoked(userId: string, token: string): Promise<boolean>;

  /**
   * Lists all revoked tokens for a given user.
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves to an array of revoked token strings.
   */
  listRevokedTokens(userId: string): Promise<string[]>;

  /**
   * Performs a health check on the token revocation service.
   * @returns A promise that resolves to true if the service is healthy, false otherwise.
   */
  healthCheck(): Promise<boolean>;
}
