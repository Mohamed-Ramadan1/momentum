/**
 * Interface defining the structure of a token pair.
 */
export interface ITokenPair {
  /**
   * The access token used for authentication.
   */
  accessToken: string;

  /**
   * The refresh token used to obtain a new access token.
   */
  refreshToken: string;
}

/**
 * Interface for a token generator service.
 * Defines methods for generating token pairs.
 */
export interface ITokenGenerator {
  /**
   * Generates a pair of access and refresh tokens for a given user.
   * @param userId - The unique identifier of the user.
   * @returns An object containing the access token and refresh token.
   */
  generateTokenPair(userId: string): ITokenPair;
}
