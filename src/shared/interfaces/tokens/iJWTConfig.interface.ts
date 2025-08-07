import ms from "ms";

/**
 * Interface defining the configuration for JSON Web Token (JWT) generation.
 */
export interface IJWTConfig {
  /**
   * The secret key used to sign access tokens.
   */
  accessTokenSecret: string;

  /**
   * The secret key used to sign refresh tokens.
   */
  refreshTokenSecret: string;

  /**
   * The expiration time for access tokens, specified in a format compatible with the 'ms' library.
   */
  accessTokenExpiration: ms.StringValue;

  /**
   * The expiration time for refresh tokens, specified in a format compatible with the 'ms' library.
   */
  refreshTokenExpiration: ms.StringValue;

  /**
   * The issuer of the JWT tokens.
   */
  issuer: string;
}
