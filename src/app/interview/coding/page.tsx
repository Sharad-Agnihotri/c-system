"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useInterviewStore } from "@/stores/useInterviewStore";
import PageHeader from "@/components/shared/PageHeader";
import {
  Code2,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Terminal,
  Sparkles,
  RefreshCw,
  ShieldAlert,
  XCircle,
  Loader2,
} from "lucide-react";

interface TestCase {
  input: any[];
  expected: any;
}

interface TestResult {
  input: any[];
  expected: any;
  actual: any;
  passed: boolean;
  error?: string;
  time: number;
}

interface CodingProblem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  functionName: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: string;
  testCases: TestCase[];
}

const fallbackProblems: CodingProblem[] = [
  {
    id: 1, title: "Two Sum", difficulty: "Easy",
    functionName: "twoSum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Only one valid answer exists"],
    starterCode: "function twoSum(nums, target) {\n  // Your solution here\n  \n}",
    testCases: [
      { input: [[2,7,11,15], 9], expected: [0,1] },
      { input: [[3,2,4], 6], expected: [1,2] },
      { input: [[3,3], 6], expected: [0,1] },
      { input: [[1,5,8,3], 4], expected: [0,3] },
    ],
  },
  {
    id: 2, title: "Valid Parentheses", difficulty: "Medium",
    functionName: "isValid",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if every open bracket is closed by the same type of bracket in the correct order.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only"],
    starterCode: "function isValid(s) {\n  // Your solution here\n  \n}",
    testCases: [
      { input: ["()"], expected: true },
      { input: ["()[]{}"], expected: true },
      { input: ["(]"], expected: false },
      { input: ["([)]"], expected: false },
      { input: ["{[]}"], expected: true },
    ],
  },
  {
    id: 3, title: "Maximum Subarray", difficulty: "Hard",
    functionName: "maxSubArray",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6" },
      { input: "nums = [1]", output: "1" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    starterCode: "function maxSubArray(nums) {\n  // Your solution here\n  \n}",
    testCases: [
      { input: [[-2,1,-3,4,-1,2,1,-5,4]], expected: 6 },
      { input: [[1]], expected: 1 },
      { input: [[5,4,-1,7,8]], expected: 23 },
      { input: [[-1]], expected: -1 },
      { input: [[-2,-1]], expected: -1 },
    ],
  },
];

const difficultyColors: Record<string, string> = {
  Easy: "var(--color-success)",
  Medium: "var(--color-accent)",
  Hard: "var(--color-danger)",
};

