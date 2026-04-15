export default function RealProblemSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            Most coaching fails for the same reason.
            <br />
            Most communities fail for the same reason.
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Why coaching fails</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                One person. One hour a week. No data between sessions. No consequences for not showing up. No one watching when it matters most — which is every other hour of the week.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Why communities fail</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No structure. No stakes. No reason to keep showing up. People join, post twice, hear nothing back, and quietly disappear. Connection without accountability is just an audience.
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-2xl md:text-3xl font-display font-bold text-gradient-gold italic">
              Terrible Coaching is neither of those things.
            </p>
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
              I'm the coach. The system is the tool. It captures the data I need to coach you well — your patterns, your progress, the gaps between what you say and what you do. Without that data, we're both guessing. And I don't guess.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
