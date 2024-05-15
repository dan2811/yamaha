import React, { ReactNode } from "react";

const SettingsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold">Settings</h2>
      {children}
    </div>
  );
};

export default SettingsLayout;
