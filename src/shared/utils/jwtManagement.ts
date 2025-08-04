import { Jwt, sign, SignOptions, JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// interfaces imports
import { IJWTManagement, ITokenPair } from "../interfaces";
import ms from "ms";

export class JWTManagement implements IJWTManagement {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiration: string | number;
  private readonly refreshTokenExpiration: string | number;

  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET || "";
    this.refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET || "";
    this.accessTokenExpiration =
      process.env.JWT_ACCESS_TOKEN_EXPIRATION || ("1h" as ms.StringValue);
    this.refreshTokenExpiration =
      process.env.JWT_REFRESH_TOKEN_EXPIRATION || ("7d" as ms.StringValue);
  }

  decodeToken(token: string): Jwt | null {
    return null;
  }

  private generateJwtToken(
    payload: JwtPayload,
    secret: string,
    signOptions: SignOptions
  ): string {
    return sign(payload, secret, signOptions);
  }

  generateTokenPair(userId: string): ITokenPair {
    console.log(this.accessTokenExpiration, this.refreshTokenExpiration);
    try {
      if (!userId || typeof userId !== "string") {
        throw new Error("Invalid userId");
      }

      const accessToken: string = this.generateJwtToken(
        { userId, type: "access" },
        this.accessTokenSecret,
        {
          expiresIn: this.accessTokenExpiration as ms.StringValue,
          issuer: "momentum-app",
          subject: userId,
        }
      );

      const refreshToken: string = this.generateJwtToken(
        { userId, type: "refresh" },
        this.refreshTokenSecret,
        {
          expiresIn: this.refreshTokenExpiration as ms.StringValue,
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
      throw new Error("Failed to generate token pair");
    }
  }

  validateToken(token: string): boolean {
    try {
      return true;
    } catch (err: any) {
      return false;
    }
  }
}
