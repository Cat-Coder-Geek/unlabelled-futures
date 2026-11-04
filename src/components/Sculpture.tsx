// Abstract iridescent "sculpture": layered rotating rings and a floating
// pearlescent form, evoking Dubai's skyline geometry.
export function Sculpture({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none relative aspect-square ${className}`} aria-hidden>
      <div className="absolute inset-0 animate-spin-slow rounded-full border border-foreground/10" />
      <div className="absolute inset-[8%] animate-spin-slow rounded-full border border-dashed border-foreground/10 [animation-direction:reverse]" />
      <div className="absolute inset-[18%] animate-float rounded-[42%_58%_63%_37%/45%_40%_60%_55%] bg-iridescent animate-shimmer opacity-90 blur-[1px] shadow-[0_40px_120px_-20px_var(--lilac)]" />
      <div className="absolute inset-[30%] animate-float rounded-full glass border border-foreground/10 [animation-delay:-3s]" />
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        {/* minimal skyline needle */}
        <g stroke="currentColor" strokeOpacity="0.35" fill="none" strokeWidth="0.6">
          <path d="M100 30 L104 150 L96 150 Z" />
          <path d="M80 150 L84 95 L88 150" />
          <path d="M112 150 L116 105 L120 150" />
          <line x1="40" y1="150" x2="160" y2="150" />
        </g>
      </svg>
    </div>
  );
}
