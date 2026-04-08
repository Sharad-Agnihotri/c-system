"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { COURSES_BY_ROLE, Course } from "@/lib/courses-library";
import { SKILL_CATEGORIES } from "@/lib/constants";
import {
  Search,
  Play,
  Clock,
  Eye,
  ThumbsUp,
  ExternalLink,
  GraduationCap,
  Layout,
  Server,
  Layers,
  BarChart3,
  Cpu,
  Infinity as InfinityIcon,
  Smartphone,
  Cloud,
  ShieldCheck,
  Palette,
  Link as LinkIcon,
  Gamepad2,
  ChevronRight,
} from "lucide-react";

const roleIcons: Record<string, any> = {
  "Frontend Development": Layout,
  "Backend Development": Server,
  "Full Stack Development": Layers,
  "Data Science": BarChart3,
  "Machine Learning": Cpu,
  "DevOps": InfinityIcon,
  "Mobile Development": Smartphone,
  "Cloud Computing": Cloud,
  "Cybersecurity": ShieldCheck,
  "UI/UX Design": Palette,
  "Blockchain": LinkIcon,
  "Game Development": Gamepad2,
};

const levelColors: Record<string, string> = {
  Beginner: "var(--color-success)",
  Intermediate: "var(--color-accent)",
  Advanced: "var(--color-danger)",
};

export default function CoursesPage() {
  const [selectedRole, setSelectedRole] = useState<string>(SKILL_CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const currentCourses = COURSES_BY_ROLE[selectedRole] || [];

  const filtered = currentCourses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLevel = levelFilter === "all" || c.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <PageHeader
        title="Course Recommendations"
        description="Expert-curated YouTube courses for your chosen career path"
      />

      {/* IT Roles Selector */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-heading font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Select Your Path</h3>
          <span className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1">Scroll to explore roles <ChevronRight className="w-3 h-3" /></span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 scroll-smooth">
          {SKILL_CATEGORIES.map((role) => {
            const Icon = roleIcons[role] || GraduationCap;
            const isActive = selectedRole === role;
            
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`flex-none group relative min-w-[160px] p-4 rounded-2xl border transition-all duration-300 ${
                  isActive 
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/20 scale-[1.02]" 
                    : "bg-[var(--color-bg-secondary)]/50 border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-bg-secondary)]"
                }`}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className={`p-3 rounded-xl transition-colors ${
                    isActive ? "bg-white/20 text-white" : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)]"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[13px] font-medium leading-tight ${
                    isActive ? "text-white" : "text-[var(--color-text-primary)]"
                  }`}>
                    {role}
                  </span>
                </div>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Filters */}
        <div className="lg:w-64 flex-none space-y-8">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">Quick Search</h4>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Skills, topics..."
                className="input pl-10 h-10 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">Experience Level</h4>
            <div className="space-y-2">
              {["all", "Beginner", "Intermediate", "Advanced"].map((level) => (
                <button
                  key={level}
                  onClick={() => setLevelFilter(level)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-[13px] transition-all flex items-center justify-between border ${
                    levelFilter === level
                      ? "bg-[var(--color-accent)]/10 border-[var(--color-accent)]/30 text-[var(--color-accent)] font-medium"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)] border-transparent"
                  }`}
                >
                  {level === "all" ? "All Skill Levels" : level}
                  {levelFilter === level && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Courses Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading font-semibold text-xl tracking-tight">
              Best Recommendations for <span className="text-[var(--color-accent)]">{selectedRole}</span>
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] font-medium">{filtered.length} high-authority videos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((course, i) => (
              <div key={course.id} className={`card overflow-hidden group animate-fade-in stagger-${Math.min(i + 1, 6)}`}>
                <div className="aspect-video bg-[var(--color-bg-elevated)] flex items-center justify-center relative overflow-hidden">
                  <Play className="w-12 h-12 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-all duration-300 group-hover:scale-110" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <div className="badge px-3 py-1 font-semibold text-[10px]" style={{ backgroundColor: levelColors[course.level] + "20", color: levelColors[course.level], borderColor: levelColors[course.level] + "40" }}>
                      {course.level}
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 badge badge-accent text-[10px] font-bold py-1 px-3 shadow-lg">
                    {course.matchScore}% Authority
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a href={course.url} target="_blank" rel="noopener noreferrer" className="btn-primary scale-90 group-hover:scale-100 transition-transform">
                      Play Lesson <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-base font-semibold line-clamp-2 mb-2 leading-snug group-hover:text-[var(--color-accent)] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mb-5 font-medium">{course.channel}</p>

                  <div className="flex items-center gap-6 text-[11px] text-[var(--color-text-muted)] mb-6 font-mono border-t border-[var(--color-border)] pt-4">
                    <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{course.views} Views</span>
                    <span className="flex items-center gap-1.5"><ThumbsUp className="w-3.5 h-3.5" />{course.likes} Likes</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {course.topics.map((t) => (
                      <span key={t} className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-muted)] font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24 bg-[var(--color-bg-secondary)]/30 rounded-3xl border-2 border-dashed border-[var(--color-border)]">
              <GraduationCap className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-heading font-semibold mb-2">Refine your search</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">We couldn't find exact matches for those specific topics in the {selectedRole} path.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
