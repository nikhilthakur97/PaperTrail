"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"email" | "password" | "signup">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResendLink, setShowResendLink] = useState(false);
  const [resending, setResending] = useState(false);

  // Check for verification success or signup redirect
  useEffect(() => {
    const verified = searchParams.get("verified");
    const emailParam = searchParams.get("email");
    const verifyToken = searchParams.get("verify");
    
    // Handle signup redirect
    if (verified === "false" && emailParam) {
      setSuccessMessage("Account created! Please check your email to verify your account.");
      setEmail(decodeURIComponent(emailParam));
    }

    // Handle email verification from link
    if (verifyToken) {
      handleEmailVerification(verifyToken);
    }
  }, [searchParams]);

  // Verify email from token in URL
  const handleEmailVerification = async (token: string) => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("✅ Email verified successfully! You can now sign in.");
        setError("");
        // Remove the token from URL
        window.history.replaceState({}, "", "/login");
      } else {
        setError(data.error || "Failed to verify email. The link may have expired.");
      }
    } catch {
      setError("Something went wrong during verification.");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Check if email exists
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.exists) {
        if (data.hasPassword && !data.isVerified) {
          // User exists but email not verified
          setError(data.message);
          setShowResendLink(true);
        } else if (data.hasPassword && data.isVerified) {
          // User has password and is verified, proceed to password step
          setStep("password");
          setShowResendLink(false);
        } else {
          // OAuth-only user
          setError(data.message);
          setShowResendLink(false);
        }
      } else {
        // No account found - transition to signup
        setStep("signup");
        setError("");
        setShowResendLink(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Sign in with password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid password. Please try again.");
      } else {
        // Success! Redirect to dashboard/chat
        router.push("/chat");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Sign up new user
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Create account
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        setLoading(false);
        return;
      }

      // Account created successfully - redirect to verification notice
      router.push(`/login?verified=false&email=${encodeURIComponent(email)}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const handleResendVerification = async () => {
    setResending(true);
    setError("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Verification email sent! Please check your inbox.");
        setShowResendLink(false);
      } else {
        setError(data.error || "Failed to send verification email.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/chat" });
    } catch {
      setError("Failed to sign in with Google");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - App Showcase */}
      <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-primary/10 via-chart-1/10 to-chart-3/10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-chart-1/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-lg space-y-8">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="PaperTrail Logo" 
              width={48} 
              height={48}
              className="square-md"
            />
            <h1 className="text-4xl font-bold">PaperTrail</h1>
          </div>

          <h2 className="text-3xl font-semibold leading-tight">
            Research-Grounded Conversations with AI
          </h2>

          <p className="text-lg text-muted-foreground">
            Get instant, citation-backed answers from millions of research papers across PubMed and arXiv.
          </p>

          {/* Feature Highlights */}
          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-1/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🧠</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">RAG-Powered Accuracy</h3>
                <p className="text-sm text-muted-foreground">
                  Every answer is grounded in real research papers with full citations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-2/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real-Time Streaming</h3>
                <p className="text-sm text-muted-foreground">
                  Watch answers appear instantly with beautiful Markdown formatting.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-3/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📥</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Export Everything</h3>
                <p className="text-sm text-muted-foreground">
                  Download answers as PDF, get references as CSV, and bundle source papers.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 pt-6">
            <div>
              <div className="text-2xl font-bold">35M+</div>
              <div className="text-sm text-muted-foreground">PubMed Papers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">2M+</div>
              <div className="text-sm text-muted-foreground">arXiv Preprints</div>
            </div>
            <div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm text-muted-foreground">Cited Sources</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Image 
              src="/logo.png" 
              alt="PaperTrail Logo" 
              width={32} 
              height={32}
              className="square-md"
            />
            <span className="text-2xl font-bold">PaperTrail</span>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="text-muted-foreground">
              Sign in to continue your research journey
            </p>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>{step === "signup" ? "Create Account" : "Sign In"}</CardTitle>
              <CardDescription>
                {step === "email" 
                  ? "Enter your email to get started"
                  : step === "password"
                  ? "Enter your password to continue"
                  : "Create your account to get started"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Success Message */}
              {successMessage && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
                  {successMessage}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                  {showResendLink && (
                    <div className="mt-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResendVerification}
                        disabled={resending}
                        className="w-full"
                      >
                        {resending ? "Sending..." : "Resend Verification Email"}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Email Step */}
              {step === "email" && (
                <form onSubmit={handleEmailSubmit} className="space-y-4 animate-in fade-in slide-in-from-left-5 duration-300">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Checking..." : "Continue"}
                  </Button>
                </form>
              )}

              {/* Password Step */}
              {step === "password" && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-5 duration-300">
                  <div className="space-y-2">
                    <label htmlFor="email-display" className="text-sm font-medium">
                      Email
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="email-display"
                        type="email"
                        value={email}
                        disabled
                        className="bg-muted"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setStep("email");
                          setPassword("");
                          setError("");
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              )}

              {/* Signup Step */}
              {step === "signup" && (
                <form onSubmit={handleSignupSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-5 duration-300">
                  <div className="space-y-2">
                    <label htmlFor="email-signup" className="text-sm font-medium">
                      Email
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="email-signup"
                        type="email"
                        value={email}
                        disabled
                        className="bg-muted"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setStep("email");
                          setName("");
                          setPassword("");
                          setConfirmPassword("");
                          setError("");
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password-signup" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="password-signup"
                      type="password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={8}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              )}

              {/* Divider */}
              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  OR
                </span>
              </div>

              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              {/* Sign Up/Sign In Link */}
              {step !== "signup" && (
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Don&apos;t have an account? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setEmail("");
                      setPassword("");
                      setError("");
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    Enter your email above
                  </button>
                </div>
              )}
              {step === "signup" && (
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setName("");
                      setPassword("");
                      setConfirmPassword("");
                      setError("");
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Back to home */}
          <div className="text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
