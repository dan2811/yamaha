import { boolean, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../mainSchema";
import { users } from "./users";

export const pupils = createTable("pupil", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  fName: varchar("fName", { length: 255 }).notNull(),
  mNames: varchar("mNames", { length: 255 }),
  lName: varchar("lName", { length: 255 }).notNull(),
  isDroppedOut: boolean("isDroppedOut").default(false).notNull(),
  isEnrolled: boolean("isEnrolled").default(false).notNull(),
  userId: varchar("userId", { length: 255 }).references(() => users.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
});
