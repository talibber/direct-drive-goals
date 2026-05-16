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
                I built Terrible Coaching because I got tired of watching smart people stay stuck — not because they did not know what to do, but because nobody around them was willing to hold them to the standard they claimed they wanted.
              </p>
              <p>
                Everyone has somebody saying 'you got this.' Very few people have somebody asking, 'Did you actually do what you said you were going to do?'
              </p>
              <p className="text-foreground/90 font-medium">
                This is not motivation. This is a system.
              </p>
              <p>
                Your first call is real coaching. I listen for the pattern underneath the goal. Then we turn that into monthly targets, weekly commitments, evidence requirements, and a pod that can see whether your behavior matches your ambition.
              </p>
              <p>
                The system is the tool.<br />
                The pod is the pressure.<br />
                The feedback is the mirror.<br />
                And the mirror does not negotiate.
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
