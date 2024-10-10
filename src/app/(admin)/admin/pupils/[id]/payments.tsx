import React from "react";
import AdminButton from "~/app/_components/admin/Button";
import { api } from "~/trpc/server";
import AddPayment from "./addPayment";

const Payments = async ({ pupilId }: { pupilId: string }) => {
  const payments = await api.payments.list({ pupilId });
  return (
    <section className="min-w-fit rounded-md bg-purple-500/10 p-4 shadow-md shadow-purple-900/80">
      <h3 className="text-lg font-bold">Payments</h3>
      {!payments && <p>Could not retrieve payments 😭</p>}
      {payments.length === 0 ? (
        <p>No payments yet</p>
      ) : (
        <table className="w-full">
          <thead className="text-left">
            <tr className="children:py-2">
              <th>Amount</th>
              <th>Date</th>
              <th>Method</th>
              <th>Notes</th>
            </tr>
          </thead>
          <AddPayment pupilId={pupilId} />
          {payments.map((payment) => {
            if (!payment) return;
            return (
              <tr
                key={payment.id}
                className="children:py-2 border-t border-purple-500/20"
              >
                <td>£{(payment.amountInPennies / 100).toFixed(2)}</td>
                <td>
                  {payment?.paid ? (
                    new Date(payment.paid).toLocaleDateString()
                  ) : (
                    <p className="font-bold text-red-700">⚠️ Not yet paid</p>
                  )}
                </td>
                <td>{payment.method}</td>
                <td>{payment.notes}</td>
                <td>
                  <AdminButton>✏️ Edit</AdminButton>
                </td>
              </tr>
            );
          })}
        </table>
      )}
    </section>
  );
};

export default Payments;
