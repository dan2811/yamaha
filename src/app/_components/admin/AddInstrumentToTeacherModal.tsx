import React, { type Dispatch, useState } from "react";
import toast from "react-hot-toast";
import AdminButton from "~/app/_components/admin/Button";
import type { instruments } from "~/server/db/schemas";
import { api } from "~/trpc/react";

const EditInstruments = ({
  teacherId,
  onComplete,
  isOpen,
  setIsOpen,
  refetchInstruments,
  allInstrumentsIsLoading,
  allInstruments,
}: {
  teacherId: string;
  onComplete: () => void;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  refetchInstruments: () => void;
  allInstrumentsIsLoading: boolean;
  allInstruments:
    | (typeof instruments.$inferSelect & { teachers: { id: string }[] })[]
    | undefined;
}) => {
  const { mutateAsync, isPending, reset } =
    api.teacher.addInstrument.useMutation();

  const [selectedOption, setSelectedOption] = useState<undefined | string>();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedOption(event.target.value);

  if (allInstrumentsIsLoading) return <div>Loading...</div>;

  console.log(allInstruments);

  return isOpen ? (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="z-10 flex min-w-64 flex-col rounded bg-white p-4 shadow-lg">
          <span
            className="cursor-pointer place-self-end"
            onClick={() => setIsOpen(false)}
          >
            Close ❌
          </span>
          <form
            className="flex flex-col gap-6 p-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!selectedOption)
                return toast.error("Please select an instrument");
              await mutateAsync(
                {
                  teacherId,
                  instrumentId: selectedOption,
                },
                {
                  onError: (error) => {
                    console.log(error);
                    toast.error(error.message);
                    reset();
                  },
                  onSuccess: () => {
                    toast.success("Instrument added successfully");
                    void refetchInstruments();
                    onComplete();
                    setIsOpen(false);
                  },
                },
              );
            }}
          >
            <label>Choose an instrument:</label>
            <select
              className="w-fit place-self-center rounded-md border-2 border-purple-600 p-2"
              value={selectedOption}
              onChange={handleChange}
            >
              <option>Please select...</option>
              {allInstruments?.map(({ id, name, teachers }) => {
                console.log(name);
                // only show instruments that are not already assigned to the teacher
                if (teachers.map((t) => t.id).includes(teacherId)) {
                  return null;
                }
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
            <AdminButton disabled={isPending} type="submit" value="Submit">
              Add
            </AdminButton>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditInstruments;
