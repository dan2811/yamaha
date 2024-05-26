import {
  boolean,
  date,
  interval,
  numeric,
  text,
  time,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createTable } from "../mainSchema";
import { instruments } from "./instruments";
import { days } from "~/server/types";
import { books } from "./books";
import { rooms } from "./rooms";
import { teacher } from "./teachers";
import { pupils } from "./pupils";

// A class is the representation of the recurring event at a regular time and day.
// A class has many lessons.
// A lesson is a single occurrence of a class.

export const classes = createTable("classes", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  startTime: time("startTime").notNull(),
  lengthInMins: interval("lengthInMins", { fields: "minute" }).notNull(),
  day: varchar("day", { enum: days }).notNull(),
  isStarted: boolean("isStarted").notNull().default(false),
  instrumentId: varchar("instrumentId", { length: 255 }).references(
    () => instruments.id,
    {
      onDelete: "cascade",
      onUpdate: "cascade",
    },
  ),
  bookId: varchar("bookId", { length: 255 }).references(() => books.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  levelId: varchar("levelId", { length: 255 }).references(() => classLevel.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  regularTeacherId: varchar("regularTeacherId", { length: 255 }).references(
    () => teacher.id,
    {
      onDelete: "set null",
      onUpdate: "cascade",
    },
  ),
  roomId: varchar("roomId", { length: 255 }).references(() => rooms.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  typeId: varchar("typeId", { length: 255 }).references(() => classType.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
});

export const classLevel = createTable("class_level", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
});

export const classType = createTable("class_type", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: numeric("price", { precision: 6, scale: 2 }).notNull(),
});

export const lessons = createTable("lessons", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  classId: varchar("classId", { length: 255 })
    .notNull()
    .references(() => classes.id, { onDelete: "cascade", onUpdate: "cascade" }),
  date: date("date", { mode: "string" }).notNull(),
  startTime: time("startTime").notNull(),
  lengthInMins: interval("lengthInMins", { fields: "minute" }).notNull(),
  roomId: varchar("roomId", { length: 255 })
    .notNull()
    .references(() => rooms.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  teacherId: varchar("teacherId", { length: 255 })
    .notNull()
    .references(() => teacher.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
});

export const classesToPupils = createTable(
  "classes_to_pupils",
  {
    classId: varchar("classId", { length: 255 })
      .notNull()
      .references(() => classes.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    pupilId: varchar("pupilId", { length: 255 })
      .notNull()
      .references(() => pupils.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.classId, t.pupilId],
      name: "pk_classes_to_pupils",
    }),
  }),
);
