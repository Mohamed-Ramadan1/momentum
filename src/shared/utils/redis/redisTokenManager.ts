// services/RedisTokenManager.ts
import { IRedisTokenManager } from "../../interfaces/index";
import type { Redis } from "ioredis";
import client from "@config/redis.config";
import { AppError } from "../appError";

/**
 * A service class for managing token revocation operations in Redis.
 * Implements the IRedisTokenManager interface.
 */
export class RedisTokenManager implements IRedisTokenManager {
  /**
   * The Redis client instance used for token operations.
   */
  private redis: Redis;

  /**
   * Creates an instance of RedisTokenManager.
   * @param redisClient - The Redis client instance (defaults to the configured client).
   */
  constructor(redisClient: Redis = client) {
    this.redis = redisClient;
  }

  /**
   * Generates a Redis key for storing revoked tokens for a specific user.
   * @param userId - The unique identifier of the user.
   * @returns The Redis key in the format `revokedTokens:${userId}`.
   */
  private getUserKey(userId: string): string {
    return `revokedTokens:${userId}`;
  }

  /**
   * Revokes a specific token for a given user by adding it to a Redis set.
   * @param userId - The unique identifier of the user.
   * @param token - The token to be revoked.
   * @param expiresInSeconds - Optional expiration time for the Redis key in seconds (defaults to 3600).
   * @returns A promise that resolves when the token is revoked.
   * @throws AppError if the token revocation fails.
   */
  async revokeToken(
    userId: string,
    token: string,
    expiresInSeconds = 3600
  ): Promise<void> {
    try {
      const key = this.getUserKey(userId);
      await this.redis.sadd(key, token);
      await this.redis.expire(key, expiresInSeconds); // ensure the key expires eventually
    } catch (error: any) {
      throw new AppError(`Failed to revoke token: ${error.message}`, 500);
    }
  }

  /**
   * Checks if a specific token is revoked for a given user.
   * @param userId - The unique identifier of the user.
   * @param token - The token to check.
   * @returns A promise that resolves to true if the token is revoked, false otherwise.
   * @throws AppError if the check operation fails.
   */
  async isTokenRevoked(userId: string, token: string): Promise<boolean> {
    try {
      const key = this.getUserKey(userId);
      return (await this.redis.sismember(key, token)) === 1;
    } catch (error: any) {
      throw new AppError(
        `Failed to check token revocation: ${error.message}`,
        500
      );
    }
  }

  /**
   * Lists all revoked tokens for a given user.
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves to an array of revoked token strings.
   * @throws AppError if the list operation fails.
   */
  async listRevokedTokens(userId: string): Promise<string[]> {
    try {
      const key = this.getUserKey(userId);
      return await this.redis.smembers(key);
    } catch (error: any) {
      throw new AppError(
        `Failed to list revoked tokens: ${error.message}`,
        500
      );
    }
  }

  /**
   * Performs a health check on the Redis service.
   * @returns A promise that resolves to true if the Redis service is healthy, false otherwise.
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.redis.ping();
      if (this.redis.status !== "ready") {
        throw new Error("Redis is not ready");
      }
      return true;
    } catch (error: any) {
      console.error("Redis health check failed:", error);
      return false;
    }
  }
}
