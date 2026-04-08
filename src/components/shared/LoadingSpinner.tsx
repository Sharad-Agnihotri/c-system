export default function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full`}
        style={{ animation: "spin 0.7s linear infinite" }}
      />
    </div>
  );
}
