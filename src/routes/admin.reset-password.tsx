import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/reset-password")({
  component: AdminResetPassword,
});

const MIN_PASSWORD_LENGTH = 8;

function validatePassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }

  return null;
}

function AdminResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (!mounted) return;

        if (sessionError || !data.session) {
          setError("This password reset link is invalid or has expired. Please request a new one.");
          setHasRecoverySession(false);
          return;
        }

        setHasRecoverySession(true);
      } catch (unexpectedError) {
        console.error("Password recovery session check failed:", unexpectedError);
        if (!mounted) return;
        setError("Unable to verify the password reset link. Please request a new one.");
        setHasRecoverySession(false);
      } finally {
        if (mounted) setCheckingSession(false);
      }
    }

    void checkRecoverySession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "PASSWORD_RECOVERY" && session) {
        setHasRecoverySession(true);
        setError("");
        setCheckingSession(false);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || checkingSession || !hasRecoverySession) return;

    setError("");
    setMessage("");

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        console.error("Admin password update failed:", updateError);
        setError("Unable to update your password. The reset link may have expired. Please request a new one.");
        return;
      }

      setMessage("Your password has been updated successfully. Redirecting to administrator login…");
      setPassword("");
      setConfirmation("");

      await supabase.auth.signOut({ scope: "local" });
      await navigate({ to: "/admin/login", replace: true });
    } catch (unexpectedError) {
      console.error("Admin password reset failed:", unexpectedError);
      setError("Unable to update your password. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">Verifying your password reset link…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">SCENTLYN</h1>
          <p className="mt-2 text-sm text-slate-500">Set a new administrator password</p>
        </div>

        {hasRecoverySession ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="new-admin-password" className="mb-2 block text-sm font-medium">
                New password
              </label>
              <input
                id="new-admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="New password"
                required
                minLength={MIN_PASSWORD_LENGTH}
                autoComplete="new-password"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
              />
              <p className="mt-2 text-xs text-slate-500">
                Use at least 8 characters, including uppercase, lowercase, and a number.
              </p>
            </div>

            <div>
              <label htmlFor="confirm-admin-password" className="mb-2 block text-sm font-medium">
                Confirm new password
              </label>
              <input
                id="confirm-admin-password"
                type="password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                placeholder="Confirm new password"
                required
                minLength={MIN_PASSWORD_LENGTH}
                autoComplete="new-password"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            {error && (
              <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? "Updating password…" : "Update password"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
            <button
              type="button"
              onClick={() => void navigate({ to: "/admin/login", replace: true })}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800"
            >
              Back to administrator login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
