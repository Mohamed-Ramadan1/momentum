import { JwtPayload } from "jsonwebtoken";

type TokenType = "access" | "refresh";

/**
 * Interface for token validation and payload extraction
 */
export interface ITokenValidator {
  /**
   * Validates a JSON Web Token
   * @param token - The JWT string to validate
   * @param type - The type of token ("access" or "refresh")
   * @returns {boolean} True if the token is valid, false otherwise
   */
  validate(token: string, type: TokenType): boolean;

  /**
   * Extracts the payload from a JSON Web Token
   * @param token - The JWT string to decode
   * @param type - The type of token ("access" or "refresh")
   * @returns {JwtPayload} The decoded JWT payload
   */
  getPayload(token: string, type: TokenType): JwtPayload;
}
