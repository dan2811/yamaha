import React from "react";
import RegisterNav from "~/app/_components/admin/RegisterNav";
import { DateRangeFilter } from "~/app/_components/admin/DateRangeFilter";

const RegisterLayout = ({
  params,
  children,
}: {
  params: { day: string };
  children: React.ReactNode;
}) => {
  return (
    <div className="flex sm:flex-col">
      <div className="flex justify-between gap-2 p-2">
        <div></div>
        <DateRangeFilter />
      </div>
      <RegisterNav params={params} />
      <div className="bg-purple-500/20 p-2">{children}</div>
    </div>
  );
};

export default RegisterLayout;
