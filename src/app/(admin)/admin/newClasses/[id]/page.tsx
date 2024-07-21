"use client";
import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import BackButton from "../../tasters/@show/_backButton";
import { InfoCard } from "~/app/_components/admin/InfoCard";
import { calculateAge, parseDbTime } from "~/app/_utils/dateHelpers";
import AdminButton from "~/app/_components/admin/Button";
import LoadingSpinner from "~/app/_components/admin/LoadingSpinner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { addPupilToClass, deletePupilFromClass } from "./serverActions";
import type { InferSelectModel } from "drizzle-orm";
import type { pupils } from "~/server/db/schemas";
import { getQueryKey } from "@trpc/react-query";
import Link from "next/link";

const ShowNewClass = ({ params: { id } }: { params: { id: string } }) => {
  const { data, isLoading, isError, error } =
    api.classes.showNewClasses.useQuery({
      id,
    });

  const {
    data: pupils,
    isLoading: isPupilsLoading,
    refetch: refetchPupils,
  } = api.classes.listPupils.useQuery({ classId: id });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <div className="h-full w-full p-2">
      <span className="flex justify-between">
        <h3 className="text-xl font-bold">New Class</h3>
        <span className="flex gap-2">
          <a href={`${id}/edit`}>
            <AdminButton>✏️ Edit</AdminButton>
          </a>
          <BackButton
            returnPath="/admin/newClasses/list"
            label="⬅️ Back to list"
          />
        </span>
      </span>
      <article className="grid grid-cols-1 gap-6 p-2 sm:grid-cols-2">
        <InfoCard
          title="Lesson"
          info={{
            Day: data?.classes.day,
            Time: data?.classes.startTime
              ? parseDbTime(data?.classes.startTime)
              : "Unknown",
            "Start Date": data?.classes.startDate
              ? new Date(data?.classes.startDate).toLocaleDateString()
              : "",
            Teacher: data?.user?.name,
            Instrument: data?.instrument?.name,
            Room: data?.room?.name,
          }}
        />
        {isPupilsLoading ? (
          <LoadingSpinner />
        ) : (
          <InfoCard title="Pupils" info={{}}>
            <table className="w-full">
              <thead className="text-left">
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Enrolled?</th>
                </tr>
              </thead>
              <tbody>
                {pupils?.map(
                  ({ pupil }) =>
                    pupil?.id && (
                      <PupilRow
                        pupilId={pupil.id}
                        key={pupil.id}
                        classId={id}
                        refetchPupils={refetchPupils}
                      />
                    ),
                )}
              </tbody>
            </table>
            <AddPupil classId={id} refetchPupils={refetchPupils} />
          </InfoCard>
        )}
      </article>
    </div>
  );
};

export default ShowNewClass;

const PupilRow = ({
  pupilId,
  classId,
  refetchPupils,
}: {
  pupilId: string;
  classId: string;
  refetchPupils: () => Promise<unknown>;
}) => {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  if (!pupilId)
    return (
      <tr>
        <td>No pupils</td>
      </tr>
    );

  const { data: pupil, isLoading } = api.pupils.show.useQuery({
    pupilId,
  });

  if (!pupil)
    return (
      <tr>
        <td>Error: Could not find pupil</td>
      </tr>
    );
  if (isLoading) return <LoadingSpinner />;
  return (
    <tr className="hover:bg-purple-300">
      <td
        className="hover:cursor-pointer"
        onClick={() => router.push(`/admin/pupils/${pupilId}`)}
      >{`${pupil.fName} ${pupil.lName}`}</td>
      <td>{calculateAge(new Date(pupil.dob))}</td>
      <td>{pupil.isEnrolled ? "Yes" : "No"}</td>
      <td>
        {deleting ? (
          <LoadingSpinner />
        ) : (
          <form
            action={async () => {
              const userConfirmed = window.confirm(
                "Are you sure you want to remove this pupil from the class?",
              );
              if (!userConfirmed) return;
              try {
                setDeleting(true);
                await deletePupilFromClass(classId, pupilId);
                await refetchPupils();
                toast.success("Pupil removed from class");
              } catch (e) {
                toast.error(
                  e instanceof Error
                    ? e.message
                    : typeof e === "string"
                      ? e
                      : JSON.stringify(e),
                );
              } finally {
                setDeleting(false);
              }
            }}
          >
            <AdminButton type="submit">❌ Remove</AdminButton>
          </form>
        )}
      </td>
    </tr>
  );
};

const AddPupil = ({
  classId,
  refetchPupils,
}: {
  classId: string;
  refetchPupils: () => Promise<unknown>;
}) => {
  const [adding, setAdding] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<
    InferSelectModel<typeof pupils>[] | []
  >([]);
  const [showPopover, setShowPopover] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const query = getQueryKey(api.pupils.list, {
    searchString: inputValue.trim(),
  });
  const { data, isLoading, refetch } = api.pupils.list.useQuery(
    {
      searchString: inputValue.trim(),
    },
    {
      enabled: false,
    },
  );

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout); // Clear the existing timeout
    }

    const timeoutId = setTimeout(() => {
      if (!inputValue) {
        setResults([]);
        setShowPopover(false);
      } else {
        void refetch(); // Only refetch after debounce period
      }
    }, 600); // 500ms debounce time

    setDebounceTimeout(timeoutId);

    return () => clearTimeout(timeoutId); // Cleanup on unmount or inputValue change
  }, [inputValue, refetch]);

  useEffect(() => {
    if (data?.length) {
      setResults(data);
      setShowPopover(true);
      console.log("DATA: ", data);
    } else {
      setResults([]);
      setShowPopover(false);
    }
  }, [data]);

  return (
    <div className="relative">
      <form className="flex items-center gap-2 py-2">
        <label className="pr-2 font-light">Search for a pupil to add:</label>
        <input
          type="text"
          placeholder="Type pupil name"
          className="rounded-xl p-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </form>
      {showPopover && (
        <div className="max-h-44 max-w-fit overflow-auto border-2 border-purple-400 p-4">
          <ul className="flex flex-col gap-2">
            {results.map((pupil, index) =>
              adding === pupil.id ? (
                <LoadingSpinner key={index} />
              ) : (
                <li
                  key={index}
                  className="flex items-center justify-between gap-2"
                >
                  <Link
                    href={`/admin/pupils/${pupil.id}`}
                    className="text-purple-800 underline"
                  >
                    {pupil.fName} {pupil.mNames} {pupil.lName} - Age:{" "}
                    {calculateAge(new Date(pupil.dob))}
                  </Link>
                  <form
                    action={async () => {
                      try {
                        setAdding(pupil.id);
                        await addPupilToClass(classId, pupil.id);
                        await refetchPupils();
                        setInputValue("");
                        toast.success("Pupil added to class");
                      } catch (e) {
                        toast.error(
                          e instanceof Error
                            ? e.message
                            : typeof e === "string"
                              ? e
                              : JSON.stringify(e),
                        );
                      } finally {
                        setAdding("");
                      }
                    }}
                  >
                    <AdminButton type="submit">+ Add to class</AdminButton>
                  </form>
                </li>
              ),
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
