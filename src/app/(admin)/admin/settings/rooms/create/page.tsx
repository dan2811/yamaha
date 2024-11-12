"use client";
import { useRouter } from "next/navigation";
import React, { type ChangeEventHandler, useState } from "react";
import toast from "react-hot-toast";
import AdminButton from "~/app/_components/admin/Button";
import LoadingSpinner from "~/app/_components/admin/LoadingSpinner";
import { api } from "~/trpc/react";

interface FormData {
  name: string;
  description: string;
}

const CreateRoom = () => {
  const router = useRouter();
   
  const { mutateAsync } = api.rooms.create.useMutation();
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errorMessages } = validateFormData(
      formData
    );

    if (!isValid) {
      toast.error(`Invalid form data \n${errorMessages.join(" \n")}`);
      return;
    }

    await mutateAsync(
      {
        ...formData
      },
      {
        onError: (error) => {
          toast.error("Failed to create new room");
          console.error(error);
        },
        onSuccess: (room) => {
          toast.success(`New room created`);
          const route = room[0]?.id
            ? `/admin/settings/rooms/${room[0].id}`
            : "/admin/settings/rooms";
          router.push(route);
        },
      },
    );
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-4">
      <h1 className="text-3xl">Create New Room</h1>
      <form
        onSubmit={handleSubmit}
        className="grid max-w-lg grid-cols-2 gap-6 rounded-xl bg-purple-300 p-6 text-lg"
      >
        <label>Name:</label>
        <input
          className="p-2"
          type="string"
          name="name"
          value={formData.name}
          onChange={handleChange}
          min={2}
        />
        <label>Description:</label>
        <div className="flex flex-col gap-1">
          <input
            className="p-2"
            type="string"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <AdminButton type="submit" className="col-span-2">
          Submit
        </AdminButton>
      </form>
    </div>
  );
};

export default CreateRoom;

interface ValidateFormDataResult {
  isValid: boolean;
  errorMessages: string[];
}

const validateFormData = (
  formData: FormData,
): ValidateFormDataResult => {
  const result: ValidateFormDataResult = { isValid: false, errorMessages: [] };
  if (formData.name === "")
    result.errorMessages.push("Please add a name.");
  if (formData.description === "")
    result.errorMessages.push("Please add a description.");

  if (result.errorMessages.length > 0)
    return { isValid: false, errorMessages: result.errorMessages };

  return { isValid: true, errorMessages: [] };
};
