import {
  date,
  interval,
  numeric,
  text,
  time,
  varchar,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import { createTable } from "../mainSchema";
import { instruments } from "./instruments";
import { days } from "~/server/types";
import { books } from "./books";
import { rooms } from "./rooms";
import { teacher } from "./teachers";
import { pupils } from "./pupils";
import { randomUUID } from "crypto";
import { type SQL, sql } from "drizzle-orm";

// A class is the representation of the recurring event at a regular time and day.
// A class has many lessons.
// A lesson is a single occurrence of a class.

export const classes = createTable("classes", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  startTime: time("startTime").notNull(),
  lengthInMins: integer("lengthInMins").notNull(),
  endTime: time("endTime")
    .notNull()
    .generatedAlwaysAs(
      (): SQL =>
        sql`${classes.startTime} + interval '1 minute' * ${classes.lengthInMins}`,
    ),
  day: varchar("day", { enum: days }).notNull(),
  maxPupils: integer("maxPupils").notNull(),
  startDate: date("startDate"),
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

// eg. "Complete beginners", "Debut - working towards Debut grade", "DE1 - working on Drum Encounters 1"
export const classLevel = createTable("class_level", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
});

// eg. "Class", "Private", "Semi-Private"
export const classType = createTable("class_type", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: numeric("price", { precision: 6, scale: 2 }).notNull(),
});

// The single occurence of a class is a lesson. Attendance is related to a lesson, not a class.
export const lessons = createTable("lessons", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(randomUUID),
  date: date("date").notNull(),
  startTime: time("startTime").notNull(),
  lengthInMins: integer("lengthInMins").notNull(),
  endTime: time("endTime")
    .notNull()
    .generatedAlwaysAs(
      (): SQL =>
        sql`${lessons.startTime} + interval '1 minute' * ${lessons.lengthInMins}`,
    ),
  classId: varchar("classId", { length: 255 })
    .notNull()
    .references(() => classes.id, { onDelete: "cascade", onUpdate: "cascade" }),
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
