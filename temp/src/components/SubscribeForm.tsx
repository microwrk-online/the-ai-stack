"use client";
import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: Send email to backend here
    setEmail("");
    setStatus("success");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center gap-4"
    >
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 bg-[#1a1a2e] text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
      >
        Subscribe
      </button>
      {status === "success" && (
        <p className="text-green-400 text-sm mt-2 sm:ml-2">You're in! 💌</p>
      )}
    </form>
  );
}
