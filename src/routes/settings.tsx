import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useSettings, type Settings } from "@/lib/settings";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — UNLABELLED" },
      { name: "description", content: "Theme, accessibility, language, notifications and privacy preferences." },
      { property: "og:title", content: "Settings — UNLABELLED" },
      { property: "og:description", content: "Personalise your UNLABELLED experience." },
    ],
  }),
  component: SettingsPage,
});

function Toggle({ k, label, hint }: { k: keyof Settings; label: string; hint?: string }) {
  const { settings, update } = useSettings();
  const on = Boolean(settings[k]);
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div><div>{label}</div>{hint && <div className="text-xs text-muted-foreground">{hint}</div>}</div>
      <button role="switch" aria-checked={on} aria-label={label} onClick={() => update({ [k]: !on } as Partial<Settings>)}
        className={`relative h-6 w-11 rounded-full transition ${on ? "bg-iridescent" : "bg-muted"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-all ${on ? "start-5" : "start-0.5"}`} />
      </button>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-border py-12 md:grid-cols-[240px_1fr]">
      <h2 className="font-display text-3xl">{title}</h2>
      <div className="divide-y divide-border">{children}</div>
    </section>
  );
}

function SettingsPage() {
  const { settings, update, reset } = useSettings();
  const { user } = useAuth();
  const seg = (active: boolean) => `border px-4 py-2 text-sm ${active ? "border-foreground bg-foreground text-background" : "border-border"}`;
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="eyebrow text-muted-foreground">Settings</div>
      <h1 className="font-display mt-4 text-6xl">Make it yours.</h1>
      <p className="mt-4 text-sm text-muted-foreground">Preferences are saved on this device and persist after refresh.</p>

      <Group title="Appearance">
        <div className="flex flex-wrap gap-2 py-4">
          {(["light", "dark", "system"] as const).map((t) => <button key={t} onClick={() => update({ theme: t })} aria-pressed={settings.theme === t} className={seg(settings.theme === t)}>{t[0].toUpperCase() + t.slice(1)}</button>)}
        </div>
      </Group>

      <Group title="Accessibility">
        <div className="py-4">
          <label htmlFor="fs">Font size: {Math.round(settings.fontScale * 100)}%</label>
          <input id="fs" type="range" min={0.875} max={1.375} step={0.125} value={settings.fontScale} onChange={(e) => update({ fontScale: Number(e.target.value) })} className="mt-2 block w-full max-w-sm" />
        </div>
        <Toggle k="reducedMotion" label="Reduced motion" hint="Turns off animations and transitions." />
        <Toggle k="highContrast" label="High contrast" />
        <div className="py-4 text-xs text-muted-foreground">Keyboard navigation, skip links, ARIA labels and text descriptions for every chart are always on.</div>
      </Group>

      <Group title="Language">
        <div className="flex gap-2 py-4">
          <button onClick={() => update({ lang: "en" })} className={seg(settings.lang === "en")}>English</button>
          <button onClick={() => update({ lang: "ar" })} className={seg(settings.lang === "ar")}>العربية</button>
        </div>
        <div className="py-3 text-xs text-muted-foreground">Arabic switches the layout to right-to-left and translates navigation and key headlines.</div>
      </Group>

      <Group title="Notifications">
        <Toggle k="notifications" label="Enable notifications" />
        <Toggle k="emailAnnouncements" label="Platform announcements by email" />
        <Toggle k="emailReportUpdates" label="Reporting updates" />
        <Toggle k="newsletter" label="Newsletter opt-in" />
        <div className="py-3 text-xs text-muted-foreground">Email delivery is not yet active; these choices are stored for when it launches.</div>
      </Group>

      <Group title="Privacy">
        <Toggle k="defaultAnonymous" label="Default to anonymous reporting" />
        <Toggle k="analyticsConsent" label="Allow anonymous usage counting" hint="Platform counters store counts only — never your identity." />
        <div className="py-4 text-sm text-muted-foreground">
          We store reports only in our secured database, readable by authorised safeguarding staff. Anonymous reports keep no name, contact or account link.
        </div>
        <div className="flex flex-wrap gap-4 py-4">
          <button onClick={() => { reset(); toast.success("Local preferences cleared."); }} className="border border-border px-4 py-2 text-sm">Clear my saved data</button>
          {user ? <span className="py-2 text-sm">Signed in as {user.email}</span> : <Link to="/auth" className="border border-border px-4 py-2 text-sm">Account sign in</Link>}
        </div>
      </Group>
    </div>
  );
}
