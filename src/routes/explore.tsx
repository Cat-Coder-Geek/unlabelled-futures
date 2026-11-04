import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import hero from "@/assets/dubai-hero.jpg";
import { bumpCounter } from "@/lib/impact";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Research & Opportunities — UNLABELLED" },
      { name: "description", content: "Research on gender equality in education, Dubai initiatives and a career explorer without assumptions." },
      { property: "og:title", content: "Explore — UNLABELLED" },
      { property: "og:description", content: "Research, resources and careers without labels." },
    ],
  }),
  component: Explore,
});

const RESOURCES = [
  { topic: "Equality research", title: "The ABC of Gender Equality in Education", org: "OECD", url: "https://www.oecd.org/en/publications/the-abc-of-gender-equality-in-education_9789264229945-en.html", text: "How aptitude, behaviour and confidence shape gender gaps in learning." },
  { topic: "STEM", title: "Cracking the code: girls' and women's education in STEM", org: "UNESCO", url: "https://unesdoc.unesco.org/ark:/48223/pf0000253479", text: "Factors behind girls' participation in science, technology, engineering and maths." },
  { topic: "Dubai initiatives", title: "KHDA publications and school reports", org: "KHDA", url: "https://www.khda.gov.ae/en/publications", text: "Dubai's official reports on private education, inspections and wellbeing." },
  { topic: "Dubai initiatives", title: "UAE Ministry of Education", org: "MOE", url: "https://www.moe.gov.ae/", text: "National education policy, programmes and statistics." },
  { topic: "SDG", title: "Goal 4: Quality Education", org: "United Nations", url: "https://sdgs.un.org/goals/goal4", text: "Targets, indicators and progress on inclusive, equitable education." },
  { topic: "SDG", title: "Goal 5: Gender Equality", org: "United Nations", url: "https://sdgs.un.org/goals/goal5", text: "Ending discrimination and ensuring equal opportunity for all women and girls." },
  { topic: "Data", title: "UIS Data Browser", org: "UNESCO Institute for Statistics", url: "https://databrowser.uis.unesco.org/", text: "Official international education statistics, including the UAE." },
  { topic: "Data", title: "Dubai Pulse open data", org: "Digital Dubai", url: "https://www.dubaipulse.gov.ae/", text: "Dubai government open datasets, including education." },
];

const OPPS = [
  { name: "AI engineer", interests: ["puzzles", "technology", "maths"], style: "build" },
  { name: "UX designer", interests: ["art", "technology", "people"], style: "create" },
  { name: "Doctor", interests: ["science", "people"], style: "help" },
  { name: "Civil engineer", interests: ["maths", "building"], style: "build" },
  { name: "Cybersecurity analyst", interests: ["puzzles", "technology"], style: "protect" },
  { name: "Teacher", interests: ["people", "communication"], style: "help" },
  { name: "Architect", interests: ["art", "building", "maths"], style: "create" },
  { name: "Start-up founder", interests: ["people", "communication", "technology"], style: "lead" },
  { name: "Robotics engineer", interests: ["building", "technology", "science"], style: "build" },
  { name: "Environmental scientist", interests: ["science", "nature"], style: "protect" },
  { name: "Nurse", interests: ["science", "people"], style: "help" },
  { name: "Film director", interests: ["art", "communication"], style: "lead" },
  { name: "Data journalist", interests: ["communication", "maths", "technology"], style: "create" },
];
const INTERESTS = ["technology", "maths", "science", "art", "people", "building", "puzzles", "communication", "nature"];

const STORIES = [
  ["“I picked computer science because I loved puzzles — no one told me it wasn't ‘for me’, and that made all the difference.”", "Illustrative student voice"],
  ["“Being a male early-years teacher surprised people. Now my students just see a teacher.”", "Illustrative student voice"],
];

function Explore() {
  const qc = useQueryClient();
  const [topic, setTopic] = useState("All");
  const [picked, setPicked] = useState<string[]>([]);
  const topics = ["All", ...Array.from(new Set(RESOURCES.map((r) => r.topic)))];
  const matches = useMemo(
    () => picked.length === 0 ? [] : OPPS.map((o) => ({ ...o, score: o.interests.filter((i) => picked.includes(i)).length })).filter((o) => o.score > 0).sort((a, b) => b.score - a.score),
    [picked],
  );
  const track = async () => { await bumpCounter("resources_explored"); qc.invalidateQueries({ queryKey: ["impact"] }); };

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="Misty Dubai skyline at dawn" width={1920} height={1088} className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60 dark:opacity-20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background to-transparent" />
        <div className="mx-auto max-w-7xl px-6 py-32">
          <div className="eyebrow text-muted-foreground">Explore</div>
          <h1 className="font-display mt-4 max-w-4xl text-6xl leading-[0.95] md:text-8xl">Research, resources &amp; <em className="text-iridescent">open futures.</em></h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <button key={t} onClick={() => setTopic(t)} aria-pressed={topic === t}
              className={`border px-4 py-1.5 text-xs ${topic === t ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}>{t}</button>
          ))}
        </div>
        <div className="mt-12 divide-y divide-border border-y border-border">
          {RESOURCES.filter((r) => topic === "All" || r.topic === topic).map((r) => (
            <a key={r.url} href={r.url} target="_blank" rel="noreferrer" onClick={track}
              className="group grid gap-3 py-8 md:grid-cols-[160px_1fr_200px] md:items-baseline">
              <span className="eyebrow text-muted-foreground">{r.topic}</span>
              <span>
                <span className="font-display block text-3xl group-hover:italic">{r.title}</span>
                <span className="mt-2 block text-sm text-muted-foreground">{r.text}</span>
              </span>
              <span className="text-sm md:text-end">{r.org} ↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-navy py-28 text-ivory">
        <div className="mx-auto max-w-7xl px-6">
          <div className="eyebrow text-ivory/50">Opportunity Explorer</div>
          <h2 className="font-display mt-4 text-5xl md:text-6xl">Start with what you enjoy.</h2>
          <p className="mt-4 max-w-xl text-ivory/60">Pick your interests. Careers are matched only on interests — never on gender.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            {INTERESTS.map((i) => {
              const on = picked.includes(i);
              return (
                <button key={i} onClick={() => setPicked(on ? picked.filter((p) => p !== i) : [...picked, i])} aria-pressed={on}
                  className={`border px-5 py-2 text-sm capitalize transition ${on ? "border-transparent bg-iridescent text-navy" : "border-ivory/25 hover:border-ivory"}`}>{i}</button>
              );
            })}
          </div>
          <div className="mt-14 min-h-40">
            {picked.length === 0 ? (
              <p className="text-ivory/40">Select at least one interest to see matching careers.</p>
            ) : (
              <ul className="grid gap-x-10 md:grid-cols-2">
                {matches.map((o) => (
                  <li key={o.name} className="animate-rise flex items-baseline justify-between border-b border-ivory/10 py-4">
                    <span className="font-display text-3xl">{o.name}</span>
                    <span className="text-xs text-ivory/50">{o.score} match{o.score > 1 ? "es" : ""} · {o.interests.join(", ")}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="eyebrow text-muted-foreground">Student stories</div>
        <div className="mt-10 grid gap-16 md:grid-cols-2">
          {STORIES.map(([q, a]) => (
            <figure key={q}>
              <blockquote className="font-display text-3xl leading-snug md:text-4xl">{q}</blockquote>
              <figcaption className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{a} — composite example, not a real individual</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
