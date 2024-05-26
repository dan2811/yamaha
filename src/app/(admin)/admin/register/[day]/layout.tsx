"use client";
import React, { useState } from "react";
import RegisterNav from "~/app/_components/admin/RegisterNav";
import Register from "./page";
import { DateRangeFilter } from "~/app/_components/admin/DateRangeFilter";

const RegisterLayout = ({ params }: { params: { day: string } }) => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();

  let defaultStartDate: Date;
  let defaultEndDate: Date;

  if (day >= 1 && day <= 13) {
    defaultStartDate = new Date(year, month - 1, 14, 12);
    defaultEndDate = new Date(year, month, 13, 12);
  } else {
    defaultStartDate = new Date(year, month, 14, 12);
    defaultEndDate = new Date(year, month + 1, 13, 12);
  }

  const [startDate, setStartDate] = useState<Date>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date>(defaultEndDate);

  const resetFilter = () => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
  };
  return (
    <div className="flex sm:flex-col">
      <div className="flex justify-between gap-2">
        <div></div>
        <DateRangeFilter
          endDate={endDate}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          startDate={startDate}
          reset={resetFilter}
        />
      </div>
      <RegisterNav params={params} />
      <div className="bg-purple-500/20 p-2">
        <Register params={params} startDate={startDate} endDate={endDate} />
      </div>
    </div>
  );
};

export default RegisterLayout;
