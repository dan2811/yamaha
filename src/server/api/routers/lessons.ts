import { z } from "zod";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import { lessons } from "~/server/db/schemas";
import { eq } from "drizzle-orm";

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
});
