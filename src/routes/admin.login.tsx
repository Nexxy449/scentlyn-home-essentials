import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resetting, setResetting] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || resetting) return;

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !data.user) {
        setError("Invalid email or password.");
        return;
      }

      const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

      if (adminError) {
        console.error("Admin authorization check failed:", adminError);
        await supabase.auth.signOut({ scope: "local" });
        setError("Unable to verify administrator access. Please try again.");
        return;
      }

      if (!isAdmin) {
        await supabase.auth.signOut({ scope: "local" });
        setError("You do not have administrator access.");
        return;
      }

      await navigate({ to: "/admin", replace: true });
    } catch (unexpectedError) {
      console.error("Admin login failed:", unexpectedError);
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    if (loading || resetting) return;
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Enter your admin email first, then choose Forgot password.");
      return;
    }

    setError("");
    setMessage("");
    setResetting(true);

    try {
      const redirectTo = `${window.location.origin}/admin/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, { redirectTo });

      if (resetError) {
        console.error("Admin password reset request failed:", resetError);
        setError("Unable to send the reset email. Please check the email address and try again.");
        return;
      }

      setMessage("If that email belongs to an administrator, a password reset link has been sent.");
    } catch (unexpectedError) {
      console.error("Admin password reset failed:", unexpectedError);
      setError("Unable to send the reset email. Please try again.");
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">SCENTLYN</h1>
          <p className="mt-2 text-sm text-slate-500">Administrator login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-sm font-medium">Email</label>
            <input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" required className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300" autoComplete="email" />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-medium">Password</label>
            <input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300" autoComplete="current-password" />
            <button type="button" onClick={() => void handlePasswordReset()} disabled={loading || resetting} className="mt-2 text-sm font-medium text-slate-600 underline-offset-4 hover:underline disabled:opacity-50">
              {resetting ? "Sending reset link…" : "Forgot password?"}
            </button>
          </div>
          {error && <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {message && <div role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
          <button type="submit" disabled={loading || resetting} className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-50">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}