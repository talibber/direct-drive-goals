export default function FeeSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Your choices have costs here.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The $75 accountability fee isn't a penalty. It's what inconsistency costs you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl border border-danger/20 border-l-2 border-l-danger bg-card p-6 md:p-8">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">You go dark on the system</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you don't update your check-ins or your goals, I can't give you feedback. We make decisions on good data — and silence isn't data. It's avoidance. And avoidance has a price here because you're wasting both of our time.
            </p>
          </div>
          <div className="rounded-xl border border-danger/20 border-l-2 border-l-danger bg-card p-6 md:p-8">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">You miss a goal you committed to</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You set it. I approved it. You didn't hit it. That miss isn't free — it's the cost of an opportunity you let pass. The fee makes the pattern visible. The Reset group addresses what's behind it.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto rounded-xl border border-primary/20 bg-primary/[0.03] p-6 md:p-8 text-center">
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
            I have the authority to waive any fee. Life doesn't always cooperate. But the default is that what you commit to here carries weight. The fee creates urgency. The pod creates daily visibility. The Reset creates insight. That combination is why this works.
          </p>
        </div>
      </div>
    </section>
  );
}
