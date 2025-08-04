export interface IJWTConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiration: string;
  refreshTokenExpiration: string;
  issuer: string;
}
