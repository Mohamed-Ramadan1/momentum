import { inject, injectable } from "inversify";
import { verify, JwtPayload } from "jsonwebtoken";
import { IJWTConfig, IErrorUtils, ITokenValidator } from "../../interfaces";
import { TYPES } from "../../const/containerTypes";

type TokenType = "access" | "refresh";

/**
 * Service for validating JSON Web Tokens and extracting their payloads
 */
@injectable()
export class TokenValidator implements ITokenValidator {
  /**
   * Creates an instance of TokenValidator
   * @param jwtConfig - Configuration for JWT secrets
   * @param errorUtils - Utility for handling application errors
   */
  constructor(
    @inject(TYPES.JWTConfig) private readonly jwtConfig: IJWTConfig,
    @inject(TYPES.ErrorUtils) private readonly errorUtils: IErrorUtils
  ) {}

  /**
   * Validates a JSON Web Token and checks its expiration
   * @param token - The JWT string to validate (with or without "Bearer " prefix)
   * @param type - The type of token ("access" or "refresh")
   * @returns {boolean} True if the token is valid and not expired
   * @throws Will throw an error via errorUtils if validation fails
   */
  validate(token: string, type: TokenType): boolean {
    try {
      const tokenString = this.extractToken(token);
      const payload = this.decodeToken(tokenString, type);

      if (this.isExpired(payload)) {
        this.errorUtils.handleAppError(`Token is expired`, 401);
      }

      return true;
    } catch (error: any) {
      this.errorUtils.handleAppError(
        `Error validating ${type} token: ${error.message}`,
        400
      );
    }
  }

  /**
   * Extracts the payload from a JSON Web Token
   * @param token - The JWT string to decode (with or without "Bearer " prefix)
   * @param type - The type of token ("access" or "refresh")
   * @returns {JwtPayload} The decoded JWT payload
   * @throws Will throw an error via errorUtils if decoding fails
   */
  getPayload(token: string, type: TokenType): JwtPayload {
    return this.decodeToken(this.extractToken(token), type);
  }

  /**
   * Checks if a token's payload is expired
   * @param payload - The decoded JWT payload
   * @returns {boolean} True if the token is expired or has no expiration claim
   */
  private isExpired(payload: JwtPayload): boolean {
    if (!payload?.exp) return true; // Missing exp means invalid

    return Date.now() >= payload.exp * 1000;
  }

  /**
   * Removes the "Bearer " prefix from a token string
   * @param token - The token string to process
   * @returns {string} The token without the "Bearer " prefix
   */
  private extractToken(token: string): string {
    return token.startsWith("Bearer ") ? token.slice(7) : token;
  }

  /**
   * Decodes and verifies a JSON Web Token
   * @param token - The JWT string to decode
   * @param type - The type of token ("access" or "refresh")
   * @returns {JwtPayload} The decoded JWT payload
   * @throws Will throw an error via errorUtils if decoding/verification fails
   */
  private decodeToken(token: string, type: TokenType): JwtPayload {
    try {
      return verify(token, this.getSecret(type)) as JwtPayload;
    } catch (error: any) {
      this.errorUtils.handleAppError(
        `Invalid ${type} token: ${error.message}`,
        400
      );
    }
  }

  /**
   * Retrieves the appropriate secret for the token type
   * @param type - The type of token ("access" or "refresh")
   * @returns {string} The secret key for verifying the token
   */
  private getSecret(type: TokenType): string {
    return type === "access"
      ? this.jwtConfig.accessTokenSecret
      : this.jwtConfig.refreshTokenSecret;
  }
}
