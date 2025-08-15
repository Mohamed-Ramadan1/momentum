import { container } from "@config/inversify.config";
import { IJWTService } from "@shared/interfaces/tokens/iJWTService.interface";
import { TYPES } from "@shared/index";

export const JWTService = container.get<IJWTService>(TYPES.JWTService);
console.log("hello there", JWTService);
