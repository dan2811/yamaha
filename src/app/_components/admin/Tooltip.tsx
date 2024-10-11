const Tooltip = ({
  children,
  text,
}: React.PropsWithChildren<{ text: string }>) => {
  return (
    <div className="group relative">
      {children}
      <div className="absolute bottom-full left-1/2 z-10 mb-2 hidden w-full -translate-x-1/2 transform rounded bg-purple-300 px-2 py-1 text-xs group-hover:block">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
