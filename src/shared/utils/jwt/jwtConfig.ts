import { IJWTConfig } from "./jwtConfig.interface";

export class JWTConfig implements IJWTConfig {
  public readonly accessTokenSecret: string;
  public readonly refreshTokenSecret: string;
  public readonly accessTokenExpiration: string;
  public readonly refreshTokenExpiration: string;
  public readonly issuer: string;

  constructor() {
    this.accessTokenSecret = this.getRequiredEnvVar("JWT_ACCESS_TOKEN_SECRET");
    this.refreshTokenSecret = this.getRequiredEnvVar(
      "JWT_REFRESH_TOKEN_SECRET"
    );
    this.accessTokenExpiration =
      process.env.JWT_ACCESS_TOKEN_EXPIRATION || "1h";
    this.refreshTokenExpiration =
      process.env.JWT_REFRESH_TOKEN_EXPIRATION || "7d";
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
