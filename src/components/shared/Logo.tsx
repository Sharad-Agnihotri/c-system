import { Zap } from "lucide-react";

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { box: "w-7 h-7", icon: "w-3.5 h-3.5", text: "text-base" },
    md: { box: "w-9 h-9", icon: "w-4 h-4", text: "text-xl" },
    lg: { box: "w-12 h-12", icon: "w-6 h-6", text: "text-3xl" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${s.box} rounded-xl bg-[var(--color-accent)] flex items-center justify-center`}
      >
        <Zap className={`${s.icon} text-black`} />
      </div>
      <span
        className={`font-heading ${s.text} font-bold tracking-tight gradient-text`}
      >
        CareerOS
      </span>
    </div>
  );
}
