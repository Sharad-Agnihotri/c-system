"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useResumeStore } from "@/stores/useResumeStore";
import PageHeader from "@/components/shared/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getScoreColor, getScoreLabel } from "@/lib/utils";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  RefreshCw,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

export default function ResumeAnalyzePage() {
  const { file, analysis, isAnalyzing, uploadProgress, error, setFile, analyze, reset } =
    useResumeStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  // ── Upload / Processing View ──────────────────────
  if (!analysis) {
    return (
      <div className="max-w-3xl mx-auto">
        <PageHeader
          title="Resume Analysis"
          description="Upload your resume for AI-powered analysis, scoring, and improvement suggestions"
        />

        {/* Upload zone */}
        <div
          {...getRootProps()}
          className={`card p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)]"
              : file
              ? "border-[var(--color-success)]"
              : "border-dashed border-2"
          } ${isAnalyzing ? "pointer-events-none opacity-70" : ""}`}
        >
          <input {...getInputProps()} />

          {isAnalyzing ? (
            <div className="animate-fade-in">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-[var(--color-text-secondary)] mt-4 mb-3">
                Analyzing your resume with AI...
              </p>
              {/* Progress bar */}
              <div className="w-full max-w-xs mx-auto h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-2">
                {uploadProgress < 100 ? "Uploading..." : "Processing..."}
              </p>
            </div>
          ) : file ? (
            <div className="animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-success-muted)] flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-[var(--color-success)]" />
              </div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                {(file.size / 1024).toFixed(1)} KB · PDF
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="btn-ghost text-xs text-[var(--color-danger)] mt-3"
              >
                <X className="w-3 h-3" />
                Remove
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-muted)] flex items-center justify-center mx-auto mb-4">
                <Upload className="w-7 h-7 text-[var(--color-accent)]" />
              </div>
              <p className="text-sm font-medium">
                {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                PDF format, max 10MB
              </p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-[var(--color-danger-muted)] text-[var(--color-danger)] text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Analyze button */}
        {file && !isAnalyzing && (
          <button onClick={analyze} className="btn-primary w-full mt-4 py-3 animate-fade-in">
            Analyze Resume
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          {[
            { icon: <BarChart3 className="w-4 h-4" />, label: "Score 0–100" },
            { icon: <Target className="w-4 h-4" />, label: "Skill gap detection" },
            { icon: <Lightbulb className="w-4 h-4" />, label: "AI suggestions" },
          ].map((f) => (
            <div key={f.label} className="card p-8 flex items-center gap-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-muted)] flex items-center justify-center text-[var(--color-accent)]">
                {f.icon}
              </div>
              <span className="text-sm text-[var(--color-text-secondary)]">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Results View ──────────────────────────────────
  // Radar chart shows STRONG skills (advantages)
  const radarData = analysis.skills.slice(0, 8).map((s) => ({
    skill: s.name,
    current: s.currentLevel,
    required: s.requiredLevel,
  }));

  // Bar chart shows SKILL GAPS (weak or missing skills) — separate from advantages
  const gapSkills = analysis.skillGaps || [];
  const barData = gapSkills.length > 0
    ? gapSkills.map((s) => ({
        name: s.name,
        gap: Math.max(0, s.requiredLevel - s.currentLevel),
        current: s.currentLevel,
      }))
    : analysis.skills.map((s) => ({
        name: s.name,
        gap: Math.max(0, s.requiredLevel - s.currentLevel),
        current: s.currentLevel,
      }));

  return (
    <div className="max-w-screen-2xl mx-auto">
      <PageHeader
        title="Resume Analysis Results"
        description={`Career Intent: ${analysis.careerIntent}`}
        action={
          <button onClick={reset} className="btn-secondary text-sm">
            <RefreshCw className="w-4 h-4" />
            New Analysis
          </button>
        }
      />

      {/* Score + ATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Resume Score */}
        <div className="card p-8 text-center animate-fade-in">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
            Resume Score
          </p>
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={getScoreColor(analysis.score)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(analysis.score / 100) * 327} 327`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-heading font-bold" style={{ color: getScoreColor(analysis.score) }}>
                {analysis.score}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">/ 100</span>
            </div>
          </div>
          <span className="badge badge-accent">{getScoreLabel(analysis.score)}</span>
        </div>

        {/* ATS Score */}
        <div className="card p-8 text-center animate-fade-in stagger-1">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
            ATS Compatibility
          </p>
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={getScoreColor(analysis.atsScore)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(analysis.atsScore / 100) * 327} 327`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-heading font-bold" style={{ color: getScoreColor(analysis.atsScore) }}>
                {analysis.atsScore}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">/ 100</span>
            </div>
          </div>
          <span className="badge badge-accent">{getScoreLabel(analysis.atsScore)}</span>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="card p-8 animate-fade-in stagger-2">
          <h3 className="text-sm font-heading font-semibold flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-[var(--color-success)]" />
            Strengths
          </h3>
          <ul className="space-y-3">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                <span className="text-[var(--color-text-secondary)] leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-8 animate-fade-in stagger-3">
          <h3 className="text-sm font-heading font-semibold flex items-center gap-2 mb-5">
            <TrendingDown className="w-5 h-5 text-[var(--color-danger)]" />
            Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {analysis.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <AlertCircle className="w-4 h-4 text-[var(--color-danger)] flex-shrink-0 mt-0.5" />
                <span className="text-[var(--color-text-secondary)] leading-relaxed">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skill Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Radar */}
        <div className="card p-8 animate-fade-in stagger-4">
          <h3 className="text-sm font-heading font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />
            Your Strong Skills
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData} outerRadius={110}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
              />
              <Radar
                name="Current"
                dataKey="current"
                stroke="var(--color-accent)"
                fill="var(--color-accent)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Radar
                name="Required"
                dataKey="required"
                stroke="var(--color-text-muted)"
                fill="var(--color-text-muted)"
                fillOpacity={0.05}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-8 mt-4">
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <div className="w-3.5 h-3.5 rounded-sm bg-[var(--color-accent)]" />
              Current Level
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <div className="w-3.5 h-3.5 rounded-sm bg-[var(--color-text-muted)] opacity-30" />
              Required Level
            </div>
          </div>
        </div>

        {/* Bar chart — skill gaps */}
        <div className="card p-8 animate-fade-in stagger-5">
          <h3 className="text-sm font-heading font-semibold mb-6 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-[var(--color-danger)]" />
            Skills to Improve
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={barData} layout="vertical" barGap={0} margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
                tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--color-text-primary)" }}
              />
              <Bar dataKey="current" stackId="a" fill="var(--color-accent)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="gap" stackId="a" fill="var(--color-border-hover)" radius={[0, 4, 4, 0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill="var(--color-border-hover)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Suggestions */}
      <div className="card p-8 mb-12 animate-fade-in stagger-6">
        <h3 className="text-sm font-heading font-semibold flex items-center gap-2 mb-5">
          <Lightbulb className="w-5 h-5 text-[var(--color-accent)]" />
          AI Suggestions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysis.suggestions.map((s, i) => (
            <div
              key={i}
              className="flex items-start gap-6 p-4 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-[var(--color-accent-muted)] text-[var(--color-accent)] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div className="card p-8 animate-fade-in">
        <h3 className="text-sm font-heading font-semibold mb-5">Detected Keywords</h3>
        <div className="flex flex-wrap gap-2.5">
          {analysis.keywords.map((kw) => (
            <span key={kw} className="badge badge-accent px-3 py-1 text-sm">
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
