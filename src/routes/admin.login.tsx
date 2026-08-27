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
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setError("");
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

      // Do not query profiles directly from the browser. This project does not
      // grant authenticated users SELECT access to that table. Use the existing
      // authorization RPC, which checks auth.uid() against the admin role.
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">SCENTLYN</h1>
          <p className="mt-2 text-sm text-slate-500">Administrator login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" required className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300" />
          </div>
          {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-50">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
