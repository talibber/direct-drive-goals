import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

const tracks = [
  {
    name: "Life Track",
    price: "$99/month",
    to: "/apply?track=life",
    body: "Your first call is real coaching — I listen to what's actually going on and build your 30-60-90 day goals from what we uncover together. You're matched to a pod of 4-6 people who operate like you do. Weekly check-ins. Scored goals. $75 fee per miss. Five coach touchpoints per month.",
    tagline: "For anyone ready to stop figuring it out alone.",
    badge: null,
    gold: false,
    cta: "Apply for Life Track",
  },
  {
    name: "Business Track",
    price: "$199/month",
    to: "/apply?track=business",
    body: "Your pod is matched to other business owners and operators. Monthly expert calls. Direct messenger access. Peer networking directory.",
    intro: "Everything in Life Track — in a room full of operators.",
    tagline: "For people running something who need more than a system — they need perspective from someone who gets the weight.",
    badge: "Most Popular",
    gold: false,
    cta: "Apply for Business Track",
  },
  {
    name: "Direct",
    price: "$1,000/month",
    to: "/apply?track=direct",
    body: "Weekly 1-on-1 calls. Same-day responses. Pre-decision perspective before you commit.",
    intro: "Everything in Business Track plus the coach directly.",
    tagline: "For the person who wants the coach, not just the community.",
    badge: "3 of 5 spots",
    gold: true,
    cta: "Apply for Direct",
  },
];

export default function TrackSelectionPage() {
  return (
    <div className="min-h-screen bg-background">
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

                <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-1 mt-1">
                  {t.name} — {t.price}
                </p>

                {("intro" in t && t.intro) && (
                  <p className="text-sm font-medium text-foreground/80 mb-3">{t.intro}</p>
                )}

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.body}</p>

                <p className="text-sm font-medium text-foreground/70 mb-6">{t.tagline}</p>

                <div className="mt-auto flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                  {t.cta}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
