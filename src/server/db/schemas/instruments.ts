import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../mainSchema";
import { books } from "./books";
import { teacher } from "./teachers";

export const instruments = createTable("instrument", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const instrumentsToBooks = createTable(
  "instruments_to_books",
  {
    instrumentId: varchar("instrumentId", { length: 255 })
      .notNull()
      .references(() => instruments.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    bookId: varchar("bookId", { length: 255 })
      .notNull()
      .references(() => books.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.bookId, t.instrumentId],
      name: "instruments_to_books_pk",
    }),
  }),
);

export const instrumentsToTeachers = createTable(
  "instruments_to_teachers",
  {
    instrumentId: varchar("instrumentId", { length: 255 })
      .notNull()
      .references(() => instruments.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    teacherId: varchar("teacherId", { length: 255 })
      .notNull()
      .references(() => teacher.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.teacherId, t.instrumentId],
      name: "instruments_to_teachers_pk",
    }),
  }),
);
