import { api } from "~/trpc/react";
import LoadingSpinner from "./LoadingSpinner";

export const SelectRoom = ({
  handleChange,
  initialValue,
}: {
  handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  initialValue?: string;
}) => {
  const { data: rooms, status } = api.rooms.list.useQuery();
  switch (status) {
    case "error":
      return <p>⛔️ Error loading class levels</p>;
    case "pending":
      return <LoadingSpinner />;
    case "success":
      return (
        <>
          <label>Room:</label>
          <select
            name="roomId"
            defaultValue={!initialValue ? "please-choose" : initialValue}
            className="p-2"
            onChange={handleChange}
          >
            <option disabled value="please-choose">
              Select
            </option>
            {rooms?.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </>
      );
  }
};
