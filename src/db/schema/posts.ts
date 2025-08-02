import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

import { usersTable } from "./users";
export const postsTable = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  content: varchar({ length: 1000 }).notNull(),
  authorId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});
