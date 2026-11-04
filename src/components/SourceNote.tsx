import type { Source } from "@/lib/data";

export function SourceNote({ source, status }: { source: Source; status?: "reference" | "unavailable" | "platform" }) {
  return (
    <p className="mt-4 border-t border-border pt-3 text-[0.7rem] leading-relaxed text-muted-foreground">
      <span className="eyebrow me-2 text-foreground/70">Source</span>
      {source.dataset} · {source.authority} · {source.year} · {source.coverage} ·{" "}
      <a href={source.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground">
        View original data ↗
      </a>
      {status === "reference" && (
        <span className="ms-2 inline-block border border-border px-1.5 py-0.5 text-[0.6rem] uppercase tracking-widest">
          Reference figure · verify against publication
        </span>
      )}
    </p>
  );
}
