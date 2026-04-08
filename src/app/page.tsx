"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import Logo from "@/components/shared/Logo";
import { ArrowRight, FileSearch, Route, Briefcase, MessageSquare, Star, Zap } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <FileSearch className="w-5 h-5" />,
    title: "AI Resume Analysis",
    description: "Deep analysis with skill gap detection and actionable improvements",
  },
  {
    icon: <Route className="w-5 h-5" />,
    title: "Skill Roadmaps",
    description: "Step-by-step learning paths from beginner to advanced",
  },
  {
    icon: <Briefcase className="w-5 h-5" />,
    title: "Job Matching",
    description: "AI-powered job matching with compatibility scoring",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Interview Prep",
    description: "Multi-round interview simulator with AI feedback",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 h-20 border-b border-[var(--color-border)]">
        <Logo size="md" />
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="btn-ghost text-sm">
            Sign in
          </Link>
          <Link href="/auth/register" className="btn-primary text-sm">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* Badge */}
        <div className="badge badge-accent mb-6 animate-fade-in">
          <Zap className="w-3 h-3" />
          AI-Powered Career Growth
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight max-w-4xl leading-[1.1] animate-fade-in stagger-1">
          Your career,{" "}
          <span className="gradient-text">supercharged</span>
          <br />
          by AI
        </h1>

        <p className="mt-6 text-lg text-[var(--color-text-secondary)] max-w-2xl animate-fade-in stagger-2 text-balance leading-relaxed">
          Upload your resume, discover skill gaps, get personalized roadmaps,
          match with top jobs, and ace your interviews — all in one platform.
        </p>

        {/* CTA */}
        <div className="flex items-center gap-6 mt-10 animate-fade-in stagger-3">
          <Link href="/auth/register" className="btn-primary text-base px-8 py-3">
            Start for Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/auth/login" className="btn-secondary text-base px-8 py-3">
            Sign In
          </Link>
        </div>

        {/* Trust */}
        <div className="flex items-center gap-1.5 mt-8 animate-fade-in stagger-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 text-[var(--color-accent)] fill-[var(--color-accent)]"
            />
          ))}
          <span className="text-sm text-[var(--color-text-secondary)] ml-2">
            Trusted by 10,000+ professionals
          </span>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-20 w-full max-w-7xl">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`card p-8 text-left animate-fade-in stagger-${i + 2}`}
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-muted)] flex items-center justify-center mb-4 text-[var(--color-accent)]">
                {feature.icon}
              </div>
              <h3 className="font-heading font-semibold text-sm mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] px-6 py-6 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          © 2026 CareerOS. Built with AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
