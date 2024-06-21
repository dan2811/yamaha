"use client";
import React from "react";
import { api } from "~/trpc/react";
import BackButton from "../../tasters/@show/_backButton";
import { InfoCard } from "~/app/_components/admin/InfoCard";
import { calculateAge, parseDbTime } from "~/app/_utils/dateHelpers";
import AdminButton from "~/app/_components/admin/Button";
import LoadingSpinner from "~/app/_components/admin/LoadingSpinner";
import { useRouter } from "next/navigation";

const ShowNewClass = ({ params: { id } }: { params: { id: string } }) => {
  const { data, isLoading, isError, error } =
    api.classes.showNewClasses.useQuery({
      id,
    });

  const { data: pupils, isLoading: isPupilsLoading } =
    api.classes.listPupils.useQuery({ classId: id });

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
            "Start Date": data?.classes.startDate
              ? new Date(data?.classes.startDate).toLocaleDateString()
              : "",
            Time: data?.classes.startTime
              ? parseDbTime(data?.classes.startTime)
              : "Unknown",
            Teacher: data?.user?.name,
            Instrument: data?.instrument?.name,
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
                {pupils?.pupils.map(({ pupilId }) => (
                  <PupilRow pupilId={pupilId} key={pupilId} />
                ))}
              </tbody>
            </table>
          </InfoCard>
        )}
      </article>
    </div>
  );
};

export default ShowNewClass;

const PupilRow = ({ pupilId }: { pupilId: string }) => {
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
    <tr
      onClick={() => router.push(`/admin/pupils/${pupilId}`)}
      className="hover:cursor-pointer hover:bg-purple-300"
    >
      <td>{`${pupil.fName} ${pupil.lName}`}</td>
      <td>{calculateAge(new Date(pupil.dob))}</td>
      <td>{pupil.isEnrolled ? "Yes" : "No"}</td>
    </tr>
  );
};
