import { z } from "zod";
import { like, eq, and } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { instruments } from "~/server/db/schemas";

export const instrumentRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        instrumentId: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { search, instrumentId } = input ?? {};
      const conditions = [];

      if (search) {
        conditions.push(like(instruments.name, `%${search}%`));
      }

      if (instrumentId) {
        conditions.push(eq(instruments.id, instrumentId));
      }

      const res = await ctx.db
        .select()
        .from(instruments)
        .where(and(...conditions));
      return res;
    }),
});
