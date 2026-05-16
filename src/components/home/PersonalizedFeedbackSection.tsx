const patterns = [
  "Falling behind on the same type of goal repeatedly",
  "Overcommitting every Monday",
  "Avoiding one specific area",
  "Repeating the same blocker week after week",
  "Starting strong and disappearing midweek",
];

export default function PersonalizedFeedbackSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3">
            Drift detection
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Feedback that actually tracks your patterns.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Terrible Coaching learns how you operate over time. Your goals, check-ins, missed targets, consistency patterns, and weekly behavior all shape the feedback you receive.
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-3 mb-10">
          {["Not generic motivation.", "Not recycled quotes.", "Actual follow-up based on your behavior."].map((line) => (
            <div
              key={line}
              className="rounded-lg border border-border bg-card p-5 text-center text-sm font-medium text-foreground/90"
            >
              {line}
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto rounded-xl border border-primary/20 bg-primary/[0.03] p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-4">
            Behavioral drift your coach catches early
          </p>
          <ul className="space-y-3">
            {patterns.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-foreground/80">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base md:text-lg font-display font-bold text-gradient-gold italic text-center">
            Catch behavioral drift before it becomes avoidance.
          </p>
        </div>
      </div>
    </section>
  );
}
