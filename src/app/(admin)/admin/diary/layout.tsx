import { type ReactNode } from "react";
import DiaryNav from "./DiaryNav";

const Diary = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <DiaryNav />
      {children}
    </>
  );
};

export default Diary;
