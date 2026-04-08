import { FileX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] flex items-center justify-center mb-5">
        {icon || <FileX className="w-7 h-7 text-[var(--color-text-muted)]" />}
      </div>
      <h3 className="text-lg font-heading font-semibold mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mb-6">
        {description}
      </p>
      {action}
    </div>
  );
}
