import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { roles } from "~/server/types";

const EditUser = ({
  user,
  setSelectedUser,
}: {
  user: any;
  setSelectedUser: Dispatch<SetStateAction<null>>;
}) => {
  const [name, setName] = useState<string>(user.name);
  useEffect(() => {
    setName(user.name);
  }, [user]);
  const handleEdit = (event) => {
    event.preventDefault();
    // Handle edit logic here
  };
  return (
    <aside className="absolute right-0 top-0 flex h-full w-1/3 flex-1 flex-col gap-y-6 border-l-2 border-purple-700 bg-purple-200 bg-opacity-70 bg-clip-padding p-4 backdrop-blur-md backdrop-filter">
      <div className="flex w-full justify-between">
        <h3 className="text-2xl font-bold">Edit User</h3>
        <button onClick={() => setSelectedUser(null)}>Close ❌</button>
      </div>
      <form onSubmit={handleEdit} className="flex flex-col gap-y-6">
        <fieldset className="grid grid-cols-[20%_80%] gap-y-2">
          <label className="self-center">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2"
          />
          <label className="self-center">Email:</label>
          <input type="email" defaultValue={user.email} className="p-2" />
          <label className="self-center">Phone:</label>
          <input type="tel" defaultValue={user.phone} className="p-2" />
          <label className="self-center">Role:</label>
          <select defaultValue={user.role ?? "client"} className="p-2">
            {roles.map((role) => (
              <option value={role}>{role.toUpperCase()}</option>
            ))}
          </select>
        </fieldset>
        <fieldset className="flex w-full gap-4">
          <button
            type="submit"
            className="max-w-fit rounded bg-green-500/90 p-2 text-white"
            onClick={() => {
              toast("Saved!", { icon: "✅" });
              setSelectedUser(null);
            }}
          >
            Save
          </button>
          <button
            type="submit"
            className="max-w-fit rounded bg-red-500/90 p-2 text-white"
            onClick={() => {
              toast("Deleted!", { icon: "❎" });
              setSelectedUser(null);
            }}
          >
            Delete
          </button>
        </fieldset>
      </form>
    </aside>
  );
};

export default EditUser;
