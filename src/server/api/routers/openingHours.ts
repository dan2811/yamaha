import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { openingHours } from "~/server/db/schemas";
import { days } from "~/server/types";
import { eq } from "drizzle-orm";

export const openingHoursRouter = createTRPCRouter({
  add: adminProcedure
    .input(
      z.object({
        day: z.enum(days),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .mutation(async ({ input: { day, startTime, endTime }, ctx }) => {
      const res = await ctx.db
        .insert(openingHours)
        .values({
          day,
          startTime,
          endTime,
        })
        .returning();
      return res;
    }),
  delete: adminProcedure
    .input(z.object({ day: z.enum(days) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(openingHours).where(eq(openingHours.day, input.day));
    }),
  update: adminProcedure
    .input(
      z.object({
        day: z.enum(days),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db
        .update(openingHours)
        .set({
          startTime: input.startTime,
          endTime: input.endTime,
        })
        .where(eq(openingHours.day, input.day)),
    ),
  list: publicProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.select().from(openingHours);
    return res;
  }),
});
