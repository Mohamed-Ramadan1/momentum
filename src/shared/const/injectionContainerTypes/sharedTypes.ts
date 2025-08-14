export const SHARED_TYPES = {
  JWTConfig: Symbol.for("JWTConfig"),
  TokenGenerator: Symbol.for("TokenGenerator"),
  TokenRevocation: Symbol.for("TokenRevocation"),
  TokenValidator: Symbol.for("TokenValidator"),
  JWTService: Symbol.for("JWTService"),
  ErrorUtils: Symbol.for("ErrorUtils"),
  RedisTokenManager: Symbol.for("RedisTokenManager"),
  EmailTransporter: Symbol.for("EmailTransporter"),
  LoggerFactory: Symbol.for("LoggerFactory"),
};
