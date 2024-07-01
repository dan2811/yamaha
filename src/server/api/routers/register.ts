import { z } from "zod";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import { zodDays } from "~/server/types";
import {
  attendance,
  classes,
  classesToPupils,
  lessons,
  pupils,
} from "~/server/db/schemas";
import { and, eq, getTableColumns, gte, lte } from "drizzle-orm";
import { jsonAggBuildObject } from "~/server/db/drizzle-helpers";

export const registerRouter = createTRPCRouter({
  getClassesForDay: teacherProcedure
    .input(
      z.object({
        day: zodDays,
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const result = ctx.db
        .select({
          ...getTableColumns(classes),
          lessons: jsonAggBuildObject(getTableColumns(lessons)),
        })
        .from(classes)
        .leftJoin(lessons, eq(classes.id, lessons.classId))
        .where(eq(classes.day, input.day))
        .groupBy(classes.id);

      return result;
    }),
  getPupilsForClass: teacherProcedure
    .input(
      z.object({
        classId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      // get all the pupils for a class, using classesToPupils as a join table
      return await ctx.db
        .select({
          ...getTableColumns(pupils),
        })
        .from(pupils)
        .leftJoin(classesToPupils, eq(pupils.id, classesToPupils.pupilId))
        .where(eq(classesToPupils.classId, input.classId));
    }),
  getAttendanceForLesson: teacherProcedure
    .input(
      z.object({
        lessonId: z.string(),
        pupilId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db
        .select()
        .from(attendance)
        .where(
          and(
            eq(attendance.lessonId, input.lessonId),
            eq(attendance.pupilId, input.pupilId),
          ),
        )
        .limit(1);
    }),
  getLessonsForClass: teacherProcedure
    .input(z.object({ classId: z.string(), after: z.date(), before: z.date() }))
    .query(async ({ input, ctx }) => {
      // get all lessons for a class between two dates
      return await ctx.db
        .select()
        .from(lessons)
        .where(
          and(
            eq(lessons.classId, input.classId),
            gte(lessons.date, input.after),
            lte(lessons.date, input.before),
          ),
        );
    }),
});
