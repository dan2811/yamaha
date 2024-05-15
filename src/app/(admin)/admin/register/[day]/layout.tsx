import React from "react";
import RegisterNav from "~/app/_components/admin/RegisterNav";

const RegisterLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { day: string };
}) => {
  return (
    <div className="flex sm:flex-col">
      <RegisterNav params={params} />
      <div className="bg-purple-500/20 p-2">{children}</div>
    </div>
  );
};

export default RegisterLayout;
