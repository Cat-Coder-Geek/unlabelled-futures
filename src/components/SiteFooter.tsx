import { Link } from "@tanstack/react-router";
import { Logo } from "./SiteHeader";
import { useT } from "@/lib/i18n";

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="bg-navy text-ivory">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <p className="font-display max-w-4xl text-3xl leading-tight md:text-5xl">{t("footer")}</p>
        <div className="my-14 h-px bg-iridescent opacity-60" />
        <div className="grid gap-10 md:grid-cols-4">
          <div className="[&_a]:text-ivory"><Logo /><p className="mt-4 text-sm text-ivory/60">Dubai, United Arab Emirates. A Dubai – IT social-impact initiative.</p></div>
          <div>
            <div className="eyebrow mb-3 text-ivory/50">UN SDG 4</div>
            <a href="https://sdgs.un.org/goals/goal4" target="_blank" rel="noreferrer" className="text-sm hover:underline">Quality Education ↗</a>
          </div>
          <div>
            <div className="eyebrow mb-3 text-ivory/50">UN SDG 5</div>
            <a href="https://sdgs.un.org/goals/goal5" target="_blank" rel="noreferrer" className="text-sm hover:underline">Gender Equality ↗</a>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/speak-up" className="hover:underline">Speak Up</Link>
            <Link to="/settings" className="hover:underline">Privacy &amp; settings</Link>
            <span className="text-ivory/60">Emergency: Police 999 · Ambulance 998</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
