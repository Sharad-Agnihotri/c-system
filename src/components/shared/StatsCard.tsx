import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export default function StatsCard({
  label,
  value,
  change,
  icon,
  trend = "neutral",
  className,
}: StatsCardProps) {
  return (
    <div className={cn("card p-8 animate-fade-in", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)] mb-2">{label}</p>
          <p className="text-2xl font-heading font-bold tracking-tight">
            {value}
          </p>
          {change && (
            <p
              className={cn(
                "text-xs font-medium mt-2",
                trend === "up" && "text-[var(--color-success)]",
                trend === "down" && "text-[var(--color-danger)]",
                trend === "neutral" && "text-[var(--color-text-muted)]"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-muted)] flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}
