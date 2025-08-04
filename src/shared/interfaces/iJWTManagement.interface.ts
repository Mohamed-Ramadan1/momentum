import { Jwt, SignOptions, JwtPayload } from "jsonwebtoken";

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IJWTManagement {
  validateToken(token: string): boolean;
  decodeToken(token: string): Jwt | null;
  generateTokenPair(userId: string): ITokenPair;
}
