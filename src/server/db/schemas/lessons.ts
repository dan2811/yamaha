import {
  boolean,
  interval,
  numeric,
  text,
  time,
  varchar,
} from "drizzle-orm/pg-core";
import { createTable } from "../mainSchema";
import { relations } from "drizzle-orm";
import { instruments } from "./instruments";
import { days, lessonTypes } from "~/server/types";
import { books } from "./books";
import { rooms } from "./rooms";
import { users } from "./users";

export const lessons = createTable("lesson", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { enum: lessonTypes, length: 35 }).notNull(),
  startTime: time("startTime").notNull(),
  length: interval("length", { fields: "minute" }).notNull(),
  day: varchar("day", { enum: days }).notNull(),
  isStarted: boolean("isStarted").notNull().default(false),
});

export const lessonRelations = relations(lessons, ({ one, many }) => ({
  instruments: one(instruments),
  pupils: many(users),
  teacher: one(users),
  book: one(books),
  level: one(lessonLevel),
  room: one(rooms),
  type: one(lessonType),
}));

export const lessonLevel = createTable("lesson_level", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
});

export const lessonType = createTable("lesson_type", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: numeric("price", { precision: 3, scale: 2 }).notNull(),
});
