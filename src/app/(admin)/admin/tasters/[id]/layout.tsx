"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminButton from "~/app/_components/admin/Button";
import { api } from "~/trpc/react";
import TasterStatus from "../status";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { data, isLoading, isError, error } = api.taster.show.useQuery({
    id: params.id,
  });

  if (isError) throw new Error(error.message);
  const path = usePathname();

  const tabs = ["show", "edit"];

  let currentTab;

  switch (true) {
    case path.includes("show"):
      currentTab = "show";
      break;
    case path.includes("edit"):
      currentTab = "edit";
      break;
    default:
      currentTab = "show";
      break;
  }

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>Loading...</p>;
  if (!data[0]) return <p>Not found</p>;

  const {
    taster_enquiry: { studentFirstName, studentLastName, status },
  } = data[0];

  return (
    <div className="flex w-full flex-col gap-x-2">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex items-center">
          <h2 className=" p-4 text-lg font-bold">{`${studentFirstName} ${studentLastName}`}</h2>
          <TasterStatus status={status} showLabel />
        </div>
      )}
      <nav className="flex w-full gap-2">
        <Link
          href={
            path.includes("show") || path.includes("edit")
              ? "show"
              : `${params.id}/show/`
          }
          className={`rounded-t-lg p-4 ${currentTab === "show" ? "bg-purple-600/10" : ""}`}
        >
          <AdminButton>👀 Show</AdminButton>
        </Link>
        <Link
          href={
            path.includes("show") || path.includes("edit")
              ? "edit"
              : `${params.id}/edit/`
          }
          className={`rounded-t-lg p-4 ${currentTab === "edit" ? "bg-purple-600/10" : ""}`}
        >
          <AdminButton>✏️ Edit</AdminButton>
        </Link>
        <div className={`rounded-t-lg p-4`}>
          <AdminButton>❌ Delete</AdminButton>
        </div>
      </nav>
      <div className="bg-purple-600/10 p-2">{children}</div>
    </div>
  );
}