export default function CodingPage() {
  const router = useRouter();
  const { finishRound } = useInterviewStore();
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [currentP, setCurrentP] = useState(0);
  const [codes, setCodes] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<(TestResult[] | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [showResult, setShowResult] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [pasteAttempts, setPasteAttempts] = useState(0);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const fetchProblems = async () => {
    setIsGenerating(true);
    setCurrentP(0);
    setShowResult(false);
    setPasteAttempts(0);
    try {
      const res = await fetch("/api/interview/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ round: "coding" }),
      });
      const data = await res.json();
      if (data.questions?.length > 0 && data.questions[0].testCases) {
        setProblems(data.questions);
        setCodes(data.questions.map((p: CodingProblem) => p.starterCode));
        setTestResults(Array(data.questions.length).fill(null));
      } else {
        setProblems(fallbackProblems);
        setCodes(fallbackProblems.map((p) => p.starterCode));
        setTestResults(Array(fallbackProblems.length).fill(null));
      }
    } catch {
      setProblems(fallbackProblems);
      setCodes(fallbackProblems.map((p) => p.starterCode));
      setTestResults(Array(fallbackProblems.length).fill(null));
    }
    setTimeLeft(60 * 60);
    setIsGenerating(false);
  };

  useEffect(() => { fetchProblems(); }, []);

  // Timer
  useEffect(() => {
    if (showResult || isGenerating || problems.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showResult, isGenerating, problems.length]);

  // Block paste, copy, cut on the editor
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const blockPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      setPasteAttempts((prev) => prev + 1);
    };

    const blockCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    const blockDrop = (e: DragEvent) => {
      e.preventDefault();
    };

    editor.addEventListener("paste", blockPaste);
    editor.addEventListener("copy", blockCopy);
    editor.addEventListener("cut", blockCopy);
    editor.addEventListener("drop", blockDrop);

    return () => {
      editor.removeEventListener("paste", blockPaste);
      editor.removeEventListener("copy", blockCopy);
      editor.removeEventListener("cut", blockCopy);
      editor.removeEventListener("drop", blockDrop);
    };
  }, [currentP, isGenerating]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // ── Run code against test cases ──
  const handleRunCode = async () => {
    if (problems.length === 0) return;
    setIsRunning(true);

    const problem = problems[currentP];
    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codes[currentP],
          functionName: problem.functionName,
          testCases: problem.testCases,
        }),
      });

      const data = await res.json();
      if (data.results) {
        const copy = [...testResults];
        copy[currentP] = data.results;
        setTestResults(copy);
      }
    } catch (err) {
      console.error("Run failed:", err);
      const copy = [...testResults];
      copy[currentP] = problem.testCases.map((tc) => ({
        input: tc.input,
        expected: tc.expected,
        actual: null,
        passed: false,
        error: "Failed to connect to execution server",
        time: 0,
      }));
      setTestResults(copy);
    }
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setShowResult(true);
    await finishRound();
  };

  // ── Loading state ──
  if (isGenerating) {
    return (
      <div className="max-w-3xl mx-auto">
        <PageHeader title="Coding Round" />
        <div className="card p-12 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-info)]/10 flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-7 h-7 text-[var(--color-info)] animate-pulse" />
          </div>
          <h3 className="text-lg font-heading font-semibold mb-2">Generating Problems...</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            AI is creating unique coding challenges with test cases
          </p>
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full bg-[var(--color-info)] animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (problems.length === 0) return null;

  const problem = problems[currentP];
  const currentResults = testResults[currentP];

  // ── Results view ──
  if (showResult) {
    const problemScores = problems.map((p, i) => {
      const res = testResults[i];
      if (!res) return { passed: 0, total: p.testCases.length };
      return { passed: res.filter((r) => r.passed).length, total: res.length };
    });
    const totalPassed = problemScores.reduce((s, p) => s + p.passed, 0);
    const totalTests = problemScores.reduce((s, p) => s + p.total, 0);
    const pct = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <PageHeader title="Coding Round — Results" />
        <div className="card p-8 text-center mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border)" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke={pct >= 70 ? "var(--color-success)" : pct >= 40 ? "var(--color-accent)" : "var(--color-danger)"} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 327} 327`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-heading font-bold">{pct}%</span>
              <span className="text-xs text-[var(--color-text-muted)]">tests passed</span>
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {totalPassed} of {totalTests} test cases passed across {problems.length} problems
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {problems.map((p, i) => {
            const s = problemScores[i];
            const allPassed = s.passed === s.total && s.total > 0;
            return (
              <div key={p.id} className={`card p-5 border-l-4 ${allPassed ? "border-l-[var(--color-success)]" : "border-l-[var(--color-danger)]"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {allPassed ? <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" /> : <AlertCircle className="w-5 h-5 text-[var(--color-danger)]" />}
                    <div>
                      <p className="text-sm font-medium">{p.title}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{p.difficulty}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-mono font-medium ${allPassed ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
                    {s.passed}/{s.total} passed
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={fetchProblems} className="btn-secondary flex-1">
            <RefreshCw className="w-4 h-4" /> New Problems
          </button>
          <button onClick={() => router.push("/interview")} className="btn-primary flex-1">
            <ArrowLeft className="w-4 h-4" /> Back to Interview Hub
          </button>
        </div>
      </div>
    );
  }

  // ── Main coding view ──
  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <PageHeader title="Coding Round" />
        <div className="flex items-center gap-4">
          {pasteAttempts > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-danger)] animate-fade-in">
              <ShieldAlert className="w-4 h-4" />
              Paste blocked ({pasteAttempts}x)
            </div>
          )}
          <div className={`flex items-center gap-1.5 text-sm font-mono font-medium ${timeLeft < 600 ? "text-[var(--color-danger)]" : "text-[var(--color-text-secondary)]"}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Anti-cheat notice */}
      <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-[var(--color-danger)]/5 border border-[var(--color-danger)]/15 text-xs text-[var(--color-danger)]">
        <ShieldAlert className="w-4 h-4 flex-shrink-0" />
        <span>Copy, paste, and drag-drop are disabled in the code editor. Write your solution from scratch.</span>
      </div>

      {/* Problem tabs */}
      <div className="flex gap-2 mb-4">
        {problems.map((p, i) => {
          const res = testResults[i];
          const allPassed = res && res.length > 0 && res.every((r) => r.passed);
          return (
            <button
              key={p.id}
              onClick={() => setCurrentP(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                currentP === i
                  ? "bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] bg-[var(--color-bg-elevated)]"
              }`}
            >
              {allPassed && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)]" />}
              Problem {i + 1}
              <span className="text-xs" style={{ color: difficultyColors[p.difficulty] }}>
                ({p.difficulty})
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem description */}
        <div className="card p-8 overflow-y-auto max-h-[700px] animate-fade-in" key={`desc-${currentP}`}>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-heading font-semibold">{problem.title}</h2>
            <span className="badge text-xs" style={{ backgroundColor: difficultyColors[problem.difficulty] + "20", color: difficultyColors[problem.difficulty] }}>
              {problem.difficulty}
            </span>
          </div>

          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
            {problem.description}
          </p>

          <div className="space-y-3 mb-4">
            {problem.examples.map((ex, i) => (
              <div key={i} className="p-3 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)]">
                <p className="text-xs font-medium text-[var(--color-text-muted)] mb-1">Example {i + 1}</p>
                <p className="text-xs font-mono text-[var(--color-text-secondary)]">Input: {ex.input}</p>
                <p className="text-xs font-mono text-[var(--color-text-secondary)]">Output: {ex.output}</p>
                {ex.explanation && (
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{ex.explanation}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mb-4">
            <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">Constraints</p>
            <ul className="space-y-1">
              {problem.constraints.map((c, i) => (
                <li key={i} className="text-xs text-[var(--color-text-muted)] font-mono">• {c}</li>
              ))}
            </ul>
          </div>

          {/* Test case count */}
          <div className="pt-4 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)]">
              <Code2 className="w-3 h-3 inline mr-1" />
              {problem.testCases.length} test cases will be run against your solution
            </p>
          </div>
        </div>

        {/* Code editor + output */}
        <div className="flex flex-col gap-4">
          <div className="card flex flex-col overflow-hidden animate-fade-in stagger-1">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)]">
              <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5">
                <Code2 className="w-3 h-3" /> JavaScript
              </span>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="btn-primary text-xs py-1.5 px-4"
              >
                {isRunning ? (
                  <><Loader2 className="w-3 h-3 animate-spin" /> Running...</>
                ) : (
                  <><Play className="w-3 h-3" /> Run Code</>
                )}
              </button>
            </div>
            <textarea
              ref={editorRef}
              className="flex-1 min-h-[300px] p-4 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-mono text-sm resize-none outline-none"
              value={codes[currentP]}
              onChange={(e) => {
                const copy = [...codes];
                copy[currentP] = e.target.value;
                setCodes(copy);
              }}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              data-gramm="false"
            />
          </div>

          {/* Test Results */}
          <div className="card p-4 animate-fade-in stagger-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[var(--color-text-muted)]" />
                <span className="text-xs font-medium text-[var(--color-text-muted)]">Test Results</span>
              </div>
              {currentResults && (
                <span className={`text-xs font-mono font-medium ${
                  currentResults.every((r) => r.passed) ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
                }`}>
                  {currentResults.filter((r) => r.passed).length}/{currentResults.length} passed
                </span>
              )}
            </div>

            {!currentResults ? (
              <p className="text-xs text-[var(--color-text-muted)] font-mono py-4 text-center">
                Click "Run Code" to test your solution against {problem.testCases.length} test cases
              </p>
            ) : (
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {currentResults.map((r, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border text-xs font-mono ${
                      r.passed
                        ? "bg-[var(--color-success)]/5 border-[var(--color-success)]/20"
                        : "bg-[var(--color-danger)]/5 border-[var(--color-danger)]/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5 font-medium">
                        {r.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)]" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-[var(--color-danger)]" />
                        )}
                        Test Case {i + 1}
                      </span>
                      <span className="text-[var(--color-text-muted)]">{r.time}ms</span>
                    </div>
                    <div className="space-y-0.5 text-[var(--color-text-secondary)]">
                      <p>Input: {JSON.stringify(r.input)}</p>
                      <p>Expected: <span className="text-[var(--color-success)]">{JSON.stringify(r.expected)}</span></p>
                      {!r.passed && (
                        <p>
                          Got: <span className="text-[var(--color-danger)]">
                            {r.error ? r.error : JSON.stringify(r.actual)}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end mt-4">
        <button onClick={handleSubmit} className="btn-primary">
          Submit All Solutions
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
