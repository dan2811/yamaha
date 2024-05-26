import { z } from "zod";
import { like, eq, and } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { instruments, instrumentsToTeachers } from "~/server/db/schemas";
import { jsonAggBuildObject } from "~/server/db/drizzle-helpers";

export const instrumentRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ input, ctx }) => {
      const res = await ctx.db
        .select({
          id: instruments.id,
          name: instruments.name,
          teachers: jsonAggBuildObject({
            id: instrumentsToTeachers.teacherId,
          })
        })
        .from(instruments)
        .leftJoin(
          instrumentsToTeachers,
          eq(instruments.id, instrumentsToTeachers.instrumentId),
        ).groupBy(instruments.id);
      return res;
    }),
});
