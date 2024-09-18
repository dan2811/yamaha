import React, { type ReactNode } from "react";

const SettingsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <a href="/admin/settings">
        <h2 className="pb-6 text-3xl font-bold">Settings</h2>
      </a>
      {children}
    </div>
  );
};

export default SettingsLayout;
