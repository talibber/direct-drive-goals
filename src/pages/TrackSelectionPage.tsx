import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHead } from "@/components/PageHead";
import { Link } from "react-router-dom";

const tracks = [
  {
    name: "Life Track",
    founding: "$99",
    standard: "$149",
    to: "/apply?track=life",
    body: "For personal goals, routines, health habits, discipline, focus, and consistency. 60-minute initial call. Monthly goals. Weekly check-ins. Evidence tracking. Pod accountability. Unlimited in-app messaging. Access to the monthly Reset Call if needed.",
    tagline: "For anyone ready to be held to a standard.",
    badge: null,
    gold: false,
    cta: "Apply for Life Track",
  },
  {
    name: "Operator Track",
    founding: "$199",
    standard: "$299",
    to: "/apply?track=operator",
    body: "Everything in Life Track, plus operator-level goal design, business-focused feedback, sharper weekly review, and pod matching with other high-output members.",
    tagline: "For founders, creators, professionals, traders, and builders.",
    badge: "Most Popular",
    gold: false,
    cta: "Apply for Operator Track",
  },
  {
    name: "Direct",
    founding: "$1,000",
    standard: "$1,500–$2,500",
    to: "/apply?track=direct",
    body: "Weekly 1-on-1 calls. Priority app review. Same-day response target during business days. Pre-decision feedback. Deeper goal and performance review. Limited availability.",
    tagline: "For the person who wants direct access, not just the system.",
    badge: "5 Founding Seats",
    gold: true,
    cta: "Apply for Direct",
  },
];

export default function TrackSelectionPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHead
        title="Apply — Choose Your Track | Terrible Coaching"
        description="Apply to Terrible Coaching. Choose Life Track for personal accountability ($99/mo), Operator Track for founders and operators ($199/mo), or Direct 1:1 access ($1,000/mo)."
        path="/apply/select"
      />
      <Navbar />
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Which track fits <span className="text-gradient-gold">where you are</span>?
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              All three use the same system and the same accountability structure. Your pod is matched to your track. Choose honestly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tracks.map((t) => (
              <Link
                key={t.name}
                to={t.to}
                className={`group rounded-xl border-2 p-7 transition-all hover:shadow-[0_8px_30px_-8px_hsl(45_100%_51%/0.15)] flex flex-col ${
                  t.gold
                    ? "border-primary/30 bg-primary/[0.04]"
                    : "border-border hover:border-primary/50 bg-card"
                } relative`}
              >
                {t.badge && (
                  <span className={`absolute -top-3 left-6 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    t.gold
                      ? "bg-primary text-primary-foreground animate-pulse"
                      : "bg-primary text-primary-foreground"
                  }`}>
                    {t.badge}
                  </span>
                )}

                <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-2 mt-1">
                  {t.name}
                </p>
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl font-bold text-gradient-gold">{t.founding}</span>
                    <span className="text-sm text-muted-foreground">/mo founding</span>
                  </div>
                  <p className="text-xs text-muted-foreground/70 mt-1">Standard: {t.standard}/mo</p>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.body}</p>

                <p className="text-sm font-medium text-foreground/70 mb-6">{t.tagline}</p>

                <div className="mt-auto flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                  {t.cta}
                </div>
              </Link>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-10 max-w-2xl mx-auto leading-relaxed">
            All tracks include the $75 Commitment Breach Fee for missed check-ins, missing evidence, ghosting, or broken controllable commitments. Fee may be waived at coach discretion.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
