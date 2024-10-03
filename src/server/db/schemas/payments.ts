import { sql } from "drizzle-orm";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { paymentMethods } from "../../types";
import { createTable } from "../mainSchema";
import { pupils } from "./pupils";
import { randomUUID } from "crypto";

export const payments = createTable("payments", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(randomUUID),
  // paid is used to determine if the payment has been completed, if set to null then the payment is outstanding.
  paid: timestamp("paid", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  method: varchar("method", { enum: paymentMethods, length: 35 })
    .default("Card")
    .notNull(),
  amountInPennies: integer("amount_in_pennies").notNull(),
  notes: varchar("notes", { length: 255 }),
});

export const pupils_to_payments = createTable("pupils_to_payments", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(randomUUID),
  pupilId: varchar("pupil_id", { length: 255 })
    .notNull()
    .references(() => pupils.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  paymentId: varchar("payment_id", { length: 255 })
    .notNull()
    .references(() => payments.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});
