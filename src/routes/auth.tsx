import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — UNLABELLED" },
      { name: "description", content: "Sign in to UNLABELLED." },
      { property: "og:title", content: "Sign in — UNLABELLED" },
      { property: "og:description", content: "Access your UNLABELLED account." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null);
    if (mode === "up") {
      const { error } = await supabase.auth.signUp({ email, password: pw, options: { emailRedirectTo: window.location.origin } });
      setMsg(error ? error.message : "Check your email to confirm your account.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      if (error) setMsg(error.message); else nav({ to: "/" });
    }
  };
  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <h1 className="font-display text-5xl">{mode === "in" ? "Sign in" : "Create account"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">An account is optional — reporting and ECHO work without one.</p>
      <form onSubmit={submit} className="mt-10 space-y-5">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" aria-label="Email" className="w-full border-b border-input bg-transparent py-3 outline-none" />
        <input type="password" required minLength={8} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" aria-label="Password" className="w-full border-b border-input bg-transparent py-3 outline-none" />
        {msg && <p role="alert" className="text-sm">{msg}</p>}
        <button className="w-full bg-primary py-4 text-sm text-primary-foreground">{mode === "in" ? "Sign in" : "Sign up"}</button>
      </form>
      <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-6 text-sm underline">{mode === "in" ? "Need an account? Sign up" : "Have an account? Sign in"}</button>
    </div>
  );
}
