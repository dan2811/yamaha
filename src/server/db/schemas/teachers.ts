import { time, varchar, integer, unique } from "drizzle-orm/pg-core";
import { createTable } from "../mainSchema";
import { users } from "./users";
import { days } from "~/server/types";

export const teacher = createTable("teacher", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .unique()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const workingHours = createTable(
  "workingHours",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    teacherId: varchar("teacherId", { length: 255 })
      .notNull()
      .references(() => teacher.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    day: varchar("day", { enum: days }).notNull(),
    startTime: time("startTime").notNull(),
    endTime: time("endTime").notNull(),
  },
  (t) => ({
    unique: unique().on(t.teacherId, t.day),
  }),
);
