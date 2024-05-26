import { numeric, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../mainSchema";
import { bookTypes } from "~/server/types";

export const books = createTable("book", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { enum: bookTypes, length: 35 }),
  price: numeric("price", { precision: 3, scale: 2 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 255 }),
});
