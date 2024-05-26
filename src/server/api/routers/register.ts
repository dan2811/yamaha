import { z } from "zod";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import { zodDays } from "~/server/types";
import { attendance, classType, classes, classesToPupils, instruments, lessons, pupils, teacher, users } from "~/server/db/schemas";
import { and, eq, gte, lte } from "drizzle-orm";

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
      const result = await ctx.db
      .select()
      .select({
        lessons: jsonagg(lessons.columns())
      })
      .from(classes)
      .leftJoin(lessons, eq(classes.id, lessons.classId))
      .where(eq(classes.day, 'Monday'))
      .groupBy(classes.id);
      
      return result;
    }),
});
