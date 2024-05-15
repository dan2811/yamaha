import { json, text, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../mainSchema";
import { relations } from "drizzle-orm";
import { instruments } from "./instruments";

export const rooms = createTable("room", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  imageUrls: json("imageUrls").$type<string[]>(),
});

export const roomRelations = relations(rooms, ({ many }) => ({
  instruments: many(instruments),
}));
