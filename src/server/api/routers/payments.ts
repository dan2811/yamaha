import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { desc, eq } from "drizzle-orm";
import { payments, pupils_to_payments } from "~/server/db/schemas";
import { paymentMethods } from "~/server/types";

export const paymentsRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        pupilId: z.string(),
      }),
    )
    .query(async ({ input: { pupilId }, ctx }) => {
      const res = await ctx.db
        .select({ payments })
        .from(pupils_to_payments)
        .where(eq(pupils_to_payments.pupilId, pupilId))
        .leftJoin(payments, eq(payments.id, pupils_to_payments.paymentId))
        .orderBy(desc(payments.paid));
      return res.map((res) => res.payments);
    }),
  create: adminProcedure
    .input(
      z.object({
        pupilId: z.string(),
        amountInPennies: z.number(),
        date: z.string().nullable(),
        method: z.enum(paymentMethods),
        notes: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [payment] = await ctx.db.insert(payments).values(input).returning();
      if (!payment?.id) {
        throw new Error("Failed to create payment");
      }
      await ctx.db.insert(pupils_to_payments).values({
        pupilId: input.pupilId,
        paymentId: payment.id,
      });
    }),
});
