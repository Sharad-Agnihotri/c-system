"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileSearch,
  Briefcase,
  MessageSquare,
  GraduationCap,
} from "lucide-react";

const mobileNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/resume/analyze", icon: FileSearch, label: "Resume" },
  { href: "/skills/courses", icon: GraduationCap, label: "Learn" },
  { href: "/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/interview", icon: MessageSquare, label: "Prep" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-[var(--color-border)]">
      <div className="flex items-center justify-around h-20 px-2">
        {mobileNavItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors",
                isActive
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-text-muted)]"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
