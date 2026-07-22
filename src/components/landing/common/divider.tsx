export default function Divider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-slate-200 to-transparent ${className}`}
    />
  );
}

