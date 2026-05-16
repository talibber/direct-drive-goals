const forYou = [
  "You struggle with consistency",
  "You perform better with accountability",
  "You need structure more than motivation",
  "You want direct feedback",
  "You're tired of restarting every week",
  "You know your execution doesn't match your ambition",
];

const notForYou = [
  "You want therapy",
  "You want passive inspiration",
  "You disappear when challenged",
  "You want someone to babysit you forever",
  "You hate accountability with consequences",
];

export default function WhoThisIsForSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Who this is for.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Read both columns honestly. Self-selection is the first commitment.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-5">
          <div className="rounded-xl border border-primary/30 bg-primary/[0.04] p-6 md:p-7">
            <h3 className="font-display text-base font-bold text-primary mb-4 uppercase tracking-wider">
              This is for you if
            </h3>
            <ul className="space-y-3">
              {forYou.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground/85">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-danger/20 border-l-2 border-l-danger bg-card p-6 md:p-7">
            <h3 className="font-display text-base font-bold text-danger mb-4 uppercase tracking-wider">
              This is not for you if
            </h3>
            <ul className="space-y-3">
              {notForYou.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground/85">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-danger shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
