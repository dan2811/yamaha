"use client";
import React, { type FocusEventHandler, useState } from "react";
import AdminButton from "~/app/_components/admin/Button";
import Tooltip from "~/app/_components/admin/Tooltip";
import { paymentMethods } from "~/server/types";

const AddPayment = () => {
  const [amount, setAmount] = useState("");

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

  return (
    <tr className="children:py-2 border-t border-purple-500/20">
      <td>
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
      <td className="group">
        <Tooltip text="Checking this box will cause this payment to be recorded as unpaid.">
          <label htmlFor="paid" className="has-tooltip">
            Not yet paid?
          </label>
          <input type="checkbox" id="paid" />
        </Tooltip>
      </td>
      <td>
        <select className="rounded-xl p-1">
          {paymentMethods.map((paymentMethod) => (
            <option value={paymentMethod} key={paymentMethod}>
              {paymentMethod}
            </option>
          ))}
        </select>
      </td>
      <td>
        <textarea placeholder="Notes" className="rounded-xl p-1" />
      </td>
      <td>
        <AdminButton>➕ Add</AdminButton>
      </td>
    </tr>
  );
};

export default AddPayment;
