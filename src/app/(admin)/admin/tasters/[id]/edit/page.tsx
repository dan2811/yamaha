"use client";
import React from "react";
import toast from "react-hot-toast";
import AdminButton from "~/app/_components/admin/Button";
import LoadingSpinner from "~/app/_components/admin/LoadingSpinner";
import { insertTasterEnquiryZodSchema } from "~/server/db/schemas";
import { tasterStatuses } from "~/server/types";
import { api } from "~/trpc/react";

const EditTaster = ({ params }: { params: { id: string } }) => {
  const { data, isLoading, isError, error } = api.taster.show.useQuery({
    id: params.id,
  });
  const {
    data: instruments,
    isLoading: isInstrumentsLoading,
    status: instrumentsQueryStatus,
  } = api.instrument.list.useQuery({});
  const { mutateAsync, status, reset } = api.taster.edit.useMutation();

  const inputClassNames =
    "p-2 rounded-lg shadow-md w-full disabled:bg-gray-100";
  if (isLoading) return <p>Loading...</p>;

  if (!data) return <p>Loading...</p>;
  if (!data[0] && !isLoading) return <p>Not found</p>;
  return (
    <form
      className="grid grid-cols-1 gap-6 rounded p-4 sm:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const htmlFormData = new FormData(e.currentTarget);
        const formData = Object.fromEntries(htmlFormData.entries());
        const {
          success,
          data: validatedData,
          error,
        } = insertTasterEnquiryZodSchema.safeParse({
          ...formData,
          id: params.id,
        });
        if (!success) {
          toast.error(`Invalid form data - ${error.issues.join(", ")}`);
          return;
        }
        try {
          await mutateAsync(validatedData);
          toast.success("Taster enquiry updated");
        } catch (error) {
          toast.error("Failed to update taster enquiry");
          console.error(error);
        } finally {
          reset();
        }
      }}
    >
      <fieldset className="flex flex-col gap-4">
        <fieldset className="flex flex-col gap-2">
          <legend>Status</legend>
          <select
            name="status"
            defaultValue={data[0]?.taster_enquiry.status}
            className={`${inputClassNames}`}
            disabled={status === "pending"}
          >
            {tasterStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </fieldset>
        <label htmlFor="firstName">First Name</label>
        <input
          min={1}
          className={`${inputClassNames}`}
          id="firstName"
          type="text"
          name="studentFirstName"
          disabled={status === "pending"}
          defaultValue={data[0]?.taster_enquiry.studentFirstName}
          required
        />
        <label>Middle Name(s)</label>
        <input
          className={`${inputClassNames}`}
          type="text"
          name="studentMiddleNames"
          disabled={status === "pending"}
          defaultValue={data[0]?.taster_enquiry.studentMiddleNames ?? ""}
          required
        />
        <label>Last Name</label>
        <input
          className={`${inputClassNames}`}
          type="text"
          name="studentLastName"
          disabled={status === "pending"}
          defaultValue={data[0]?.taster_enquiry.studentLastName}
          required
        />
        <label>Date of Birth</label>
        <input
          className={`${inputClassNames} max-w-fit`}
          type="date"
          name="dob"
          disabled={status === "pending"}
          defaultValue={
            data[0]?.taster_enquiry.dob &&
            new Date(data[0]?.taster_enquiry.dob).toISOString().split("T")[0]
          }
        />
        <label>Phone</label>
        <input
          className={`${inputClassNames}`}
          type="text"
          name="phone"
          disabled={status === "pending"}
          defaultValue={data[0]?.taster_enquiry.phone}
          required
        />
        <label>Email</label>
        <input
          className={`${inputClassNames}`}
          type="email"
          name="email"
          disabled={status === "pending"}
          defaultValue={data[0]?.taster_enquiry.email}
          required
        />
      </fieldset>
      <fieldset className="flex flex-col gap-4">
        <label>Notes from customer</label>
        <textarea
          className={`${inputClassNames} h-full`}
          name="notes"
          disabled={status === "pending"}
          defaultValue={data[0]?.taster_enquiry.notes ?? ""}
        />
        <label>Internal Notes</label>
        <textarea
          className={`${inputClassNames} h-full`}
          name="internalNotes"
          disabled={status === "pending"}
          defaultValue={data[0]?.taster_enquiry.internalNotes ?? ""}
        />
      </fieldset>
      <fieldset className="flex flex-col gap-2">
        <legend>Instrument</legend>
        {instrumentsQueryStatus === "pending" ? (
          <LoadingSpinner />
        ) : instrumentsQueryStatus === "error" ? (
          <p>⛔️ Error loading instruments</p>
        ) : (
          <select
            name="instrumentId"
            defaultValue={data[0]?.instrument?.name}
            className={`${inputClassNames}`}
            disabled={status === "pending"}
          >
            {instruments.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        )}
      </fieldset>
      {status === "idle" && (
        <AdminButton type="submit" className="sm:col-span-2">
          Save
        </AdminButton>
      )}
    </form>
  );
};

export default EditTaster;
