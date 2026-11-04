import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bumpCounter } from "@/lib/impact";
import { ImpactCounter } from "@/components/ImpactCounter";

export const Route = createFileRoute("/break-the-bias")({
  head: () => ({
    meta: [
      { title: "Break the Bias: The Perspective Shift — UNLABELLED" },
      { name: "description", content: "Confront common education stereotypes and see the evidence behind them." },
      { property: "og:title", content: "The Perspective Shift — UNLABELLED" },
      { property: "og:description", content: "Agree, disagree or unsure? See what the research really says." },
    ],
  }),
  component: BreakTheBias,
});

const REFS = {
  oecdAbc: { label: "OECD (2015), The ABC of Gender Equality in Education", url: "https://www.oecd.org/en/publications/the-abc-of-gender-equality-in-education_9789264229945-en.html" },
  unescoCode: { label: "UNESCO (2017), Cracking the code: girls' and women's education in STEM", url: "https://unesdoc.unesco.org/ark:/48223/pf0000253479" },
  pisa: { label: "OECD PISA results", url: "https://www.oecd.org/en/about/programmes/pisa.html" },
  unwomen: { label: "UN Women — Leadership and political participation", url: "https://www.unwomen.org/en/what-we-do/leadership-and-political-participation" },
};

const MYTHS = [
  {
    statement: "Boys are naturally better at technology.",
    reality: "Differences in tech participation track encouragement, role models and early exposure — not innate ability.",
    explain: "International research finds that gaps in confidence and interest emerge early and are shaped by expectations from parents, teachers and media. Where girls receive equal exposure and encouragement, performance gaps shrink or disappear.",
    stat: "UNESCO identifies socialisation, stereotypes and learning environments — not biology — as the key drivers of the gender gap in STEM.",
    refs: [REFS.unescoCode, REFS.oecdAbc],
    takeaway: "Skill in technology is learned. Access and encouragement should be equal.",
  },
  {
    statement: "Girls are less suited to leadership.",
    reality: "Leadership is a set of learnable skills. Under-representation reflects barriers, not suitability.",
    explain: "Women remain under-represented in leadership positions worldwide, which UN Women attributes to structural barriers, discriminatory norms and unequal access to opportunities — not capability.",
    stat: "In Dubai's private schools, women make up a large majority of the teaching workforce (KHDA reference figure: ~78%) — a profession built on leading learning every day.",
    refs: [REFS.unwomen],
    takeaway: "Give every student the chance to lead — in class, in clubs, in projects.",
  },
  {
    statement: "Some careers are only for men or women.",
    reality: "No career requires a particular gender. Narrow expectations limit everyone.",
    explain: "The OECD finds that students' career expectations at age 15 are strongly gendered even when their skills are similar — meaning talent is being filtered by expectations before it reaches the workforce.",
    stat: "Career expectations diverge by gender even among students with similar performance (OECD).",
    refs: [REFS.oecdAbc, REFS.pisa],
    takeaway: "Choose a career by interest and ambition — not by who usually does it.",
  },
  {
    statement: "Certain subjects are naturally gender-specific.",
    reality: "Subjects have no gender. Patterns in subject choice reflect culture and expectation.",
    explain: "Subject preferences vary widely between countries and over time — a sign that they are shaped by social context rather than fixed by nature.",
    stat: "Gender gaps in subject performance vary significantly between education systems in PISA, and in many systems are small or reversed.",
    refs: [REFS.pisa, REFS.oecdAbc],
    takeaway: "Every subject belongs to every student.",
  },
];

const WALL = [
  "AI researcher", "Pilot", "Nurse", "Robotics engineer", "Architect", "Game designer", "Surgeon", "Teacher", "Entrepreneur",
  "Data scientist", "Fashion designer", "Astronaut", "Cybersecurity analyst", "Chef", "Film director", "Climate scientist",
  "Early-years educator", "Civil engineer", "Diplomat", "Product designer", "Marine biologist", "Software developer",
];

