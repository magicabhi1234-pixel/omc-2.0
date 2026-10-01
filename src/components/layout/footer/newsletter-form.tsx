"use client";

import { useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Status = { kind: "idle" | "loading" | "success" | "error"; message?: string };

export default function NewsletterForm() {
  const id = useId();
  const pathname = usePathname();
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus({ kind: "error", message: "Please enter a valid email address." });
      return;
    }
    setStatus({ kind: "loading" });
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pagePath: pathname, website: honeypotRef.current?.value ?? "" }),
      });
      const result = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !result.success) throw new Error(result.message);
      setEmail("");
      setStatus({ kind: "success", message: "Thanks! You're subscribed to MBA admission updates." });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error && error.message ? error.message : "Subscription failed. Please try again.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6" noValidate>
      <label htmlFor={`${id}-email`} className="text-sm font-semibold text-white">
        Get admission deadlines &amp; fee updates
      </label>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status.kind === "error") setStatus({ kind: "idle" });
          }}
          placeholder="Your email address"
          autoComplete="email"
          aria-invalid={status.kind === "error"}
          aria-describedby={status.message ? `${id}-status` : undefined}
          className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-[#C2410C]"
        />
        <button
          type="submit"
          disabled={status.kind === "loading"}
          className="cursor-pointer rounded-xl bg-[#C2410C] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status.kind === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {status.message && (
        <p
          id={`${id}-status`}
          role={status.kind === "error" ? "alert" : "status"}
          className={`mt-2 text-sm ${status.kind === "error" ? "text-red-400" : "text-green-400"}`}
        >
          {status.message}
        </p>
      )}
    </form>
  );
}
