import { and, asc, eq, ilike, or } from "drizzle-orm";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import { classType, pupils } from "~/server/db/schemas";
import { z } from "zod";

export const classTypeRouter = createTRPCRouter({
  show: teacherProcedure
    .input(
      z.object({
        classTypeId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const res = await ctx.db
        .select()
        .from(classType)
        .where(eq(classType.id, input.classTypeId));
      return res[0];
    }),
  list: teacherProcedure
    .input(
      z.object({
        searchString: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const res = await ctx.db
        .select()
        .from(classType)
        .orderBy(asc(classType.name))
        .where(ilike(classType.name, `%${input.searchString}%`));
      return res;
    }),
});
