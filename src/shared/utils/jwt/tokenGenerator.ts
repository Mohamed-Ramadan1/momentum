// package imports
import { inject, injectable } from "inversify";
import { sign, SignOptions, JwtPayload } from "jsonwebtoken";

// interfaces imports
import {
  ITokenGenerator,
  IJWTConfig,
  ITokenPair,
} from "@shared/interfaces/index";

// shared imports
import { AppError, TYPES } from "@shared/index";

/**
 * A service class for generating JSON Web Tokens (JWT) for authentication.
 * Implements the ITokenGenerator interface.
 */
@injectable()
export class TokenGenerator implements ITokenGenerator {
  /**
   * Creates an instance of TokenGenerator.
   * @param jwtConfig - The configuration object for JWT settings.
   */
  constructor(@inject(TYPES.JWTConfig) private jwtConfig: IJWTConfig) {}

  /**
   * Generates a JWT token with the specified payload, secret, and signing options.
   * @param payload - The payload to include in the JWT.
   * @param secret - The secret key used to sign the token.
   * @param signOptions - The signing options for the token, such as expiration and issuer.
   * @returns The generated JWT token as a string.
   */
  private generateJwtToken(
    payload: JwtPayload,
    secret: string,
    signOptions: SignOptions
  ): string {
    return sign(payload, secret, signOptions);
  }

  /**
   * Generates a pair of access and refresh tokens for a given user.
   * @param userId - The unique identifier of the user.
   * @returns An object containing the access token and refresh token.
   * @throws AppError if token generation fails or if the userId is invalid.
   */
  generateTokenPair(userId: string): ITokenPair {
    console.log(
      this.jwtConfig.accessTokenExpiration,
      this.jwtConfig.refreshTokenExpiration
    );
    try {
      if (!userId || typeof userId !== "string") {
        throw new Error("Invalid userId");
      }

      const accessToken: string = this.generateJwtToken(
        { userId, type: "access" },
        this.jwtConfig.accessTokenSecret,
        {
          expiresIn: this.jwtConfig.accessTokenExpiration,
          issuer: "momentum-app",
          subject: userId,
        }
      );

      const refreshToken: string = this.generateJwtToken(
        { userId, type: "refresh" },
        this.jwtConfig.refreshTokenSecret,
        {
          expiresIn: this.jwtConfig.refreshTokenExpiration,
          issuer: "momentum-app",
          subject: userId,
        }
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (err: any) {
      console.error("Error generating token pair:", err.message);
      throw new AppError("Failed to generate token pair", 500);
    }
  }
}
