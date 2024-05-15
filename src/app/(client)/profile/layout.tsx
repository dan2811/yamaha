import type { ReactNode } from "react";

const ProfileLayout = ({ children }: { children: ReactNode }) => {
  return <div className="p-6">{children}</div>;
};

export default ProfileLayout;
