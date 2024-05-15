"use client";
import { useSession } from "next-auth/react";

const Profile = () => {
  const session = useSession();

  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">Profile</h2>
        <div className="flex flex-col gap-2">
          <p className="text-xl">Name: {session.data?.user.name}</p>
          <p className="text-xl">Email: {session.data?.user.email}</p>
          <p className="text-xl">
            Primary phone: {session.data?.user.phone1 ?? "Unknown"}
          </p>
          <p className="text-xl">
            Secondary phone: {session.data?.user.phone2 ?? "Unknown"}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">Settings</h2>
        <div className="flex flex-col gap-2">
          <p className="text-xl">Change email</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
