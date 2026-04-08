"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { SKILL_CATEGORIES } from "@/lib/constants";
import { Job } from "@/lib/jobs-fallback";
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Layout,
  Server,
  Layers,
  BarChart3,
  Cpu,
  Infinity as InfinityIcon,
  Smartphone,
  Cloud,
  Palette,
  Link as LinkIcon,
  Gamepad2,
  Building2,
  Trophy,
  Zap,
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

export default function JobsPage() {
  const [selectedRole, setSelectedRole] = useState<string>(SKILL_CATEGORIES[0]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataSource, setDataSource] = useState<string>("simulated");

  useEffect(() => {
    async function fetchJobs() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/jobs?role=${encodeURIComponent(selectedRole)}`);
        const data = await res.json();
        if (data.success) {
          setJobs(data.jobs);
          setDataSource(data.source);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, [selectedRole]);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <PageHeader
        title="Job Recommendations"
        description="Exclusive opportunities matched to your chosen career path and skill roadmap"
      />

      {/* Career Path Selector */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-3">
             <Trophy className="w-4 h-4 text-[var(--color-accent)]" />
             <h3 className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Target Role</h3>
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)] font-medium flex items-center gap-1 bg-[var(--color-bg-secondary)] px-3 py-1 rounded-full">
            <Zap className="w-3 h-3 text-yellow-500" /> Real-time LinkedIn Bridge Active
          </p>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-4 px-4 scroll-smooth">
          {SKILL_CATEGORIES.map((role) => {
            const Icon = roleIcons[role] || Briefcase;
            const isActive = selectedRole === role;
            
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`flex-none group relative min-w-[170px] p-5 rounded-2xl border transition-all duration-500 ${
                  isActive 
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] shadow-[0_15px_30px_-10px_rgba(var(--color-accent-rgb),0.3)] scale-[1.02]" 
                    : "bg-[var(--color-bg-secondary)]/40 border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-bg-secondary)]"
                }`}
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className={`p-3.5 rounded-2xl transition-all duration-500 ${
                    isActive ? "bg-white/25 text-white scale-110 shadow-inner" : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] group-hover:scale-105"
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[13px] font-bold tracking-tight leading-short ${
                    isActive ? "text-white" : "text-[var(--color-text-primary)]"
                  }`}>
                    {role}
                  </span>
                </div>
                {isActive && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Discovery Controls */}
        <div className="lg:w-72 flex-none space-y-10">
          <div className="card p-6 border-[var(--color-accent)]/10 bg-gradient-to-br from-[var(--color-bg-secondary)] to-transparent">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-5">Quick Filter</h4>
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent)] transition-colors" />
              <input
                type="text"
                placeholder="Keywords or companies..."
                className="input pl-10 h-11 text-sm bg-[var(--color-bg-primary)] border-[var(--color-border)] focus:border-[var(--color-accent)]/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] ml-1">Market Insights</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)]">
                <p className="text-[10px] text-[var(--color-text-muted)] uppercase mb-1">Average Salary</p>
                <p className="text-lg font-heading font-bold">$145K</p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)]">
                <p className="text-[10px] text-[var(--color-text-muted)] uppercase mb-1">Demand Level</p>
                <p className="text-lg font-heading font-bold text-[var(--color-success)]">High</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Jobs Feed */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-[var(--color-border)]">
            <div>
              <h2 className="font-heading font-bold text-2xl tracking-tight mb-1">
                Openings for <span className="text-gradient">{selectedRole}</span>
              </h2>
              <p className="text-xs text-[var(--color-text-muted)] font-medium">Found {filteredJobs.length} live opportunities</p>
            </div>
            {dataSource === "live" && (
              <div className="badge badge-success px-3 py-1 flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Live Data
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="card p-8 h-48 animate-pulse bg-[var(--color-bg-secondary)]/50" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredJobs.map((job, i) => (
                <div key={job.id} className={`card group p-8 hover:border-[var(--color-accent)]/40 transition-all duration-500 animate-fade-in stagger-${Math.min(i + 1, 6)} hover:translate-x-2`}>
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Company Logo */}
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-tertiary)] flex items-center justify-center flex-none border border-[var(--color-border)] p-2 group-hover:scale-110 transition-transform">
                      {job.logo ? (
                        <img src={job.logo} alt={job.company} className="w-10 h-10 object-contain grayscale group-hover:grayscale-0 transition-all" />
                      ) : (
                        <Building2 className="w-8 h-8 text-[var(--color-text-muted)]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-1 group-hover:text-[var(--color-accent)] transition-colors tracking-tight">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)] font-medium">
                            <span className="flex items-center gap-1.5 text-[var(--color-text-primary)]"><Building2 className="w-3.5 h-3.5" />{job.company}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                            <span className="px-2 py-0.5 rounded-lg bg-[var(--color-bg-tertiary)] text-[10px] uppercase tracking-widest border border-[var(--color-border)]">{job.type}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <div className="text-right">
                              <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold mb-0.5">Salary Range</p>
                              <p className="text-sm font-bold text-[var(--color-text-primary)]">{job.salary}</p>
                           </div>
                           <div className="badge border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 text-[var(--color-accent)] text-[10px] font-bold flex items-center gap-1.5">
                              <Zap className="w-3 h-3" /> {job.matchScore}% Match
                           </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-[var(--color-border)]">
                        <div className="flex items-center gap-6 text-[11px] text-[var(--color-text-muted)] font-mono">
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Posted {job.postedAt}</span>
                          <span className="flex items-center gap-1.5 text-[var(--color-success)]"><ShieldCheck className="w-3.5 h-3.5" /> Verified Listing</span>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                           <a 
                            href={job.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn-secondary flex-1 md:flex-none text-xs py-2 bg-transparent border-[var(--color-border)] hover:bg-[var(--color-bg-tertiary)]"
                           >
                            Save for Later
                           </a>
                           <a 
                            href={job.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn-primary flex-1 md:flex-none text-xs py-2 group/btn"
                           >
                            Apply on LinkedIn <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                           </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredJobs.length === 0 && (
            <div className="text-center py-24 bg-[var(--color-bg-secondary)]/30 rounded-[32px] border-2 border-dashed border-[var(--color-border)]">
              <Briefcase className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-6 opacity-20" />
              <h3 className="text-xl font-heading font-bold mb-2">No matching opportunities</h3>
              <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mx-auto">We couldn't find any live listings for "{searchQuery}" in the {selectedRole} space. Try a broader search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
