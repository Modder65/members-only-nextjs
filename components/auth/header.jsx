
export const Header = ({ label }) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className="text-3xl font-bold">
        <span className="text-skin-fill">🔐Members</span>
        <span className="text-black">Only</span>
      </h1>
      <p className="text-muted-foreground text-sm">
        {label}
      </p>
    </div>
  );
};