const CAREERS = [
  ["Artificial Intelligence", "Build systems that learn — from Arabic language models to smart-city services.", "Maths, computer science, ethics"],
  ["Engineering", "Design the structures, energy systems and infrastructure of tomorrow's Dubai.", "Physics, maths, design"],
  ["Robotics", "Combine mechanics, electronics and code to create machines that help people.", "Physics, computing, problem-solving"],
  ["Medicine", "Diagnose, heal and research — increasingly with digital and AI tools.", "Biology, chemistry, empathy"],
  ["Entrepreneurship", "Turn ideas into ventures in one of the world's most dynamic start-up hubs.", "Business, creativity, resilience"],
  ["Architecture", "Shape skylines and sustainable communities.", "Art, maths, environmental science"],
  ["Technology", "Cybersecurity, cloud, software and data — the backbone of a digital economy.", "Computing, logic, collaboration"],
  ["Creative industries", "Film, design, gaming and media that tell new stories.", "Art, storytelling, digital skills"],
];

function BreakTheBias() {
  const qc = useQueryClient();
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [openCareer, setOpenCareer] = useState<number | null>(null);
  const [ambition, setAmbition] = useState("");
  const [wall, setWall] = useState(WALL);

  const m = MYTHS[i]!;

  const choose = async (a: string) => {
    setAnswer(a);
    await bumpCounter("myths_challenged");
    qc.invalidateQueries({ queryKey: ["impact"] });
  };
  const next = () => {
    setAnswer(null);
    if (i === MYTHS.length - 1) setDone(true);
    else setI(i + 1);
  };

  const addAmbition = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = ambition.trim().slice(0, 40);
    if (!v) return;
    setWall([v, ...wall]);
    setAmbition("");
    await bumpCounter("stories_shared");
    qc.invalidateQueries({ queryKey: ["impact"] });
    toast.success("Ambition added to the wall for this visit.");
  };

  return (
    <>
      {/* PERSPECTIVE SHIFT */}
      <section className="relative min-h-[90vh] overflow-hidden bg-navy text-ivory">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-center justify-between">
            <div className="eyebrow text-ivory/50">The Perspective Shift</div>
            {!done && <div className="eyebrow text-ivory/50">{i + 1} / {MYTHS.length}</div>}
          </div>

          {done ? (
            <div className="animate-reveal flex min-h-[60vh] flex-col items-center justify-center text-center">
              <p className="font-display text-5xl leading-tight md:text-8xl">Talent has no gender.</p>
              <p className="font-display mt-4 text-4xl italic text-iridescent md:text-7xl">Opportunity should have no boundaries.</p>
              <button onClick={() => { setDone(false); setI(0); }} className="mt-12 border border-ivory/40 px-6 py-3 text-sm hover:bg-ivory hover:text-navy">Start again</button>
            </div>
          ) : !answer ? (
            <div key={i} className="animate-rise flex min-h-[60vh] flex-col justify-center">
              <p className="eyebrow text-ivory/40">Stereotype</p>
              <h1 className="font-display mt-6 text-5xl leading-[1.05] md:text-8xl">“{m.statement}”</h1>
              <div className="mt-14 flex flex-wrap gap-4">
                {["Agree", "Disagree", "Not sure"].map((a) => (
                  <button key={a} onClick={() => choose(a)} className="min-w-36 border border-ivory/30 px-8 py-4 text-sm tracking-wide transition hover:border-transparent hover:bg-iridescent hover:text-navy">
                    {a}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div key={`r${i}`} className="animate-reveal relative -mx-6 mt-6 bg-ivory px-6 py-14 text-navy md:px-14">
              <p className="eyebrow text-navy/50">You chose “{answer}” · The reality</p>
              <p className="font-display mt-4 text-sm line-through opacity-50 md:text-xl">“{m.statement}”</p>
              <h2 className="font-display mt-4 text-4xl leading-tight md:text-6xl">{m.reality}</h2>
              <div className="mt-10 grid gap-10 md:grid-cols-3">
                <div><div className="eyebrow mb-2 text-navy/50">Explanation</div><p className="text-sm leading-relaxed">{m.explain}</p></div>
                <div><div className="eyebrow mb-2 text-navy/50">Evidence</div><p className="text-sm leading-relaxed">{m.stat}</p></div>
                <div>
                  <div className="eyebrow mb-2 text-navy/50">Research</div>
                  <ul className="space-y-2 text-sm">{m.refs.map((r) => <li key={r.url}><a href={r.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">{r.label} ↗</a></li>)}</ul>
                </div>
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-navy/15 pt-6">
                <p className="font-display text-2xl italic">{m.takeaway}</p>
                <button onClick={next} className="bg-navy px-6 py-3 text-sm text-ivory">{i === MYTHS.length - 1 ? "Finish" : "Next statement →"}</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MYTH VS REALITY */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="eyebrow text-muted-foreground">Myth vs Reality</div>
        <h2 className="font-display mt-4 text-5xl">Tap to reveal.</h2>
        <div className="mt-12 grid gap-px bg-border md:grid-cols-2">
          {MYTHS.map((mm, k) => (
            <button key={k} onClick={() => setFlipped({ ...flipped, [k]: !flipped[k] })} aria-pressed={!!flipped[k]}
              className="min-h-56 bg-background p-10 text-start transition-colors hover:bg-muted">
              {flipped[k] ? (
                <div className="animate-rise"><div className="eyebrow text-iridescent">Reality</div><p className="font-display mt-4 text-3xl">{mm.reality}</p></div>
              ) : (
                <div><div className="eyebrow text-muted-foreground">Myth</div><p className="font-display mt-4 text-3xl text-muted-foreground">“{mm.statement}”</p></div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* WALL */}
      <section className="overflow-hidden border-y border-border bg-mist/30 py-24 dark:bg-muted/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="eyebrow text-muted-foreground">The Unlabelled Wall</div>
          <h2 className="font-display mt-4 text-5xl">Ambitions, without categories.</h2>
          <form onSubmit={addAmbition} className="mt-8 flex max-w-lg gap-3">
            <label htmlFor="amb" className="sr-only">Your ambition</label>
            <input id="amb" value={ambition} onChange={(e) => setAmbition(e.target.value)} maxLength={40} placeholder="I want to become…" className="flex-1 border-b border-foreground/30 bg-transparent py-2 outline-none focus:border-foreground" />
            <button className="bg-primary px-5 text-sm text-primary-foreground">Add</button>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">Your entry appears on your screen only and counts as a shared story; the text itself isn't stored.</p>
        </div>
        {[0, 1].map((row) => (
          <div key={row} className="mt-10 flex w-max animate-marquee gap-10 whitespace-nowrap" style={{ animationDirection: row ? "reverse" : "normal" }}>
            {[...wall, ...wall].map((w, k) => (
              <span key={k} className={`font-display text-4xl md:text-6xl ${k % 3 === 0 ? "text-iridescent" : "text-foreground/70"}`}>{w} <span className="text-foreground/20">·</span></span>
            ))}
          </div>
        ))}
      </section>

      {/* FUTURE WITHOUT LABELS */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="eyebrow text-muted-foreground">Future Without Labels</div>
        <h2 className="font-display mt-4 text-5xl">Careers open to everyone.</h2>
        <div className="mt-12 divide-y divide-border border-y border-border">
          {CAREERS.map(([name, desc, skills], k) => (
            <div key={name}>
              <button onClick={() => setOpenCareer(openCareer === k ? null : k)} aria-expanded={openCareer === k}
                className="flex w-full items-center justify-between py-6 text-start">
                <span className="font-display text-3xl md:text-4xl">{name}</span>
                <span className="text-2xl text-muted-foreground">{openCareer === k ? "−" : "+"}</span>
              </button>
              {openCareer === k && (
                <div className="animate-rise grid gap-4 pb-8 md:grid-cols-2">
                  <p className="text-muted-foreground">{desc}</p>
                  <p className="text-sm"><span className="eyebrow me-2 text-muted-foreground">Useful foundations</span>{skills}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="eyebrow mb-10 text-muted-foreground">Impact Counter</div>
        <ImpactCounter />
      </section>
    </>
  );
}
