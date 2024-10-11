import { z } from "zod";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import { lessons } from "~/server/db/schemas";
import { and, eq } from "drizzle-orm";

export const lessonsRouter = createTRPCRouter({
  getLessonsForDate: teacherProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ input, ctx }) => {
      const result = ctx.db
        .select()
        .from(lessons)
        .where(eq(lessons.date, input.date.toISOString()))
        .orderBy(lessons.startTime);

      return result;
    }),
  // If no date params passed in, default to show lessons from today up to 5 weeks in future.
  getLessonsForClass: teacherProcedure
    .input(
      z.object({
        classId: z.string(),
        dates: z
          .object({
            startDate: z.date(),
            endDate: z.date(),
          })
          .optional(),
      }),
    )
    .query(async ({ input: { classId, dates }, ctx }) => {
      const defaultStartDate = new Date();
      const defaultEndDate = new Date();
      defaultEndDate.setDate(defaultStartDate.getDate() + 35);

      const result = ctx.db
        .select()
        .from(lessons)
        .where(
          and(
            eq(lessons.classId, classId),
            dates?.startDate
              ? eq(lessons.date, dates.startDate.toISOString())
              : eq(lessons.date, defaultStartDate.toISOString()),
            dates?.endDate
              ? eq(lessons.date, dates.endDate.toISOString())
              : eq(lessons.date, defaultEndDate.toISOString()),
          ),
        )
        .orderBy(lessons.startTime);

      return result;
    }),
});
