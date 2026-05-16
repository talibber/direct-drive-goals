const weeks = [
  {
    num: 1,
    text: "Your coaching call happens. I listen to what's actually going on - not the polished version. After the call, I review the transcript and build your 30-60-90 day goals. You get a personalized framework, not a worksheet. Your pod introduces themselves. The system starts capturing data.",
  },
  {
    num: 2,
    text: "First check-in submitted. Your pod sees your streak start. I review your data and send feedback - not because you asked, because the data showed something. If you skip the check-in, you're not invisible. You're just costing yourself $75 and better coaching.",
  },
  {
    num: 3,
    text: "Q&A content drops. One of the questions sounds exactly like something you're dealing with. It is. Your pod is 3 of 4 checked in. You notice. The patterns I'm seeing across the community start showing up in the content.",
  },
  {
    num: 4,
    text: "Goals due. You submit proof. I verify. If you hit everything - Achievement group. A separate room where I debrief what worked. If you missed - Reset group and $75. Either way, the month ends with a clear read on who you said you'd be and what you actually did.",
  },
];

export default function MonthSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            What a month actually looks like.
          </h2>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Timeline row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 relative">
            {/* Connecting line - visible on md+ */}
            <div className="hidden md:block absolute top-5 left-[12.5%] right-[12.5%] h-px bg-primary/20" />

            {weeks.map((w) => (
              <div key={w.num} className="relative">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center font-display font-bold text-sm text-primary-foreground shadow-gold relative z-10">
                    W{w.num}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">{w.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom quote */}
          <div className="mt-12 border-t border-primary/20 pt-8 text-center">
            <p className="text-xl md:text-2xl font-display font-bold text-gradient-gold italic">
              I can't want this for you more than you want it for yourself.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
