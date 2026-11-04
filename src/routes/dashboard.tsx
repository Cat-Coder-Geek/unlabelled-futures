import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SourceNote } from "@/components/SourceNote";
import { CountUp } from "@/components/CountUp";
import { COVERAGE_ZONES, HISTORICAL, SDG_TARGETS, SPLITS, KHDA_HE, UIS, UN_SDG, DUBAI_PULSE } from "@/lib/data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Data Observatory — UNLABELLED" },
      { name: "description", content: "Interactive charts of gender representation in Dubai education, with sources for every figure." },
      { property: "og:title", content: "Data Observatory — UNLABELLED" },
      { property: "og:description", content: "Sourced, interactive Dubai education data by gender." },
    ],
  }),
  component: Dashboard,
});

const FEMALE = "var(--sage-muted)";
const MALE = "var(--lilac)";

const tooltipStyle = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 2, fontSize: 12, color: "var(--foreground)" };

function Dashboard() {
  const available = SPLITS.filter((s) => s.status !== "unavailable");
  const [filter, setFilter] = useState<string>("all");
  const [pieIdx, setPieIdx] = useState(0);
  const barData = available
    .filter((s) => filter === "all" || s.label === filter)
    .map((s) => ({ name: s.label, Female: s.female, Male: s.male }));
  const pie = available[pieIdx]!;
  const [zone, setZone] = useState(COVERAGE_ZONES[0]!);

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="eyebrow text-muted-foreground">The Data Observatory</div>
      <h1 className="font-display mt-4 text-6xl md:text-8xl">Evidence, <em className="text-iridescent">unlabelled.</em></h1>
      <p className="mt-6 max-w-2xl text-muted-foreground">
        Every figure below links to its original publisher. Reference figures are flagged until verified against the source publication.
        Where no verified data exists we show "Data unavailable" — never estimates. These charts are static snapshots of published data, not live feeds.
      </p>

      {/* Counters */}
      <section className="mt-20 grid gap-10 border-y border-border py-12 md:grid-cols-4" aria-label="Headline statistics">
        {SPLITS.map((s) => (
          <div key={s.label}>
            <div className="eyebrow text-muted-foreground">{s.label}</div>
            {s.female === null ? (
              <div className="font-display mt-3 text-3xl text-muted-foreground">Data unavailable</div>
            ) : (
              <div className="font-display mt-3 text-6xl"><CountUp value={s.female} suffix="%" /> <span className="text-base font-sans text-muted-foreground">female</span></div>
            )}
          </div>
        ))}
      </section>

      {/* Bar chart */}
      <section className="mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl">Representation by gender</h2>
          <label className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Filter</span>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-input bg-background px-3 py-2">
              <option value="all">All groups</option>
              {available.map((s) => <option key={s.label}>{s.label}</option>)}
            </select>
          </label>
        </div>
        <p className="sr-only">
          Bar chart. {available.map((s) => `${s.label}: ${s.female}% female, ${s.male}% male.`).join(" ")}
        </p>
        <div className="mt-8 h-80" aria-hidden>
          <ResponsiveContainer>
            <BarChart data={barData} barGap={6}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis unit="%" domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} formatter={(v) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Female" fill={FEMALE} radius={[2, 2, 0, 0]} />
              <Bar dataKey="Male" fill={MALE} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <SourceNote source={available[0]!.source} status="reference" />
        <p className="mt-1 text-[0.7rem] text-muted-foreground">Higher-education figures: {KHDA_HE.dataset}, {KHDA_HE.authority}.</p>
      </section>

      {/* Pie + map */}
      <section className="mt-28 grid gap-16 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl">Composition</h2>
          <div className="mt-6 flex flex-wrap gap-2" role="tablist">
            {available.map((s, i) => (
              <button key={s.label} role="tab" aria-selected={i === pieIdx} onClick={() => setPieIdx(i)}
                className={`border px-3 py-1.5 text-xs ${i === pieIdx ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground"}`}>
                {s.label}
              </button>
            ))}
          </div>
          <p className="sr-only">{pie.label}: {pie.female}% female and {pie.male}% male.</p>
          <div className="mt-4 h-72" aria-hidden>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={[{ name: "Female", value: pie.female }, { name: "Male", value: pie.male }]} dataKey="value" innerRadius="58%" outerRadius="90%" paddingAngle={2} stroke="none">
                  <Cell fill={FEMALE} /><Cell fill={MALE} />
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <SourceNote source={pie.source} status="reference" />
        </div>

        <div>
          <h2 className="font-display text-4xl">Where the data comes from</h2>
          <p className="mt-2 text-sm text-muted-foreground">Schematic map of data-coverage areas. No individual school locations are shown.</p>
          <div className="relative mt-6 aspect-[4/3] overflow-hidden border border-border bg-gradient-to-br from-pearl/40 to-mist/40">
            <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full" role="img" aria-label="Schematic map of the Emirate of Dubai with education data coverage areas">
              {/* sea */}
              <path d="M0 0 H100 V8 C80 14 60 22 40 32 C25 40 12 46 0 52 Z" fill="var(--pearl)" opacity="0.5" />
              {/* emirate */}
              <path d="M0 52 C12 46 25 40 40 32 C60 22 80 14 100 8 V75 H0 Z" fill="var(--sage)" opacity={zone.id === "emirate" ? 0.55 : 0.3}
                className="cursor-pointer transition-opacity" onClick={() => setZone(COVERAGE_ZONES[0]!)} />
              <text x="6" y="12" fontSize="3" fill="currentColor" opacity="0.6">Arabian Gulf</text>
              {COVERAGE_ZONES.filter((z) => z.kind === "point").map((z) => (
                <g key={z.id} className="cursor-pointer" onClick={() => setZone(z)} tabIndex={0} role="button" aria-label={z.name}
                  onKeyDown={(e) => e.key === "Enter" && setZone(z)}>
                  <circle cx={z.x} cy={z.y} r={zone.id === z.id ? 3.2 : 2} fill="var(--lilac)" stroke="var(--navy)" strokeWidth="0.3" />
                  <circle cx={z.x} cy={z.y} r="5" fill="none" stroke="var(--lilac)" strokeWidth="0.2" className="animate-pulse" />
                </g>
              ))}
            </svg>
          </div>
          <div className="mt-4">
            <div className="font-display text-2xl">{zone.name}</div>
            <p className="mt-1 text-sm text-muted-foreground">{zone.note}</p>
            <SourceNote source={zone.source} />
          </div>
        </div>
      </section>

      {/* Historical */}
      <section className="mt-28">
        <h2 className="font-display text-4xl">Historical participation</h2>
        {HISTORICAL.length === 0 ? (
          <div className="mt-8 flex h-56 flex-col items-center justify-center border border-dashed border-border text-center">
            <div className="font-display text-3xl text-muted-foreground">Data unavailable</div>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">A verified multi-year gender series for Dubai has not yet been loaded. The line graph will appear once official yearly figures are added.</p>
          </div>
        ) : null}
        <SourceNote source={DUBAI_PULSE} />
      </section>

      {/* SDG */}
      <section className="mt-28">
        <h2 className="font-display text-4xl">SDG 4 &amp; 5 targets in focus</h2>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {SDG_TARGETS.map((t) => (
            <div key={t.code} className="grid gap-4 py-5 md:grid-cols-[120px_1fr]">
              <span className="font-display text-3xl text-iridescent">{t.code}</span>
              <span className="text-muted-foreground">{t.text}</span>
            </div>
          ))}
        </div>
        <SourceNote source={UN_SDG} />
        <p className="mt-2 text-[0.7rem] text-muted-foreground">
          National UAE indicator values: see <a className="underline" href={UIS.url} target="_blank" rel="noreferrer">{UIS.authority} ↗</a>. Not reproduced here until verified.
        </p>
      </section>
    </div>
  );
}
