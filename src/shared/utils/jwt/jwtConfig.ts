import ms from "ms";
import { IJWTConfig } from "../../interfaces";
import dotenv from "dotenv";

dotenv.config();
export class JWTConfig implements IJWTConfig {
  public readonly accessTokenSecret: string;
  public readonly refreshTokenSecret: string;
  public readonly accessTokenExpiration: ms.StringValue;
  public readonly refreshTokenExpiration: ms.StringValue;
  public readonly issuer: string;

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

  private getRequiredEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Required environment variable ${name} is not set`);
    }
    return value;
  }
}
