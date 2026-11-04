import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/dubai-hero.jpg";
import { Sculpture } from "@/components/Sculpture";
import { CountUp } from "@/components/CountUp";
import { ImpactCounter } from "@/components/ImpactCounter";
import { SourceNote } from "@/components/SourceNote";
import { KHDA_LANDSCAPE, KHDA_HE } from "@/lib/data";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UNLABELLED — Your potential has no stereotype" },
      { name: "description", content: "A Dubai digital movement challenging gender stereotypes in education, aligned with UN SDG 4 and SDG 5." },
      { property: "og:title", content: "UNLABELLED — Your potential has no stereotype" },
      { property: "og:description", content: "Explore Dubai education data, break biases and speak up safely." },
    ],
  }),
  component: Home,
});

function Home() {
  const t = useT();
  return (
    <>
      {/* HERO */}
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <img src={hero} alt="" width={1920} height={1088} className="absolute inset-0 -z-20 h-full w-full object-cover opacity-80 dark:opacity-25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/30 via-background/40 to-background" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pt-20 pb-24 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="flex gap-3">
              <span className="eyebrow border border-foreground/20 px-3 py-1">SDG 4 · Quality Education</span>
              <span className="eyebrow border border-foreground/20 px-3 py-1">SDG 5 · Gender Equality</span>
            </div>
            <h1 className="font-display mt-10 text-[clamp(4rem,13vw,11rem)] leading-[0.85]">
              UN<span className="text-iridescent animate-shimmer italic">LABELLED</span>
            </h1>
            <p className="font-display mt-8 text-3xl md:text-5xl">{t("tagline")}</p>
            <p className="font-display mt-1 text-3xl italic text-muted-foreground md:text-5xl">{t("tagline2")}</p>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground">{t("heroBody")}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/dashboard" className="group inline-flex items-center gap-3 bg-primary px-7 py-4 text-sm tracking-wide text-primary-foreground">
                {t("ctaEvidence")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
              </Link>
              <Link to="/break-the-bias" className="inline-flex items-center gap-3 border border-foreground px-7 py-4 text-sm tracking-wide hover:bg-foreground hover:text-background">
                {t("ctaBias")}
              </Link>
            </div>
          </div>
          <Sculpture className="mx-auto w-full max-w-md" />
        </div>
      </section>

      {/* A. MISSION */}
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="grid gap-12 md:grid-cols-[200px_1fr]">
          <div className="eyebrow text-muted-foreground">A — The Mission</div>
          <div>
            <h2 className="font-display text-5xl leading-tight md:text-7xl">
              Remove the label. <em className="text-muted-foreground">Reveal the learner.</em>
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Stereotypes quietly decide which subjects feel "right", whose questions get answered first and which careers seem possible.
              UNLABELLED makes those assumptions visible — with evidence, interaction and a safe channel to speak up — so every student in Dubai
              can choose a path by ambition, not expectation.
            </p>
          </div>
        </div>
      </section>

      {/* B. WHY IT MATTERS */}
      <section className="bg-navy py-32 text-ivory">
        <div className="mx-auto max-w-7xl px-6">
          <div className="eyebrow text-ivory/50">B — Why It Matters</div>
          <div className="mt-12 grid gap-px bg-ivory/10 md:grid-cols-4">
            {[
              ["Educational inequality", "Access, encouragement and resources are not always distributed evenly between learners."],
              ["Gender expectations", "Early messages about who is 'good at' what shape confidence long before ability is tested."],
              ["Subject stereotypes", "Technology, engineering, care and the arts are still often framed as gendered choices."],
              ["Unequal opportunity", "When pathways narrow, talent is lost — for individuals and for Dubai's digital economy."],
            ].map(([h, p], i) => (
              <div key={h} className="bg-navy p-8">
                <div className="font-display text-6xl text-iridescent">0{i + 1}</div>
                <h3 className="mt-6 text-lg font-semibold">{h}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* C. DATA */}
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="eyebrow text-muted-foreground">C — Discover the Data</div>
            <h2 className="font-display mt-4 text-5xl md:text-6xl">What Dubai's numbers say</h2>
          </div>
          <Link to="/dashboard" className="border-b border-foreground pb-1 text-sm">Open the Data Observatory →</Link>
        </div>
        <div className="mt-16 grid gap-16 md:grid-cols-3">
          {[
            [49, "of private-school students are female", KHDA_LANDSCAPE],
            [78, "of private-school teachers are female", KHDA_LANDSCAPE],
            [44, "of higher-education students are female", KHDA_HE],
          ].map(([n, l, s]) => (
            <div key={l as string}>
              <div className="font-display text-8xl"><CountUp value={n as number} suffix="%" /></div>
              <p className="mt-2 text-muted-foreground">{l as string}</p>
              <SourceNote source={s as typeof KHDA_LANDSCAPE} status="reference" />
            </div>
          ))}
        </div>
      </section>

      {/* D. MOVEMENT */}
      <section className="border-y border-border bg-mist/40 py-32 dark:bg-muted/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="eyebrow text-muted-foreground">D — The Movement</div>
          <h2 className="font-display mt-4 max-w-3xl text-5xl md:text-6xl">Everyone has a part to play.</h2>
          <div className="mt-16 divide-y divide-border">
            {[
              ["Students", "Challenge a myth, explore careers without labels and report unfair treatment safely.", "/break-the-bias"],
              ["Teachers", "Use the evidence and resources to examine classroom language, grouping and expectations.", "/explore"],
              ["Parents", "Encourage interests on their merit, and talk openly about ambitions at home.", "/explore"],
              ["Policymakers", "Use transparent, sourced data to track progress towards SDG 4 and SDG 5.", "/dashboard"],
            ].map(([h, p, to]) => (
              <Link key={h} to={to as "/explore"} className="group grid items-center gap-4 py-8 md:grid-cols-[1fr_2fr_auto]">
                <span className="font-display text-4xl">{h}</span>
                <span className="text-muted-foreground">{p}</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2 rtl:rotate-180" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="eyebrow mb-10 text-muted-foreground">Live platform impact</div>
        <ImpactCounter />
      </section>

      {/* E. CTA */}
      <section className="relative overflow-hidden py-40 text-center">
        <div className="absolute inset-0 -z-10 bg-iridescent animate-shimmer opacity-40" />
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-5xl leading-tight md:text-8xl">{t("closing")}</h2>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link to="/break-the-bias" className="bg-primary px-8 py-4 text-sm text-primary-foreground">{t("ctaBias")}</Link>
            <Link to="/speak-up" className="border border-foreground px-8 py-4 text-sm hover:bg-foreground hover:text-background">{t("ctaSpeak")}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
