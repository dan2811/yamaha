import { unique, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../mainSchema";
import { pupils } from "./pupils";
import { lessons } from "./classes";
import { attendanceValues } from "~/server/types";
import { randomUUID } from "crypto";

export const attendance = createTable(
  "attendance",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(randomUUID),
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
    notes: varchar("notes", { length: 255 }).notNull().default(""),
  },
  (t) => ({
    unique: unique().on(t.lessonId, t.pupilId),
  }),
);
