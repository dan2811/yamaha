import React from "react";

const CopyToClipboardButton = (props: {
  textToCopy: string | null | undefined;
  className?: string;
}) => {
  const navigator = window.navigator;
  if (!props.textToCopy) return;
  return (
    <button
      title="Copy"
      className={props.className}
      onClick={async () => {
        await navigator.clipboard.writeText(props.textToCopy!);
      }}
    >
      📋
    </button>
  );
};

export default CopyToClipboardButton;
