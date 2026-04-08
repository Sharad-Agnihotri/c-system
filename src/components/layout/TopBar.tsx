"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { Bell, Search, User, Target } from "lucide-react";

export const TECH_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "React Developer",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "UI/UX Designer",
  "DevOps Engineer",
  "Cloud Architect",
  "Product Manager",
  "Cybersecurity Analyst",
];

export default function TopBar() {
  const user = useAuthStore((s) => s.user);
  const targetRole = useAuthStore((s) => s.targetRole);
  const setTargetRole = useAuthStore((s) => s.setTargetRole);

  return (
    <header className="h-20 border-b border-[var(--color-border)] bg-[var(--color-bg-card)] flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="relative max-w-sm w-full hidden md:block">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          placeholder="Search features, skills, jobs..."
          className="input pl-10 py-2 text-sm bg-[var(--color-bg-primary)] border-[var(--color-border)]"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Role Selector */}
        <div className="hidden sm:flex items-center gap-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 focus-within:border-[var(--color-accent)] transition-colors">
          <Target className="w-4 h-4 text-[var(--color-text-muted)]" />
          <select 
            value={targetRole || "Frontend Developer"}
            onChange={(e) => setTargetRole(e.target.value)}
            className="bg-transparent text-sm font-medium text-[var(--color-text-primary)] outline-none cursor-pointer appearance-none pr-4"
            style={{ WebkitAppearance: "none", MozAppearance: "none" }}
          >
            {TECH_ROLES.map((role) => (
              <option key={role} value={role} className="bg-[var(--color-bg-card)]">
                {role}
              </option>
            ))}
          </select>
        </div>
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-[var(--color-bg-elevated)] transition-colors">
          <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-accent)] rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-[var(--color-text-primary)] leading-tight">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {user?.email || "user@example.com"}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--color-accent-muted)] border border-[var(--color-accent)] flex items-center justify-center">
            <User className="w-4 h-4 text-[var(--color-accent)]" />
          </div>
        </div>
      </div>
    </header>
  );
}
