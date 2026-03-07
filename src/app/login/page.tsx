"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid credentials.");
    } else {
      toast.success("Login successful!");
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass p-8 rounded-xl border border-border w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair font-bold text-accent mb-2">RE.</h1>
          <p className="text-text-muted">Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-text">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface border border-border rounded px-4 py-3 focus:outline-none focus:border-accent text-text transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-border rounded px-4 py-3 focus:outline-none focus:border-accent text-text transition-colors"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-accent text-bg font-bold py-3 rounded hover:bg-accent-2 transition-colors disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
