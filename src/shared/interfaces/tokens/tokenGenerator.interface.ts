export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenGenerator {
  generateTokenPair(userId: string): ITokenPair;
}
