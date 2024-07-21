"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AdminButton from "~/app/_components/admin/Button";

const DiaryNav = () => {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const currentDate = new Date(searchParams.get("date") ?? new Date());
  const getDatesForCurrentWeek = () => {
    const dayOfWeek = currentDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days, otherwise go back to Monday
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() + mondayOffset);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date.toISOString().split("T")[0]!);
    }

    return dates;
  };

  const setDate = (date: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("date", date);
    router.replace(`${path}?${newParams.toString()}`);
  };

  return (
    <div className="flex h-fit w-full justify-center pb-4">
      <nav className="flex w-fit justify-evenly gap-4 overflow-x-scroll">
        <AdminButton
          className="flex h-1/2 items-center place-self-center"
          onClick={() =>
            setDate(
              new Date(new Date().setDate(new Date(currentDate).getDate() - 7))
                .toISOString()
                .split("T")[0]!,
            )
          }
        >
          ◀
        </AdminButton>
        {getDatesForCurrentWeek().map((date) => (
          <Link
            key={date}
            href={`/admin/diary?date=${date}`}
            className={`p-2 text-center ${date === currentDate.toISOString().split("T")[0] ? "bg-purple-500/20" : ""}`}
          >
            <p>
              {new Date(date).toLocaleDateString("en-GB", {
                weekday: "long",
              })}
            </p>
            <p>
              {new Date(date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </Link>
        ))}
        <AdminButton
          className="flex h-1/2 items-center place-self-center"
          onClick={() =>
            setDate(
              new Date(new Date().setDate(new Date(currentDate).getDate() + 7))
                .toISOString()
                .split("T")[0]!,
            )
          }
        >
          ▶
        </AdminButton>
      </nav>
    </div>
  );
};

export default DiaryNav;
