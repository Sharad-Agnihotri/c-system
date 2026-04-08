"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import PageHeader from "@/components/shared/PageHeader";
import {
  Download,
  Eye,
  ChevronRight,
  ChevronLeft,
  User,
  Briefcase,
  GraduationCap,
  Code2,
  FolderOpen,
  Award,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Loader2,
  X,
} from "lucide-react";
import { PDFTemplate } from "@/components/resume/PDFTemplate";

// Dynamically import PDF components to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <button className="btn-secondary text-sm disabled">Loading...</button> }
);

const steps = [
  { id: 0, label: "Personal", icon: User },
  { id: 1, label: "Experience", icon: Briefcase },
  { id: 2, label: "Education", icon: GraduationCap },
  { id: 3, label: "Skills", icon: Code2 },
  { id: 4, label: "Projects", icon: FolderOpen },
  { id: 5, label: "Preview", icon: Eye },
];

export default function ResumeBuilderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [aiKeywords, setAiKeywords] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
    careerIntent: "",
    experience: [{ company: "", title: "", duration: "", description: "" }],
    education: [{ institution: "", degree: "", field: "", year: "" }],
    skills: [""],
    projects: [{ name: "", description: "", tech: "", link: "" }],
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const suggestKeywords = async () => {
    if (!formData.careerIntent) return;
    setIsGeneratingKeywords(true);
    try {
      const res = await fetch("/api/resume/suggest-keywords", {
        method: "POST",
        body: JSON.stringify({
          careerIntent: formData.careerIntent,
          summary: formData.summary,
        }),
      });
      const data = await res.json();
      if (data.keywords) {
        setAiKeywords(data.keywords);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  const addAiSkill = (skill: string) => {
    if (formData.skills.includes(skill)) return;
    setFormData(prev => ({
      ...prev,
      skills: prev.skills[0] === "" ? [skill] : [...prev.skills, skill]
    }));
    setAiKeywords(prev => prev.filter(k => k !== skill));
  };

  const atsScore = Math.min(
    100,
    Math.floor(
      (formData.name ? 10 : 0) +
      (formData.email ? 10 : 0) +
      (formData.summary.length > 50 ? 15 : 0) +
      (formData.experience[0]?.company ? 20 : 0) +
      (formData.education[0]?.institution ? 15 : 0) +
      (formData.skills.filter(Boolean).length * 5) +
      (formData.projects[0]?.name ? 10 : 0)
    )
  );

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="ATS Resume Builder"
        description="Create a professional, ATS-optimized resume"
        action={
          <div className="flex items-center gap-3">
            <div className={`badge ${atsScore > 70 ? 'badge-success' : 'badge-accent'}`}>
              ATS Score: {atsScore}%
            </div>
            {isClient && (
              <PDFDownloadLink
                document={<PDFTemplate data={formData} />}
                fileName={`${formData.name.replace(/\s+/g, "_") || "Resume"}.pdf`}
              >
                {/* @ts-ignore */}
                {({ loading }) => (
                  <button className="btn-primary text-sm" disabled={loading}>
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Download PDF
                  </button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        }
      />

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-12 overflow-x-auto no-scrollbar">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[var(--color-accent-muted)] text-[var(--color-accent)] shadow-sm"
                  : isCompleted
                  ? "text-[var(--color-success)] bg-[var(--color-success-muted)]/10"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
              }`}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form Area */}
        <div className="lg:col-span-3">
          <div className="card p-8 animate-fade-in min-h-[500px] flex flex-col">
            <div className="flex-grow">
              {/* Step 0: Personal Info */}
              {currentStep === 0 && (
                <div className="space-y-8 animate-slide-up">
                  <h3 className="font-heading font-semibold text-lg">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Full Name</label>
                      <input className="input" placeholder="John Doe" value={formData.name} onChange={(e) => updateField("name", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Target Role (for ATS)</label>
                      <input className="input border-[var(--color-accent)]/30 focus:border-[var(--color-accent)]" placeholder="e.g. Senior Frontend Engineer" value={formData.careerIntent} onChange={(e) => updateField("careerIntent", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Email</label>
                      <input className="input" placeholder="john@example.com" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Phone</label>
                      <input className="input" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Location</label>
                      <input className="input" placeholder="San Francisco, CA" value={formData.location} onChange={(e) => updateField("location", e.target.value)} />
                    </div>
                     <div>
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">LinkedIn</label>
                      <input className="input" placeholder="linkedin.com/in/johndoe" value={formData.linkedin} onChange={(e) => updateField("linkedin", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Professional Summary</label>
                    <textarea className="input min-h-[120px] resize-y" placeholder="Experienced full-stack developer with a focus on high-performance web applications..." value={formData.summary} onChange={(e) => updateField("summary", e.target.value)} />
                  </div>
                </div>
              )}

              {/* Step 1: Experience */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-slide-up">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading font-semibold text-lg">Work Experience</h3>
                    <button
                      onClick={() => setFormData((p) => ({ ...p, experience: [...p.experience, { company: "", title: "", duration: "", description: "" }] }))}
                      className="btn-ghost text-xs text-[var(--color-accent)]"
                    >
                      <Plus className="w-3 h-3" /> Add Experience
                    </button>
                  </div>
                  {formData.experience.map((exp, i) => (
                    <div key={i} className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Experience {i + 1}</span>
                        {i > 0 && (
                          <button onClick={() => setFormData((p) => ({ ...p, experience: p.experience.filter((_, j) => j !== i) }))} className="text-[var(--color-danger)] hover:bg-[var(--color-danger-muted)] p-1.5 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input className="input text-sm" placeholder="Company Name" value={exp.company} onChange={(e) => { const copy = [...formData.experience]; copy[i] = { ...copy[i], company: e.target.value }; setFormData((p) => ({ ...p, experience: copy })); }} />
                        <input className="input text-sm" placeholder="Job Title" value={exp.title} onChange={(e) => { const copy = [...formData.experience]; copy[i] = { ...copy[i], title: e.target.value }; setFormData((p) => ({ ...p, experience: copy })); }} />
                      </div>
                      <input className="input text-sm" placeholder="Duration (e.g. Jan 2022 – Present)" value={exp.duration} onChange={(e) => { const copy = [...formData.experience]; copy[i] = { ...copy[i], duration: e.target.value }; setFormData((p) => ({ ...p, experience: copy })); }} />
                      <textarea className="input text-sm min-h-[80px] resize-y" placeholder="Summarize your key achievements and responsibilities using action verbs..." value={exp.description} onChange={(e) => { const copy = [...formData.experience]; copy[i] = { ...copy[i], description: e.target.value }; setFormData((p) => ({ ...p, experience: copy })); }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Step 2: Education */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-semibold text-lg">Education</h3>
                    <button onClick={() => setFormData((p) => ({ ...p, education: [...p.education, { institution: "", degree: "", field: "", year: "" }] }))} className="btn-ghost text-xs text-[var(--color-accent)]">
                      <Plus className="w-3 h-3" /> Add Education
                    </button>
                  </div>
                  {formData.education.map((edu, i) => (
                    <div key={i} className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input className="input text-sm" placeholder="Institution" value={edu.institution} onChange={(e) => { const copy = [...formData.education]; copy[i] = { ...copy[i], institution: e.target.value }; setFormData((p) => ({ ...p, education: copy })); }} />
                        <input className="input text-sm" placeholder="Year" value={edu.year} onChange={(e) => { const copy = [...formData.education]; copy[i] = { ...copy[i], year: e.target.value }; setFormData((p) => ({ ...p, education: copy })); }} />
                        <input className="input text-sm" placeholder="Degree (e.g. Bachelor of Science)" value={edu.degree} onChange={(e) => { const copy = [...formData.education]; copy[i] = { ...copy[i], degree: e.target.value }; setFormData((p) => ({ ...p, education: copy })); }} />
                        <input className="input text-sm" placeholder="Field of Study" value={edu.field} onChange={(e) => { const copy = [...formData.education]; copy[i] = { ...copy[i], field: e.target.value }; setFormData((p) => ({ ...p, education: copy })); }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 3: Skills */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading font-semibold text-lg">Skills & Technologies</h3>
                    <button onClick={() => setFormData((p) => ({ ...p, skills: [...p.skills, ""] }))} className="btn-ghost text-xs text-[var(--color-accent)]">
                      <Plus className="w-3 h-3" /> Add Skill
                    </button>
                  </div>
                  
                  {/* AI Suggestion Box */}
                  <div className="p-4 rounded-xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)]">
                        <Sparkles className="w-4 h-4" />
                        ATS Keyword Suggestions
                      </div>
                      <button 
                        onClick={suggestKeywords} 
                        disabled={isGeneratingKeywords || !formData.careerIntent}
                        className="btn-ghost text-xs text-[var(--color-accent)]"
                      >
                        {isGeneratingKeywords ? <Loader2 className="w-3 h-3 animate-spin" /> : "Generate Suggestions"}
                      </button>
                    </div>
                    {!formData.careerIntent ? (
                      <p className="text-xs text-[var(--color-text-muted)] italic">Enter a "Target Role" in Personal Info to get tailored suggestions.</p>
                    ) : aiKeywords.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {aiKeywords.map((skill, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => addAiSkill(skill)}
                            className="text-[10px] px-2 py-1 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded border border-[var(--color-accent)]/20 hover:bg-[var(--color-accent)]/20 transition-all flex items-center gap-1"
                          >
                            <Plus className="w-2.5 h-2.5" /> {skill}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--color-text-muted)] italic">Click generate to see industry-standard keywords for "{formData.careerIntent}".</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {formData.skills.map((skill, i) => (
                      <div key={i} className="relative group">
                        <input className="input text-sm pr-10" placeholder="e.g. React" value={skill} onChange={(e) => { const copy = [...formData.skills]; copy[i] = e.target.value; setFormData((p) => ({ ...p, skills: copy })); }} />
                        {i > 0 && (
                          <button onClick={() => setFormData((p) => ({ ...p, skills: p.skills.filter((_, j) => j !== i) }))} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-danger)] p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Projects */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading font-semibold text-lg">Projects</h3>
                    <button onClick={() => setFormData((p) => ({ ...p, projects: [...p.projects, { name: "", description: "", tech: "", link: "" }] }))} className="btn-ghost text-xs text-[var(--color-accent)]">
                      <Plus className="w-3 h-3" /> Add Project
                    </button>
                  </div>
                  {formData.projects.map((proj, i) => (
                    <div key={i} className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input className="input text-sm" placeholder="Project Name" value={proj.name} onChange={(e) => { const copy = [...formData.projects]; copy[i] = { ...copy[i], name: e.target.value }; setFormData((p) => ({ ...p, projects: copy })); }} />
                        <input className="input text-sm" placeholder="Project Link (optional)" value={proj.link} onChange={(e) => { const copy = [...formData.projects]; copy[i] = { ...copy[i], link: e.target.value }; setFormData((p) => ({ ...p, projects: copy })); }} />
                      </div>
                      <textarea className="input text-sm min-h-[80px] resize-y" placeholder="Describe the problem you solved and the impact of the project..." value={proj.description} onChange={(e) => { const copy = [...formData.projects]; copy[i] = { ...copy[i], description: e.target.value }; setFormData((p) => ({ ...p, projects: copy })); }} />
                      <input className="input text-sm" placeholder="Technologies used (e.g. Next.js, OpenAI, Supabase)" value={proj.tech} onChange={(e) => { const copy = [...formData.projects]; copy[i] = { ...copy[i], tech: e.target.value }; setFormData((p) => ({ ...p, projects: copy })); }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Step 5: Preview */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-slide-up">
                  <h3 className="font-heading font-semibold text-lg">Live Resume Preview</h3>
                  <div className="p-10 bg-white text-black rounded-lg shadow-2xl space-y-8 max-h-[600px] overflow-y-auto no-scrollbar border border-gray-200">
                    <div className="text-center border-b pb-6 border-gray-200">
                      <h2 className="text-2xl font-bold tracking-tight">{formData.name || "Your Name"}</h2>
                      <div className="text-[10px] text-gray-500 mt-2 font-medium uppercase tracking-widest flex flex-wrap justify-center gap-x-3 gap-y-1">
                        {formData.email && <span>{formData.email}</span>}
                        {formData.phone && <span>{formData.phone}</span>}
                        {formData.location && <span>{formData.location}</span>}
                        {formData.linkedin && <span>LinkedIn</span>}
                      </div>
                    </div>
                    {formData.summary && (
                      <div>
                        <h4 className="font-bold text-[10px] uppercase tracking-widest border-b border-gray-100 pb-1.5 mb-3 text-gray-400">Professional Summary</h4>
                        <p className="text-[11px] leading-relaxed text-gray-700">{formData.summary}</p>
                      </div>
                    )}
                    {formData.experience.some(e => e.company) && (
                      <div>
                        <h4 className="font-bold text-[10px] uppercase tracking-widest border-b border-gray-100 pb-1.5 mb-3 text-gray-400">Work Experience</h4>
                        {formData.experience.filter((e) => e.company).map((exp, i) => (
                          <div key={i} className="mb-5">
                            <div className="flex justify-between items-baseline">
                              <p className="font-bold text-xs">{exp.company}</p>
                              <p className="text-[10px] text-gray-400 font-medium uppercase">{exp.duration}</p>
                            </div>
                            <p className="text-[11px] text-gray-500 italic mb-1.5">{exp.title}</p>
                            <p className="text-[11px] leading-relaxed text-gray-700 whitespace-pre-wrap">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {formData.skills.filter(Boolean).length > 0 && (
                      <div>
                        <h4 className="font-bold text-[10px] uppercase tracking-widest border-b border-gray-100 pb-1.5 mb-3 text-gray-400">Skills & Expertise</h4>
                        <p className="text-[11px] leading-relaxed text-gray-700">{formData.skills.filter(Boolean).join(" • ")}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-[var(--color-border)]">
              <button 
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} 
                disabled={currentStep === 0} 
                className={`btn-secondary text-sm ${currentStep === 0 ? "opacity-0 invisible" : ""}`}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex gap-4">
                {currentStep < 5 ? (
                  <button onClick={() => setCurrentStep(currentStep + 1)} className="btn-primary text-sm group">
                    Next Section
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      // Final success state/confetti could go here
                      alert("Resume components prepared! Use the Download PDF button at the top to export.");
                    }} 
                    className="btn-primary text-sm bg-[var(--color-success)] border-[var(--color-success)] hover:bg-[var(--color-success)]/90"
                  >
                    Finish Builder
                    <Check className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: ATS Analytics */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 space-y-6">
            <div className="card p-8 bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg-secondary)] border-[var(--color-accent)]/10 shadow-xl">
              <h3 className="text-sm font-heading font-semibold flex items-center gap-2 mb-6">
                <Award className="w-4 h-4 text-[var(--color-accent)]" />
                ATS Optimization Score
              </h3>
              <div className="relative w-32 h-32 mx-auto mb-8">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-border)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-accent)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(atsScore / 100) * 264} 264`} className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-heading font-bold text-[var(--color-accent)]">{atsScore}%</span>
                  <span className="text-[10px] text-[var(--color-text-muted)] font-medium uppercase tracking-tighter">Strength</span>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Identity Details", filled: !!formData.name && !!formData.email, weight: 20 },
                  { label: "Target Role Alignment", filled: !!formData.careerIntent, weight: 10 },
                  { label: "Summary Quality", filled: formData.summary.length > 80, weight: 15 },
                  { label: "Work History", filled: formData.experience.some(e => e.company && e.description.length > 50), weight: 25 },
                  { label: "Technical Skills", filled: formData.skills.filter(Boolean).length >= 5, weight: 20 },
                  { label: "Project Portfolio", filled: formData.projects.some(p => p.name), weight: 10 },
                ].map((item) => (
                  <div key={item.label} className="group cursor-help">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[11px] font-medium transition-colors ${item.filled ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}`}>{item.label}</span>
                      {item.filled ? (
                        <div className="bg-[var(--color-success)]/10 p-0.5 rounded-full">
                          <Check className="w-3 h-3 text-[var(--color-success)]" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-[var(--color-text-muted)] font-mono">+ {item.weight}% potential</span>
                      )}
                    </div>
                    <div className="h-1 w-full bg-[var(--color-border)] rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-500 ${item.filled ? "bg-[var(--color-success)] w-full" : "bg-[var(--color-text-muted)]/20 w-1"}`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 rounded-lg bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/10">
                <p className="text-[10px] leading-relaxed text-[var(--color-text-secondary)] italic">
                  <strong>Pro Tip:</strong> Reaching a score of 80%+ significantly increases your chances of passing automated recruitment filters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
