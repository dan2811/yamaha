"use client";
import CopyToClipboardButton from "./CopyToClipboardButton";

export const InfoCard = ({
  info,
  children,
  title,
}: {
  title?: string;
  info: Record<string, string | undefined | null>;
  children?: React.ReactNode;
}) => {
  return (
    <section className="rounded-md bg-purple-500/10 p-4 shadow-md shadow-purple-900/80">
      <div className="flex flex-col space-y-2">
        {title && <h3 className="text-lg font-bold">{title}</h3>}
        {Object.entries(info).map(([key, value]) => (
          <div key={key}>
            <label className="font-light">{key}:</label>
            <span className="flex">
              <p className="w-fit overflow-auto rounded p-1 md:text-lg">
                {!value ? "-" : value}
              </p>
              <CopyToClipboardButton
                textToCopy={value}
                className="px-2 hover:bg-slate-300/50"
              />
            </span>
          </div>
        ))}
      </div>
      {children}
    </section>
  );
};
