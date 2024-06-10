import { z } from "zod";
import { like, eq, and } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { instruments, instrumentsToTeachers } from "~/server/db/schemas";
import { jsonAggBuildObject } from "~/server/db/drizzle-helpers";
import { TRPCError } from "@trpc/server";

export const instrumentRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ input, ctx }) => {
    const res = await ctx.db
      .select({
        id: instruments.id,
        name: instruments.name,
        teachers: jsonAggBuildObject({
          id: instrumentsToTeachers.teacherId,
        }),
      })
      .from(instruments)
      .leftJoin(
        instrumentsToTeachers,
        eq(instruments.id, instrumentsToTeachers.instrumentId),
      )
      .groupBy(instruments.id);
    return res;
  }),
  show: publicProcedure
    .input(
      z.object({
        id: z.string().nullable(),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Instrument id is required",
        });
      }
      const instrument = await ctx.db
        .select()
        .from(instruments)
        .where(eq(instruments.id, input.id))
        .limit(1);

      if (instrument.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          cause: `Instrument with id: ${input.id} does not exist.`,
          message: "Instrument not found",
        });
      }

      return instrument[0];
    }),
});
