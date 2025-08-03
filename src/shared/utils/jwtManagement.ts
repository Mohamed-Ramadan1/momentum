import { Jwt } from "jsonwebtoken";

// interfaces imports
import { IJWTManagement } from "../interfaces";

export class JWTManagement implements IJWTManagement {
  validateToken(token: string): boolean {
    return false;
  }
  decodeToken(token: string): Jwt | null {
    return null;
  }

  generateTokenPair(): { accessToken: string; refreshToken: string } {
    return {
      accessToken: "",
      refreshToken: "",
    };
  }
}
