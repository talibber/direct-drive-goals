export default function ResetCallSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-6">
            The Reset Call
          </h2>

          <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed mb-10">
            <p>
              When a member breaches a commitment, they are automatically enrolled in the monthly Reset Call. This is not public humiliation. It is pattern recognition.
            </p>
            <p>
              We look at what was committed, what actually happened, what got avoided, and what has to change before the next cycle.
            </p>
            <p className="text-foreground/90 font-medium">
              The goal is not shame. The goal is correction.
            </p>
          </div>

          <ul className="space-y-3 rounded-xl border border-border bg-card p-6 md:p-8">
            {[
              "Monthly group reset call",
              "For members who missed commitments, evidence, or check-ins",
              "Focused on pattern recognition and recommitment",
              "No private details shared without permission",
              "Fee may be waived at founder/coach discretion",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
