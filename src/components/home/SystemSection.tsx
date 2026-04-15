const steps = [
  {
    num: 1,
    title: "You apply and get matched",
    desc: "Tell us who you are, what you're working on, and what's not working. If you're a fit, you complete a personality assessment and get matched to an accountability pod of 4-6 people with similar operating styles.",
    tag: "The matching system",
    style: "",
  },
  {
    num: 2,
    title: "Your first call is real coaching",
    desc: "This isn't onboarding. I listen to what's actually going on — not just what you think the problem is. I ask the questions nobody else is asking you. By the end of the call, I understand your patterns, your blind spots, and what's actually in the way. Your 30-60-90 day goals are built from this conversation — customized to what we uncovered together, not pulled from a template.",
    tag: "Your coach",
    style: "",
  },
  {
    num: 3,
    title: "Your goals are built from the call",
    desc: "After our conversation, I review the full transcript and develop your 30-60-90 day goal framework. First 30 days: foundational behavior change. 60 days: building consistency. 90 days: the outcome you actually came for. You get 1-3 active goals per month. Vague goals get sent back. Every approved goal carries a stake.",
    tag: "Your coach",
    style: "",
  },
  {
    num: 4,
    title: "You check in every week",
    desc: "Energy, focus, stress, habits, wins, failures, and what you're avoiding. Your pod sees your streak. I see your patterns. The system surfaces the data — I provide the feedback. Good data means good coaching. That's why the check-in isn't optional.",
    tag: "The system + your coach",
    style: "",
  },
  {
    num: 5,
    title: "Your pod holds the standard daily",
    desc: "4-6 people matched to your operating style. Your own private thread. Peer accountability that runs every day — because you need the right people around you who understand what you're carrying and won't let you make excuses about it.",
    tag: "Your pod",
    style: "",
  },
  {
    num: 6,
    title: "Weekly Q&A — my perspective on your patterns",
    desc: "Submit questions privately. I answer the highest-value ones in content form every week. This isn't generic advice — it's my read on the patterns I'm seeing across the community, applied to what you're going through.",
    tag: "Your coach",
    style: "",
  },
  {
    num: 7,
    title: "Go dark or miss a goal — $75",
    desc: "Skip a check-in or miss a goal — $75. Two triggers, one principle: your choices have costs here. You're enrolled in the monthly Reset Session — a group call where I work through the common themes without naming anyone. Think of it like church. The sermon might be about you. You'll know.",
    tag: "Your coach + the system",
    style: "danger",
  },
  {
    num: 8,
    title: "Hit everything — Achievement group",
    desc: "Perfect Month unlocked. You're in the Achievement group — a separate call for people who did what they said they would. Not mixed with the Reset. A different room entirely. I debrief what actually worked so you can name the pattern and repeat it. This room is earned.",
    tag: "Your coach + your community",
    style: "gold",
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
            Every step here exists for a reason. Here's exactly what happens from the day you apply to the day your goals are due.
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
                    <span className="inline-block mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary/70 border border-primary/15 rounded-full px-3 py-1">
                      {step.tag}
                    </span>
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
