"use client";
import { useRouter } from "next/navigation";
import React, { type FocusEventHandler, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import AdminButton from "~/app/_components/admin/Button";
import Tooltip from "~/app/_components/admin/Tooltip";
import { paymentMethods } from "~/server/types";
import { api } from "~/trpc/react";

const AddPayment = ({ pupilId }: { pupilId: string }) => {
  const [amount, setAmount] = useState("");
  const [isNotPaid, setIsNotPaid] = useState(false);
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]!,
  );
  const [method, setMethod] = useState<string>(paymentMethods[0]);
  const [notes, setNotes] = useState("");
  const { mutateAsync } = api.payments.create.useMutation();
  const router = useRouter();

  const formatAmount: FocusEventHandler<HTMLInputElement> = (e) => {
    const amount = e.target.value;
    if (!amount.includes(".")) {
      setAmount(amount + ".00");
    }
    const [pounds, pennies] = amount.split(".");
    if (pennies?.length !== 2) {
      setAmount(parseFloat(amount).toFixed(2));
    }
  };

  const handleAddPayment = async () => {
    const amountInPennies = parseFloat(amount) * 100;
    if (amountInPennies <= 0) {
      toast.error("Invalid amount - must be greater than £00.00");
      return;
    }
    const paymentMethodSchema = z.enum(paymentMethods);
    const { success, data: validatedPaymentMethod } =
      paymentMethodSchema.safeParse(method);
    if (!success) {
      toast.error("Invalid payment method");
      return;
    }
    console.log({
      amountInPennies,
      paid: isNotPaid ? null : date,
      method: validatedPaymentMethod,
      notes,
      pupilId,
    });
    await mutateAsync(
      {
        amountInPennies: parseFloat(amount) * 100,
        paid: isNotPaid ? null : new Date(date),
        method: validatedPaymentMethod,
        notes,
        pupilId,
      },
      {
        onSuccess: () => {
          toast.success("Payment added successfully");
          setAmount("");
          setIsNotPaid(false);
          setDate(new Date().toISOString().split("T")[0]!);
          setMethod(paymentMethods[0]);
          setNotes("");
          router.refresh();
        },
        onError: () => {
          toast.error("Failed to add payment");
        },
      },
    );
  };

  return (
    <tr className="children:py-2 border-t border-purple-500/20">
      <td className="align-top">
        <span className="flex items-center">
          <p>£</p>
          <input
            type="text"
            placeholder="00.00"
            value={amount}
            className="w-20 rounded-xl p-1"
            onChange={(e) => setAmount(e.target.value)}
            onBlur={formatAmount}
          />
        </span>
      </td>
      <td className="align-top">
        <input
          type="date"
          className="rounded-xl p-1 disabled:bg-slate-400/50 disabled:opacity-50"
          disabled={isNotPaid}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Tooltip text="Ticking this box will cause this payment to be recorded as unpaid.">
          <div className="flex items-center justify-center gap-1 p-1">
            <label htmlFor="paid" className="has-tooltip text-xs">
              Not yet paid?
            </label>
            <input
              type="checkbox"
              id="paid"
              value={isNotPaid ? 1 : 0}
              onChange={() => setIsNotPaid(!isNotPaid)}
            />
          </div>
        </Tooltip>
      </td>
      <td className="align-top">
        <select
          className="rounded-xl p-1"
          onChange={(e) => setMethod(e.target.value)}
        >
          {paymentMethods.map((paymentMethod) => (
            <option value={paymentMethod} key={paymentMethod}>
              {paymentMethod}
            </option>
          ))}
        </select>
      </td>
      <td className="align-top">
        <textarea
          placeholder="Notes"
          className="rounded-xl p-1"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </td>
      <td>
        <AdminButton onClick={handleAddPayment}>➕ Add</AdminButton>
      </td>
    </tr>
  );
};

export default AddPayment;
