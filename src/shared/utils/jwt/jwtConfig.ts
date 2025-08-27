import ms from "ms";
import { IJWTConfig } from "../../interfaces";
import dotenv from "dotenv";

dotenv.config();

/**
 * A class that implements the IJWTConfig interface for JWT configuration.
 * Loads JWT-related configuration from environment variables.
 */
export class JWTConfig implements IJWTConfig {
  /**
   * The secret key used to sign access tokens.
   */
  public readonly accessTokenSecret: string;

  /**
   * The secret key used to sign refresh tokens.
   */
  public readonly refreshTokenSecret: string;

  /**
   * The expiration time for access tokens, specified in a format compatible with the 'ms' library.
   */
  public readonly accessTokenExpiration: ms.StringValue;

  /**
   * The expiration time for refresh tokens, specified in a format compatible with the 'ms' library.
   */
  public readonly refreshTokenExpiration: ms.StringValue;

  /**
   * The issuer of the JWT tokens.
   */
  public readonly issuer: string;

  /**
   * Creates an instance of JWTConfig and initializes it with values from environment variables.
   * @throws Error if required environment variables are not set.
   */
  constructor() {
    this.accessTokenSecret = this.getRequiredEnvVar("JWT_ACCESS_TOKEN_SECRET");
    this.refreshTokenSecret = this.getRequiredEnvVar(
      "JWT_REFRESH_TOKEN_SECRET"
    );
    this.accessTokenExpiration = (process.env.JWT_ACCESS_TOKEN_EXPIRATION ||
      "1h") as ms.StringValue;
    this.refreshTokenExpiration = (process.env.JWT_REFRESH_TOKEN_EXPIRATION ||
      "7d") as ms.StringValue;
    this.issuer = process.env.JWT_ISSUER || "momentum-app";
  }

  /**
   * Retrieves a required environment variable and throws an error if it is not set.
   * @param name - The name of the environment variable.
   * @returns The value of the environment variable.
   * @throws Error if the environment variable is not set.
   */
  private getRequiredEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Required environment variable ${name} is not set`);
    }
    return value;
  }
}
