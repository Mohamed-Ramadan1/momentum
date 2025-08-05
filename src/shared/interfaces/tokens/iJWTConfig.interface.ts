import ms from "ms";
export interface IJWTConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiration: ms.StringValue;
  refreshTokenExpiration: ms.StringValue;
  issuer: string;
}
