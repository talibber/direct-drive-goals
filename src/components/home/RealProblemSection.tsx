const knowItems = [
  "Lose the weight",
  "Build the business",
  "Make the calls",
  "Stop procrastinating",
  "Finish the project",
  "Save the money",
  "Fix the habit",
];

export default function RealProblemSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
            The problem is rarely information.
          </h2>
          <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Most people already know what they need to do.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-12">
            {knowItems.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground/80 text-center"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
              The issue is not knowledge. The issue is inconsistency. Most people slowly negotiate with themselves until the goal quietly dies.
            </p>
            <p className="text-2xl md:text-3xl font-display font-bold text-gradient-gold italic">
              Terrible Coaching interrupts that pattern before it becomes your lifestyle.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
