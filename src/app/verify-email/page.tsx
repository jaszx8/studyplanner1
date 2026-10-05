"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    if (code.length !== 6) {
      setMessage("Please enter the 6-digit verification code.");
      return;
    }

    setVerified(true);
    setMessage("Email verified successfully!");

    setTimeout(() => {
      router.push("/setup");
    }, 1000);
  };

  const resendCode = () => {
    setMessage("A new verification code has been sent to your email.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold">
            S
          </div>

          <h1 className="text-2xl font-bold">
            Verify your email
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            We sent a 6-digit verification code to your email address.
          </p>
        </div>

        <label className="mb-2 block text-sm font-medium text-slate-300">
          Verification Code
        </label>

        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/\D/g, ""))
          }
          placeholder="Enter 6-digit code"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-center text-lg tracking-[0.4em] outline-none transition focus:border-blue-500"
        />

        <button
          onClick={handleVerify}
          disabled={verified}
          className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {verified ? "Email Verified ✓" : "Verify Email"}
        </button>

        <button
          onClick={resendCode}
          className="mt-4 w-full text-sm text-blue-400 hover:text-blue-300"
        >
          Resend verification code
        </button>

        {message && (
          <p className="mt-5 text-center text-sm text-slate-300">
            {message}
          </p>
        )}

        <button
          onClick={() => router.push("/login")}
          className="mt-6 w-full text-sm text-slate-500 hover:text-slate-300"
        >
          ← Back to Login
        </button>
      </div>
    </main>
  );
}