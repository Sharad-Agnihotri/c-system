"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import Logo from "@/components/shared/Logo";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirm: false,
  });

  const nameError = touched.name && name.length < 2 ? "Name is required" : "";
  const emailError = touched.email && !email.includes("@") ? "Enter a valid email" : "";
  const passwordError = touched.password && password.length < 8 ? "Minimum 8 characters" : "";
  const confirmError =
    touched.confirm && password !== confirmPassword ? "Passwords don't match" : "";

  // Password strength
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "var(--color-border)",
    "var(--color-danger)",
    "var(--color-warning)",
    "var(--color-accent)",
    "var(--color-success)",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setTouched({ name: true, email: true, password: true, confirm: true });

    if (name.length < 2 || !email.includes("@") || password.length < 8 || password !== confirmPassword) return;

    await register(name, email, password);
    if (useAuthStore.getState().isAuthenticated) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--color-accent)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[420px] animate-fade-in-scale">
        <div className="flex justify-center mb-12">
          <Logo size="lg" />
        </div>

        <div className="card-elevated p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-heading font-bold">Create your account</h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Start your career transformation today
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[var(--color-danger-muted)] border border-[var(--color-danger)]/20 text-[var(--color-danger)] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError(); }}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  placeholder="John Doe"
                  className={`input ${nameError ? "input-error" : ""}`}
                />
              </div>
              {nameError && <p className="text-xs text-[var(--color-danger)] mt-1">{nameError}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  placeholder="you@example.com"
                  className={`input ${emailError ? "input-error" : ""}`}
                  autoComplete="email"
                />
              </div>
              {emailError && <p className="text-xs text-[var(--color-danger)] mt-1">{emailError}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder="••••••••"
                  className={`input pr-10 ${passwordError ? "input-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && <p className="text-xs text-[var(--color-danger)] mt-1">{passwordError}</p>}

              {/* Strength meter */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-colors duration-300"
                        style={{
                          backgroundColor: strength >= level ? strengthColors[strength] : "var(--color-border)",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs mt-1" style={{ color: strengthColors[strength] }}>
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}

              {/* Requirements */}
              <div className="mt-2 space-y-1">
                {[
                  { label: "8+ characters", met: password.length >= 8 },
                  { label: "Uppercase letter", met: /[A-Z]/.test(password) },
                  { label: "Number", met: /[0-9]/.test(password) },
                  { label: "Special character", met: /[^A-Za-z0-9]/.test(password) },
                ].map(({ label, met }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Check
                      className="w-3 h-3"
                      style={{
                        color: met ? "var(--color-success)" : "var(--color-text-muted)",
                      }}
                    />
                    <span
                      className="text-xs"
                      style={{
                        color: met ? "var(--color-success)" : "var(--color-text-muted)",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
                  onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                  placeholder="••••••••"
                  className={`input ${confirmError ? "input-error" : ""}`}
                />
              </div>
              {confirmError && <p className="text-xs text-[var(--color-danger)] mt-1">{confirmError}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 mt-2">
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[var(--color-accent)] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
