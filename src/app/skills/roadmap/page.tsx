"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { SKILL_CATEGORIES } from "@/lib/constants";
import {
  Route,
  Search,
  Clock,
  Target,
  FolderOpen,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";

interface RoadmapNode {
  title: string;
  duration: string;
  topics: string[];
  project: string;
}

interface Roadmap {
  skill: string;
  totalDuration: string;
  beginner: RoadmapNode[];
  intermediate: RoadmapNode[];
  advanced: RoadmapNode[];
}

const mockRoadmap: Roadmap = {
  skill: "Frontend Development",
  totalDuration: "16 weeks",
  beginner: [
    {
      title: "HTML & CSS Fundamentals",
      duration: "2 weeks",
      topics: ["Semantic HTML", "CSS Box Model", "Flexbox & Grid", "Responsive Design"],
      project: "Build a responsive portfolio website",
    },
    {
      title: "JavaScript Essentials",
      duration: "3 weeks",
      topics: ["Variables & Types", "Functions & Closures", "DOM Manipulation", "ES6+ Features"],
      project: "Interactive todo app with local storage",
    },
  ],
  intermediate: [
    {
      title: "React Fundamentals",
      duration: "3 weeks",
      topics: ["Components & Props", "State & Hooks", "Context API", "React Router"],
      project: "Build a movie search app with API integration",
    },
    {
      title: "TypeScript",
      duration: "2 weeks",
      topics: ["Types & Interfaces", "Generics", "Utility Types", "React + TypeScript"],
      project: "Refactor the movie app to TypeScript",
    },
  ],
  advanced: [
    {
      title: "Next.js & SSR",
      duration: "3 weeks",
      topics: ["App Router", "Server Components", "Data Fetching", "API Routes"],
      project: "Full-stack blog with Next.js and Prisma",
    },
    {
      title: "Testing & Performance",
      duration: "2 weeks",
      topics: ["Jest & React Testing Library", "Cypress E2E", "Core Web Vitals", "Code Splitting"],
      project: "Add comprehensive tests and optimize performance",
    },
    {
      title: "Architecture & Deployment",
      duration: "1 week",
      topics: ["State Management", "CI/CD", "Docker", "Monitoring"],
      project: "Deploy a production-grade application",
    },
  ],
};

const levelColors = {
  beginner: "var(--color-success)",
  intermediate: "var(--color-accent)",
  advanced: "var(--color-danger)",
};

const levelLabels = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function RoadmapPage() {
  const [selectedSkill, setSelectedSkill] = useState("");
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRoadmap = async () => {
    if (!selectedSkill) return;
    
    setIsLoading(true);
    setError(null);
    setRoadmap(null);
    setExpandedNodes(new Set());

    try {
      const response = await fetch("/api/skills/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: selectedSkill }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate roadmap. Please try again.");
      }

      const data = await response.json();
      setRoadmap(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderLevel = (level: "beginner" | "intermediate" | "advanced", nodes: RoadmapNode[]) => (
    <div className="animate-fade-in group">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: levelColors[level] }} />
        <h3 className="font-heading font-semibold text-base" style={{ color: levelColors[level] }}>
          {levelLabels[level]}
        </h3>
        <div className="flex-1 h-px bg-[var(--color-border)] opacity-30 ml-4" />
      </div>

      <div className="space-y-5 ml-[5px] border-l-2 border-[var(--color-border)]/30 pl-8 pb-4">
        {nodes.map((node, i) => {
          const nodeId = `${level}-${i}`;
          const isExpanded = expandedNodes.has(nodeId);

          return (
            <div key={i} className="relative">
              {/* Connector dot */}
              <div
                className="absolute -left-[39px] top-6 w-3 h-3 rounded-full border-2 bg-[var(--color-bg-primary)] transition-colors"
                style={{ borderColor: levelColors[level] }}
              />

              <div className="card p-6 cursor-pointer hover:border-transparent transition-colors" onClick={() => toggleNode(nodeId)}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-base font-medium leading-relaxed mb-2.5">{node.title}</h4>
                    <div className="flex items-center gap-6">
                      <span className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <Clock className="w-4 h-4" /> {node.duration}
                      </span>
                      <span className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <BookOpen className="w-4 h-4" /> {node.topics?.length || 0} topics
                      </span>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform mt-1 ${isExpanded ? "rotate-180 text-[var(--color-text-primary)]" : ""}`} />
                </div>

                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-[var(--color-border)]/50 space-y-6 animate-fade-in">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Topics</p>
                      <div className="flex flex-wrap gap-2.5">
                        {node.topics?.map((t) => (
                          <span key={t} className="badge badge-accent px-3 py-1.5 text-[13px]">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2.5 flex items-center">
                        <FolderOpen className="w-4 h-4 mr-2" />
                        Project
                      </p>
                      <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">{node.project}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Skill Roadmap"
        description="Get a structured learning path for any skill"
      />

      {/* Skill selector */}
      <div className="card p-8 mb-12 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Select or type a skill..."
              className="input pl-10"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              onFocus={() => setShowPicker(true)}
              onBlur={() => setTimeout(() => setShowPicker(false), 200)}
              disabled={isLoading}
            />
            {showPicker && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                {SKILL_CATEGORIES.filter((s) =>
                  s.toLowerCase().includes(selectedSkill.toLowerCase())
                ).map((skill) => (
                  <button
                    key={skill}
                    className="w-full px-4 py-2.5 text-sm text-left hover:bg-[var(--color-bg-hover)] transition-colors"
                    onMouseDown={() => {
                      setSelectedSkill(skill);
                      setShowPicker(false);
                    }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={generateRoadmap} 
            disabled={!selectedSkill || isLoading} 
            className={`btn-primary ${isLoading ? "opacity-70 cursor-wait" : ""}`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Architecting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Roadmap
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 rounded-lg text-sm text-[var(--color-danger)] animate-slide-up">
            {error}
          </div>
        )}
      </div>

      {/* Roadmap */}
      {roadmap && (
        <div className="pb-12">
          <div className="flex items-center gap-6 mb-10 animate-fade-in">
            <div className="flex items-center gap-3">
              <Route className="w-6 h-6 text-[var(--color-accent)]" />
              <h2 className="font-heading font-semibold text-xl tracking-tight">{roadmap.skill}</h2>
            </div>
            <span className="badge badge-accent px-4 py-1.5 text-sm">{roadmap.totalDuration}</span>
          </div>

          <div className="space-y-12">
            {roadmap.beginner && renderLevel("beginner", roadmap.beginner)}
            {roadmap.intermediate && renderLevel("intermediate", roadmap.intermediate)}
            {roadmap.advanced && renderLevel("advanced", roadmap.advanced)}
          </div>
        </div>
      )}

      {/* Loading state visual */}
      {isLoading && (
        <div className="space-y-12 pb-12 opacity-50 pointer-events-none">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-gray-700" />
                <div className="h-4 w-24 bg-gray-700 rounded" />
                <div className="flex-1 h-px bg-gray-800 ml-4" />
              </div>
              <div className="space-y-5 ml-[5px] border-l-2 border-gray-800/30 pl-8">
                <div className="card p-10 bg-gray-800/20 border-gray-800 shadow-none" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!roadmap && !isLoading && (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-[var(--color-bg-elevated)] flex items-center justify-center mx-auto mb-5">
            <Route className="w-7 h-7 text-[var(--color-text-muted)]" />
          </div>
          <h3 className="text-lg font-heading font-semibold mb-2">No roadmap yet</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Select a skill above to generate a personalized learning roadmap
          </p>
        </div>
      )}
    </div>
  );
}
