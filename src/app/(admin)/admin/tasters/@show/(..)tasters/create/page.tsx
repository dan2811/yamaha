"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import InstrumentSelect from "./_instrumentSelect";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import BackButton from "../../_backButton";

const Create = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [instrument, setInstrument] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  const { mutateAsync } = api.taster.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      `Submitting form data: ${JSON.stringify({
        email,
        phone,
        firstName,
        middleName,
        lastName,
        dob,
        instrumentId: instrument,
        internalNotes,
      })}`,
    );
    try {
      const newTaster = await mutateAsync({
        email,
        phone,
        firstName,
        middleName,
        lastName,
        dob,
        instrumentId: instrument,
          internalNotes,
      });
      if (!newTaster) throw new Error("Failed to create taster enquiry");
      toast.success("Taster enquiry created");
      router.push(`/admin/tasters/${newTaster.id}`);
    } catch (e) {}
  };

  return (
    <div className="flex h-screen w-1/2 flex-col gap-4 border-l-2 border-purple-500/40 p-2 md:gap-8">
      <span className="flex justify-between">
        <h3 className="text-xl font-bold">New Taster Enquiry</h3>
        <BackButton label="Close" />
      </span>
      <form className="flex flex-col gap-4 md:gap-8" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Phone"
          className="w-full rounded-md border-2 border-purple-500/40 p-2"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-md border-2 border-purple-500/40 p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="First Name"
          className="w-full rounded-md border-2 border-purple-500/40 p-2"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Middle Name(s)"
          className="w-full rounded-md border-2 border-purple-500/40 p-2"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          className="w-full rounded-md border-2 border-purple-500/40 p-2"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <fieldset className="flex items-center justify-between gap-6">
          <label htmlFor="date-of-birth">Date of Birth</label>
          <input
            id="date-of-birth"
            type="date"
            className="w-full max-w-sm flex-1 rounded-md border-2 border-purple-500/40 p-2"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </fieldset>
        <InstrumentSelect
          className="w-full max-w-sm rounded-md border-2 border-purple-500/40 p-2"
          value={instrument}
          onChange={setInstrument}
          id="instrument"
        />
        <textarea
          placeholder="Internal notes"
          aria-multiline
          className="w-full rounded-md border-2 border-purple-500/40 p-2"
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-lg bg-purple-500 p-2 text-white"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default Create;
