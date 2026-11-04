import { useQuery } from "@tanstack/react-query";
import { fetchImpact } from "@/lib/impact";
import { CountUp } from "./CountUp";

export function ImpactCounter() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["impact"], queryFn: fetchImpact, refetchInterval: 30000 });
  const items = [
    ["Myths challenged", data?.myths_challenged],
    ["Stories shared", data?.stories_shared],
    ["Resources explored", data?.resources_explored],
    ["Reports submitted", data?.reports_submitted],
  ] as const;
  return (
    <div>
      <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
        {items.map(([label, v]) => (
          <div key={label} className="border-s border-border ps-5">
            <div className="font-display text-5xl md:text-6xl">
              {isLoading ? <span className="opacity-30">—</span> : isError ? <span className="text-2xl">Unavailable</span> : <CountUp value={Number(v ?? 0)} />}
            </div>
            <div className="eyebrow mt-2 text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Live platform activity recorded in the UNLABELLED database. Counts start at zero and grow only with real visitor actions.
      </p>
    </div>
  );
}
