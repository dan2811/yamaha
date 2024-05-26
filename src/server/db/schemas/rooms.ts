import { json, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../mainSchema";
import { instruments } from "./instruments";

export const rooms = createTable("room", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  imageUrls: json("imageUrls").$type<string[]>(),
});

export const roomsToInstruments = createTable(
  "rooms_to_instruments",
  {
    roomId: varchar("roomId", { length: 255 })
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade", onUpdate: "cascade" }),
    instrumentId: varchar("instrumentId", { length: 255 })
      .notNull()
      .references(() => instruments.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (t) => ({
    pkWithCustomName: primaryKey({
      columns: [t.roomId, t.instrumentId],
      name: "rooms_to_instruments_pk",
    }),
  }),
);