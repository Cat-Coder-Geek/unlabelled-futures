import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Settings = {
  theme: "light" | "dark" | "system";
  fontScale: number;
  reducedMotion: boolean;
  highContrast: boolean;
  lang: "en" | "ar";
  notifications: boolean;
  emailAnnouncements: boolean;
  emailReportUpdates: boolean;
  newsletter: boolean;
  analyticsConsent: boolean;
  defaultAnonymous: boolean;
};

export const defaultSettings: Settings = {
  theme: "system",
  fontScale: 1,
  reducedMotion: false,
  highContrast: false,
  lang: "en",
  notifications: false,
  emailAnnouncements: false,
  emailReportUpdates: true,
  newsletter: false,
  analyticsConsent: false,
  defaultAnonymous: true,
};

const KEY = "unlabelled.settings.v1";

type Ctx = { settings: Settings; update: (p: Partial<Settings>) => void; reset: () => void; resolvedDark: boolean };
const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSettings({ ...defaultSettings, ...JSON.parse(raw) });
    } catch {}
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const on = () => setSystemDark(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const resolvedDark = settings.theme === "dark" || (settings.theme === "system" && systemDark);

  useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle("dark", resolvedDark);
    el.classList.toggle("reduce-motion", settings.reducedMotion);
    el.classList.toggle("high-contrast", settings.highContrast);
    el.style.setProperty("--font-scale", String(settings.fontScale));
    el.lang = settings.lang;
    el.dir = settings.lang === "ar" ? "rtl" : "ltr";
  }, [settings, resolvedDark]);

  const update = (p: Partial<Settings>) =>
    setSettings((s) => {
      const n = { ...s, ...p };
      try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {}
      return n;
    });
  const reset = () => { try { localStorage.removeItem(KEY); } catch {} setSettings(defaultSettings); };

  return <SettingsContext.Provider value={{ settings, update, reset, resolvedDark }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const c = useContext(SettingsContext);
  if (!c) throw new Error("useSettings outside provider");
  return c;
}
