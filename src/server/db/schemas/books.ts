import { numeric, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../mainSchema";
import { relations } from "drizzle-orm";
import { instruments } from "./instruments";
import { bookTypes } from "~/server/types";

export const books = createTable("book", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { enum: bookTypes, length: 35 }),
  price: numeric("price", { precision: 3, scale: 2 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 255 }),
});

export const bookRelations = relations(books, ({ many }) => ({
  instruments: many(instruments),
}));
