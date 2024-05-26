import { date, text, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../mainSchema";
import { instruments } from "./instruments";
import { tasterStatuses } from "~/server/types";
import { createInsertSchema } from "drizzle-zod";

export const tasterEnquiry = createTable("taster_enquiry", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  studentFirstName: varchar("studentFirstName", { length: 255 }).notNull(),
  studentMiddleNames: varchar("studentMiddleNames", { length: 255 }),
  studentLastName: varchar("studentLastName", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  dob: date("dob").notNull(),
  notes: text("notes"),
  status: varchar("status", { enum: tasterStatuses }).notNull(),
  internalNotes: varchar("internalNotes", { length: 600 }),
  createdAt: varchar("createdAt", { length: 100 })
    .notNull()
    .default(new Date().toISOString()),
  instrumentId: varchar("instrumentId", { length: 255 })
    .notNull()
    .references(() => instruments.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});


export const insertTasterEnquiryZodSchema = createInsertSchema(tasterEnquiry);
