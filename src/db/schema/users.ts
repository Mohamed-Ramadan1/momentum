import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRolesEnum = pgEnum("user_roles", ["user", "admin"]);

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  profileImage: varchar("profile_image", { length: 255 }),
  roles: userRolesEnum("roles").array().notNull().default(["user"]),

  recoveryEmail: varchar("recovery_email", { length: 255 }).unique(),

  isVerified: boolean("is_verified").default(false),

  emailVerifiedAt: timestamp("email_verified_at"),

  emailVerificationToken: varchar("email_verification_token", { length: 255 }),

  emailVerificationSentAt: timestamp("email_verification_sent_at"),

  emailVerificationTokenExpiresAt: timestamp(
    "email_verification_token_expires_at"
  ),

  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),
});
