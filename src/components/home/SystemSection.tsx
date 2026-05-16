const steps = [
  {
    num: 1,
    title: "You apply and get screened",
    desc: "Tell us who you are, what you are building, what you keep avoiding, and whether you are actually ready to be held to a standard. If you are a fit, you are matched to a track and pod.",
    style: "",
  },
  {
    num: 2,
    title: "Your first call is 60 minutes",
    desc: "This is not onboarding. It is diagnosis. We identify the real pattern, the goal underneath the goal, your avoidance loop, and the proof that will show whether you are actually moving.",
    style: "",
  },
  {
    num: 3,
    title: "We build your monthly goals",
    desc: "Your goals are built from the call. Monthly targets. Weekly commitments. Evidence requirements. No vague ambition. No fake productivity. Everything has to be visible.",
    style: "",
  },
  {
    num: 4,
    title: "You check in weekly",
    desc: "Every week, you submit your progress, your evidence, your misses, and your next commitment. The system tracks your streak, completion ratio, and risk signals.",
    style: "",
  },
  {
    num: 5,
    title: "Your pod sees the ratio",
    desc: "Your pod does not need your private business. They see your completion percentage, your streak, and whether you are showing up. You can share details if you choose. The default is accountability without oversharing.",
    style: "gold",
  },
  {
    num: 6,
    title: "Breaches trigger the Reset",
    desc: "If you miss a required check-in, fail to submit evidence, break a controllable commitment, or ghost the system, the $75 Commitment Breach Fee may apply and you are automatically enrolled in the monthly Reset Call.",
    style: "danger",
  },
];

export default function SystemSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            The full system. Nothing hidden.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Six steps from application to accountability. Read every one before you apply.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
          {steps.map((step) => {
            const isDanger = step.style === "danger";
            const isGold = step.style === "gold";

            return (
              <div
                key={step.num}
                className={`rounded-xl border p-6 ${
                  isGold
                    ? "border-primary/30 bg-primary/[0.04] shadow-[0_8px_30px_-8px_hsl(45_100%_51%/0.12)]"
                    : isDanger
                    ? "border-danger/20 bg-card"
                    : "border-border bg-card"
                } ${isDanger ? "border-l-2 border-l-danger" : ""} ${isGold ? "border-l-2 border-l-primary" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-display font-bold text-sm ${
                      isDanger
                        ? "bg-danger/10 text-danger"
                        : isGold
                        ? "bg-gradient-gold text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {step.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-foreground text-base mb-2">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
