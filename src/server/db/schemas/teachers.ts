import { time, varchar, integer } from "drizzle-orm/pg-core";
import { createTable } from "../mainSchema";
import { users } from "./users";

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

export const workingHours = createTable("workingHours", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  teacherId: varchar("teacherId", { length: 255 })
    .notNull()
    .references(() => teacher.id, { onDelete: "cascade", onUpdate: "cascade" }),
  dayOfWeek: integer("dayOfWeek").notNull(), // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: time("startTime").notNull(),
  endTime: time("endTime").notNull(),
});
