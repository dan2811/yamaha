import type { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import AdminButton from "./Button";

export const DateRangeFilter = ({
  startDate,
  endDate,
  setEndDate,
  setStartDate,
  reset,
}: {
  startDate: Date;
  endDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  setEndDate: Dispatch<SetStateAction<Date>>;
  reset: () => void;
}) => {
  return (
    <div className="flex items-center gap-2 rounded bg-purple-500/20 p-2">
      <p>Start: </p>
      <input
        type="date"
        value={startDate?.toISOString().split("T")[0]}
        onChange={(e) => {
          const date = new Date(e.target.value);
          setStartDate(date);
        }}
      />
      <p>End:</p>
      <input
        type="date"
        value={endDate?.toISOString().split("T")[0]}
        onChange={(e) => {
          const date = new Date(e.target.value);
          if (date < startDate) {
            toast.error("End date cannot be before start date!");
            setEndDate(startDate);
          } else {
            setEndDate(date);
          }
        }}
      />
      <AdminButton onClick={() => reset()}>Reset</AdminButton>
    </div>
  );
};
