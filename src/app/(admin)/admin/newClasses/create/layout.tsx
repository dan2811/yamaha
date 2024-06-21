import React, { type ReactNode } from "react";
import BackButton from "../../tasters/@show/_backButton";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <BackButton />
      {children}
    </div>
  );
};

export default Layout;
