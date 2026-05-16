const cards = [
  {
    title: "You ghost the system",
    body: "If you stop checking in, ignore reminders, and disappear from the process, that is a breach. Coaching without data becomes guessing. And we do not guess.",
  },
  {
    title: "You skip the evidence",
    body: "Your word matters. Evidence makes it visible. If your commitment requires proof and you do not submit it by the deadline, that is a breach.",
  },
  {
    title: "You break a controllable commitment",
    body: "We do not charge you for missing an outcome you could not fully control. But if you agreed to a controllable action and did not do it, the commitment carries weight.",
  },
];

export default function FeeSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Why there's a $75 breach fee.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            If you say something matters, your behavior should reflect it. The breach fee creates urgency around the commitments you voluntarily make. You are not punished for needing help, adjusting goals, or being human - only for repeatedly disappearing on the standard you agreed to. Inconsistency costs something either way. We just make the cost visible.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5 mb-10">
          {cards.map((card) => (
            <div key={card.title} className="rounded-xl border border-danger/20 border-l-2 border-l-danger bg-card p-6 md:p-7">
              <h3 className="font-display text-base font-bold text-foreground mb-3">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto rounded-xl border border-primary/20 bg-primary/[0.03] p-6 md:p-8 text-center">
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
            We do not charge you for honest failure. We charge when you breach the standard: missed check-ins, missing evidence, ghosting, or broken controllable commitments. I can waive the fee when life genuinely happens. But avoidance is not adversity.
          </p>
        </div>
      </div>
    </section>
  );
}
