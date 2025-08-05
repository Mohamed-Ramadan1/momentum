// package imports
import { inject, injectable } from "inversify";
import { sign, SignOptions, JwtPayload } from "jsonwebtoken";

// interfaces imports
import { ITokenGenerator, IJWTConfig, ITokenPair } from "@shared/interfaces";

// shard imports
import { AppError, TYPES } from "@shared/index";

@injectable()
export class TokenGenerator implements ITokenGenerator {
  constructor(@inject(TYPES.JWTConfig) private jwtConfig: IJWTConfig) {}

  private generateJwtToken(
    payload: JwtPayload,
    secret: string,
    signOptions: SignOptions
  ): string {
    return sign(payload, secret, signOptions);
  }

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
