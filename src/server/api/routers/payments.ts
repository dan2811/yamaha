import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { desc, eq } from "drizzle-orm";
import { payments, pupils, pupils_to_payments } from "~/server/db/schemas";

export const paymentsRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        pupilId: z.string(),
      }),
    )
    .mutation(async ({ input: { pupilId }, ctx }) => {
      const res = await ctx.db
        .select({ payments })
        .from(pupils_to_payments)
        .where(eq(pupils_to_payments.pupilId, pupilId))
        .leftJoin(payments, eq(payments.id, pupils_to_payments.paymentId))
        .orderBy(desc(payments.paid));
      return res.map((res) => res.payments);
    }),
});
