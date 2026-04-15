import founderImg from "@/assets/founder.png";

export default function FounderSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start gap-10 md:gap-14">
          <div className="w-full md:w-[380px] shrink-0 relative">
            <img
              src={founderImg}
              alt="T. Allen, Founder of Terrible Coaching"
              className="w-full rounded-lg object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent rounded-b-lg" />
          </div>
          <div className="flex-1 pt-2">
            <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>
                I built Terrible Coaching because I got tired of watching smart people stay stuck — not because they didn't know what to do, but because they didn't have anyone around them who would say the uncomfortable thing.
              </p>
              <p>
                Everyone's got a friend who says 'you got this.' Nobody's got a friend who says 'you've tried that three times and it hasn't worked — so what are we actually going to change?'
              </p>
              <p>
                That's the coaching. Blunt, backed by data, built on frameworks that actually hold up under pressure. Not motivation — information. Not inspiration — pattern recognition.
              </p>
              <p>
                The system is the tool — it captures what I need to coach you better than anyone else can. The community is the room — people who are in the same fight and won't let you hide. And the stakes exist so nobody wastes their own time or mine.
              </p>
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-foreground/70">
              T. Allen, Founder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
