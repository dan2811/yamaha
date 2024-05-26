import { varchar } from "drizzle-orm/pg-core";
import { createTable } from "../mainSchema";
import { pupils } from "./pupils";
import { lessons } from "./classes";
import { attendanceValues } from "~/server/types";

export const attendance = createTable("attendance", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  pupilId: varchar("pupilId", { length: 255 })
    .notNull()
    .references(() => pupils.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  lessonId: varchar("lessonId", { length: 255 })
    .notNull()
    .references(() => lessons.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  value: varchar("value", { enum: attendanceValues, length: 50 }),
});
