
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [cooldown, setCooldown] = useState(0);

  // Check if user is already logged in
  useEffect(() => {
    const authenticated = localStorage.getItem(
      "studyplanner-authenticated"
    );

    const savedEmail = localStorage.getItem("studyplanner-email");

    if (authenticated === "true") {
      if (savedEmail) {
        setEmail(savedEmail);
      }

      router.replace("/setup");
    }
  }, [router]);

  // OTP resend countdown
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const validateLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return false;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    return true;
  };

  const sendOtp = async () => {
    setError("");
    setSuccess("");

    if (!validateLogin()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to send OTP.");
        return;
      }

      setOtpSent(true);
      setCooldown(30);
      setSuccess(`OTP sent to ${email}`);
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError("");
    setSuccess("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid OTP.");
        return;
      }

      // Save login state
      localStorage.setItem(
        "studyplanner-authenticated",
        "true"
      );

      localStorage.setItem(
        "studyplanner-user-email",
        email
      );

      // Remember email if selected
      if (rememberMe) {
        localStorage.setItem(
          "studyplanner-email",
          email
        );
      }

      setSuccess("Email verified successfully!");

      // Go to 5-question setup
      setTimeout(() => {
        router.replace("/setup");
      }, 500);
    } catch {
      setError("Unable to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (cooldown > 0 || resending) return;

    setError("");
    setSuccess("");
    setResending(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to resend OTP.");
        return;
      }

      setCooldown(30);
      setSuccess("A new OTP has been sent to your email.");
      setOtp("");
    } catch {
      setError("Unable to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[90vh] max-w-5xl items-center justify-center">
        <div className="w-full max-w-2xl">

          {/* Brand */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold shadow-lg shadow-blue-600/20">
              S
            </div>

            <h1 className="mt-5 text-3xl font-bold">
              StudyPlanner AI
            </h1>

            <p className="mt-2 text-slate-400">
              Your Personal AI Study Guide
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Learn smarter. Plan better. Stay consistent.
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-2xl sm:p-9">

            {!otpSent ? (
              <>
                <div className="mb-7">
                  <h2 className="text-2xl font-bold">
                    Welcome back 👋
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Enter your details and we'll send a verification code
                    to your email.
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Password */}
                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-20 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-white"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <div className="mt-5">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) =>
                        setRememberMe(e.target.checked)
                      }
                      className="h-4 w-4 rounded"
                    />

                    Remember me
                  </label>
                </div>

                {error && (
                  <div className="mt-5 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading}
                  className="mt-7 w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Sending OTP..."
                    : "Continue with Email →"}
                </button>

                <div className="mt-6 rounded-xl border border-blue-900/50 bg-blue-950/30 p-4">
                  <p className="text-sm font-medium text-blue-300">
                    📧 Email verification
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    A 6-digit verification code will be sent to your Gmail
                    address.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="mb-7">
                  <h2 className="text-2xl font-bold">
                    Verify your email 📩
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    We've sent a 6-digit verification code to
                  </p>

                  <p className="mt-1 font-medium text-blue-400">
                    {email}
                  </p>
                </div>

                {/* OTP */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Enter OTP
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder="000000"
                    autoComplete="one-time-code"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {error && (
                  <div className="mt-5 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mt-5 rounded-xl border border-green-900 bg-green-950/40 p-4 text-sm text-green-300">
                    {success}
                  </div>
                )}

                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={
                    loading || otp.length !== 6
                  }
                  className="mt-7 w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Verifying..."
                    : "Verify OTP →"}
                </button>

                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={
                      cooldown > 0 || resending
                    }
                    className="text-sm text-blue-400 hover:text-blue-300 disabled:cursor-not-allowed disabled:text-slate-600"
                  >
                    {resending
                      ? "Sending..."
                      : cooldown > 0
                        ? `Resend OTP in ${cooldown}s`
                        : "Resend OTP"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setError("");
                    setSuccess("");
                  }}
                  className="mt-4 w-full text-sm text-slate-500 hover:text-white"
                >
                  ← Change email
                </button>
              </>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            StudyPlanner AI • Personal Learning & Guidance Platform
          </p>
        </div>
      </div>
    </main>
  );
}
