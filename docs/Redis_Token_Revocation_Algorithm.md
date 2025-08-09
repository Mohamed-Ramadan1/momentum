# Redis Token Revocation Algorithm

## Overview

This document explains the algorithm and design pattern used to manage token revocation in our application using Redis. The revocation system ensures that any issued JWTs (JSON Web Tokens) can be invalidated before their natural expiration time, enhancing security — especially when dealing with logout or compromised token scenarios.

## Key Components

### 1. `RedisTokenManager` (Service Class)

This class interacts directly with Redis and handles token storage, revocation, and lookup.

#### Methods:

- `revokeToken(userId: string, token: string, expiresInSeconds = 3600): Promise<void>`
  - Stores the token in a Redis Set with a TTL (time to live).
  - Uses `SADD` to add the token to a Redis set.
  - Uses `EXPIRE` to auto-delete the key after the TTL.

- `isTokenRevoked(userId: string, token: string): Promise<boolean>`
  - Checks if the token exists in the Redis Set using `SISMEMBER`.

- `listRevokedTokens(userId: string): Promise<string[]>`
  - Returns all tokens currently marked as revoked for the given user.

#### Redis Schema:

- Key: `revokedTokens:{userId}`
- Value Type: Redis Set of revoked tokens.
- TTL: Automatically set per key using the `expire` command.

### 2. `TokenRevocation` (Abstraction Layer)

This class provides an abstraction over the `RedisTokenManager` and conforms to the `ITokenRevocation` interface.

#### Methods:

- `revokeToken(userId: string, token: string): Promise<void>`
- `isTokenRevoked(userId: string, token: string): Promise<boolean>`
- `listRevokedTokens(userId: string): Promise<string[]>`

This separation of concerns makes the logic modular, testable, and injectable via Inversify.

## TTL (Time-To-Live) Support

Each `revokedTokens:{userId}` key has an associated TTL. Once expired, Redis automatically deletes the key. This prevents memory leaks and stale data.

- The TTL is set using the `EXPIRE` command in Redis.
- Default TTL used: `3600` seconds (1 hour), but this can be customized.

## Dependency Injection (DI)

- The system uses **Inversify** for Dependency Injection.
- `RedisTokenManager` is injected into the `TokenRevocation` class using the `TYPES.RedisTokenManager` identifier.

## Advantages of This Design

- **Efficient Lookup**: Redis Sets allow O(1) complexity for add and membership checks.
- **Auto-Cleanup**: TTL ensures no manual deletion needed.
- **Isolation**: Tokens are grouped by user, which isolates scope and helps scalability.
- **Testable & Extensible**: Each class follows the SOLID principles, enabling easy unit testing and future extensions.

## Potential Enhancements

- Add support for global blacklisting (not scoped by user).
- Include metadata (like IP, user-agent) per token using Redis Hashes.
- Add separate admin tools to monitor revoked tokens.

---

> This module is crucial for secure JWT management in any stateless authentication system using Redis.
