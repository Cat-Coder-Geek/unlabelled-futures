import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useSettings } from "@/lib/settings";
import { useT, type TKey } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const NAV: { to: "/" | "/dashboard" | "/break-the-bias" | "/explore" | "/speak-up" | "/settings"; k: TKey }[] = [
  { to: "/", k: "home" },
  { to: "/dashboard", k: "dashboard" },
  { to: "/break-the-bias", k: "bias" },
  { to: "/explore", k: "explore" },
  { to: "/speak-up", k: "speak" },
  { to: "/settings", k: "settings" },
];

export function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2" aria-label="UNLABELLED home">
      <span className="relative inline-block h-6 w-6 rounded-full bg-iridescent animate-shimmer">
        <span className="absolute inset-[5px] rounded-full bg-background" />
      </span>
      <span className="text-sm font-bold tracking-[0.32em]">UNLABELLED</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { update, resolvedDark } = useSettings();
  const t = useT();
  const { user } = useAuth();

  const linkCls = "relative py-1 text-[0.78rem] tracking-wide text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:after:absolute data-[status=active]:after:-bottom-1 data-[status=active]:after:start-0 data-[status=active]:after:h-px data-[status=active]:after:w-full data-[status=active]:after:bg-iridescent";

  return (
    <header className="glass sticky top-0 z-50 border-b border-border">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 bg-background px-3 py-2">Skip to content</a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={linkCls} activeOptions={{ exact: n.to === "/" }}>{t(n.k)}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => update({ theme: resolvedDark ? "light" : "dark" })}
            className="rounded-full p-2 hover:bg-muted"
            aria-label={resolvedDark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {resolvedDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <button onClick={() => supabase.auth.signOut()} className="hidden text-xs tracking-wide text-muted-foreground hover:text-foreground sm:block">{t("signout")}</button>
          ) : (
            <Link to="/auth" className="hidden text-xs tracking-wide text-muted-foreground hover:text-foreground sm:block">{t("signin")}</Link>
          )}
          <button className="rounded-full p-2 hover:bg-muted lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border px-6 py-6 lg:hidden" aria-label="Mobile">
          <ul className="space-y-4">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} onClick={() => setOpen(false)} activeOptions={{ exact: n.to === "/" }} className="font-display text-3xl text-muted-foreground data-[status=active]:text-foreground">{t(n.k)}</Link>
              </li>
            ))}
            <li>
              {user ? (
                <button onClick={() => { supabase.auth.signOut(); setOpen(false); }} className="text-sm">{t("signout")}</button>
              ) : (
                <Link to="/auth" onClick={() => setOpen(false)} className="text-sm">{t("signin")}</Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
