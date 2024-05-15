import { varchar } from "drizzle-orm/pg-core";
import { createTable } from "../mainSchema";
import { relations } from "drizzle-orm";
import { books } from "./books";
import { users } from "./users";

export const instruments = createTable("instrument", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const instrumentRelations = relations(instruments, ({ many }) => ({
  teachers: many(users),
  books: many(books),
}));
