import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { echoChat } from "@/lib/echo.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/speak-up")({
  head: () => ({
    meta: [
      { title: "Speak Up with ECHO — UNLABELLED" },
      { name: "description", content: "Ask ECHO, our AI assistant, or securely report stereotyping and unfair treatment in education." },
      { property: "og:title", content: "Speak Up — UNLABELLED" },
      { property: "og:description", content: "Every Concern Has a Voice." },
    ],
  }),
  component: SpeakUp,
});

type Msg = { role: "user" | "assistant"; content: string };
const OPENING = "Hello, I'm ECHO. This is a space where your voice matters. Would you like to ask a question, share a concern, or report an experience?";
const CATS = [
  ["stereotyping", "Stereotyping"], ["discrimination", "Discrimination"], ["unfair_treatment", "Unfair educational treatment"],
  ["bullying_harassment", "Bullying or harassment"], ["other", "Other concerns"],
] as const;

function SpeakUp() {
  const chat = useServerFn(echoChat);
  const qc = useQueryClient();
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: OPENING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    const next = [...msgs, { role: "user" as const, content: text.trim() }];
    setMsgs(next); setInput(""); setBusy(true);
    const r = await chat({ data: { messages: next.slice(1) } }).catch(() => ({ text: "ECHO is unavailable right now." }));
    setMsgs([...next, { role: "assistant", content: r.text }]); setBusy(false);
  };

  const [cat, setCat] = useState<string>("stereotyping");
  const [desc, setDesc] = useState("");
  const [anon, setAnon] = useState(true);
  const [contact, setContact] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [ref, setRef] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(null);
    if (desc.trim().length < 10) return setErr("Please describe what happened (at least 10 characters).");
    if (!consent) return setErr("Please confirm you have read the privacy notice.");
    setSending(true);
    let path: string | null = null;
    if (file) {
      if (file.size > 10 * 1024 * 1024) { setSending(false); return setErr("Evidence files must be under 10 MB."); }
      path = `${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, "_")}`;
      const { error } = await supabase.storage.from("evidence").upload(path, file);
      if (error) { setSending(false); return setErr("Evidence upload failed. Try again or submit without it."); }
    }
    const { data, error } = await supabase.rpc("submit_report", { _category: cat, _description: desc.trim(), _contact: contact, _anonymous: anon, _evidence_path: path as string });
    setSending(false);
    if (error) return setErr("Your report could not be saved. Please try again.");
    setRef(data as string); qc.invalidateQueries({ queryKey: ["impact"] });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="eyebrow text-muted-foreground">Speak Up</div>
      <h1 className="font-display mt-4 text-6xl md:text-8xl">ECHO <em className="text-iridescent">— Every Concern Has a Voice.</em></h1>
      <p role="alert" className="mt-8 border-s-2 border-destructive ps-4 text-sm">
        In immediate danger? Call <strong>Dubai Police 999</strong> or <strong>Ambulance 998</strong>. ECHO and this form are not monitored in real time.
      </p>

      <section className="mt-16 grid gap-16 lg:grid-cols-2">
        <div className="flex h-[640px] flex-col border border-border glass">
          <div className="flex-1 space-y-5 overflow-y-auto p-6" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "ms-auto max-w-[80%] bg-primary px-4 py-3 text-sm text-primary-foreground" : "max-w-[90%] text-sm"}>
                {m.role === "assistant" ? <div className="prose prose-sm max-w-none dark:prose-invert [&_p]:my-1"><ReactMarkdown>{m.content}</ReactMarkdown></div> : m.content}
              </div>
            ))}
            {busy && <div className="text-xs text-muted-foreground animate-pulse">ECHO is thinking…</div>}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-2">
                {["Ask a question", "Report an incident", "Request support"].map((o) => (
                  <button key={o} onClick={() => o === "Report an incident" ? document.getElementById("report")?.scrollIntoView() : send(o)} className="border border-border px-3 py-1.5 text-xs hover:bg-muted">{o}</button>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex border-t border-border">
            <label htmlFor="echo-in" className="sr-only">Message ECHO</label>
            <input id="echo-in" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message…" className="flex-1 bg-transparent px-4 py-4 text-sm outline-none" />
            <button disabled={busy} className="bg-primary px-6 text-sm text-primary-foreground disabled:opacity-50">Send</button>
          </form>
          <p className="px-4 pb-3 text-[0.65rem] text-muted-foreground">ECHO is a live AI assistant. It can make mistakes. Chats are not saved.</p>
        </div>

        <div id="report">
          <h2 className="font-display text-4xl">Report an experience</h2>
          {ref ? (
            <div className="animate-rise mt-8 border-t border-border pt-8">
              <p className="eyebrow text-muted-foreground">Report received</p>
              <p className="font-display mt-3 text-5xl text-iridescent">{ref}</p>
              <p className="mt-4 text-sm text-muted-foreground">Keep this reference number. Your report is stored securely and visible only to authorised safeguarding staff, who review and escalate it where needed.</p>
              <button onClick={() => { setRef(null); setDesc(""); setFile(null); setConsent(false); }} className="mt-6 border-b border-foreground text-sm">Submit another report</button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-6 text-sm">
              <fieldset><legend className="eyebrow mb-3 text-muted-foreground">Category</legend>
                <div className="flex flex-wrap gap-2">{CATS.map(([v, l]) => (
                  <button type="button" key={v} onClick={() => setCat(v)} aria-pressed={cat === v} className={`border px-3 py-1.5 text-xs ${cat === v ? "border-foreground bg-foreground text-background" : "border-border"}`}>{l}</button>
                ))}</div>
              </fieldset>
              <label className="block"><span className="eyebrow text-muted-foreground">What happened?</span>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={5000} rows={6} className="mt-2 w-full border border-input bg-transparent p-3" /></label>
              <label className="block"><span className="eyebrow text-muted-foreground">Supporting evidence (optional, max 10 MB)</span>
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-2 block text-xs" /></label>
              <label className="flex items-center gap-3"><input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} /> Submit without my name or contact details</label>
              {!anon && (
                <label className="block"><span className="eyebrow text-muted-foreground">Contact (optional)</span>
                  <input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={200} className="mt-2 w-full border border-input bg-transparent p-3" /></label>
              )}
              <p className="text-xs text-muted-foreground">
                Privacy: anonymous reports store no name, contact or account link. Technical logs held by our hosting provider may still exist, so we cannot guarantee complete anonymity. Do not include others' personal data unless necessary.
              </p>
              <label className="flex items-start gap-3"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" /> I have read the privacy notice and consent to this report being reviewed by safeguarding staff.</label>
              {err && <p role="alert" className="text-destructive">{err}</p>}
              <button disabled={sending} className="bg-primary px-8 py-4 text-primary-foreground disabled:opacity-50">{sending ? "Submitting…" : "Submit report"}</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
