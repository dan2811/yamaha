import { time, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../mainSchema";
import { days } from "~/server/types";

export const openingHours = createTable("openingHours", {
  day: varchar("day", { enum: days }).notNull().unique().primaryKey(),
  startTime: time("startTime").notNull(),
  endTime: time("endTime").notNull(),
});
