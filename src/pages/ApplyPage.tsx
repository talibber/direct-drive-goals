import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

const supportOptions = [
  {
    value: "accountability_only",
    title: "System + Accountability",
    subtitle: "I'm self-directed. I need structure, a scorecard, and consequences. I don't need frequent check-ins beyond the weekly system.",
  },
  {
    value: "monthly_coaching",
    title: "System + Monthly Coaching",
    subtitle: "I want the full accountability system plus a dedicated monthly coaching call to work through strategy, decisions, and roadblocks.",
  },
  {
    value: "undecided",
    title: "I'm not sure yet",
    subtitle: "I'll figure it out once I understand the program better.",
  },
] as const;

const industryOptions = [
  "SaaS / Technology", "E-commerce / Retail", "Professional Services", "Healthcare", "Real Estate",
  "Finance / Fintech", "Marketing / Advertising", "Construction / Trades", "Education", "Food & Beverage",
  "Manufacturing", "Media / Content", "Legal", "Non-Profit", "Other",
];

export default function ApplyPage() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [supportLevel, setSupportLevel] = useState<string>("");
  const [coachingInterest, setCoachingInterest] = useState<string>("");
  const [track, setTrack] = useState<"life" | "business">("life");

  useEffect(() => {
    const t = searchParams.get("track");
    if (t === "business") {
      setTrack("business");
      setCoachingInterest("business");
    } else if (t === "life") {
      setTrack("life");
      setCoachingInterest("life");
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportLevel) {
      toast({ title: "Required field", description: "Please select your preferred level of support.", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Application submitted", description: "We'll review your application within 48 hours." });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-20 md:pt-40">
          <div className="container max-w-lg text-center">
            <div className="text-5xl mb-4">🔥</div>
            <h1 className="font-display text-3xl font-bold mb-4">Application Received</h1>
            <p className="text-muted-foreground">
              We'll review your application within 48 hours. If you're a fit, you'll receive 
              an email with next steps. No sales calls. No BS.
            </p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container max-w-lg">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Apply for <span className="text-gradient-gold">Terrible Coaching</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            This takes 3 minutes. Be honest—that's the whole point.
          </p>

          {/* Track Badge */}
          <div className="mb-6 flex items-center justify-between rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <span className={cn(
                "text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full",
                track === "business"
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/10 text-foreground"
              )}>
                {track === "business" ? "Business Track" : "Life Track"}
              </span>
              <span className="text-sm text-muted-foreground">
                {track === "business" ? "$199/month" : "$99/month"}
              </span>
            </div>
            <Link
              to={`/apply?track=${track === "business" ? "life" : "business"}`}
              onClick={() => {
                setTrack(track === "business" ? "life" : "business");
                setCoachingInterest(track === "business" ? "life" : "business");
              }}
              className="text-xs text-primary hover:underline font-medium"
            >
              Switch to {track === "business" ? "Life" : "Business"} Track
            </Link>
          </div>

          {/* Process Timeline */}
          <div className="flex items-center justify-between mb-10 px-2">
            {[
              { step: 1, label: "Submit Application", detail: "today" },
              { step: 2, label: "Review (48 hrs)", detail: "we read it" },
              { step: 3, label: "Onboarding Call", detail: "we level set" },
              { step: 4, label: "Day 1 Begins", detail: "system activates" },
            ].map((item, i) => (
              <div key={item.step} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center text-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2",
                    item.step === 1
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-muted-foreground/30 bg-muted/30 text-muted-foreground/50"
                  )}>
                    {item.step}
                  </div>
                  <p className={cn(
                    "text-[11px] font-semibold mt-1.5 leading-tight",
                    item.step === 1 ? "text-primary" : "text-muted-foreground/50"
                  )}>{item.label}</p>
                  <p className={cn(
                    "text-[10px] mt-0.5",
                    item.step === 1 ? "text-primary/70" : "text-muted-foreground/30"
                  )}>{item.detail}</p>
                </div>
                {i < 3 && (
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-primary/40 to-muted-foreground/20 mx-2 mt-[-18px]" />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Your name" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required className="mt-1.5" />
              </div>
            </div>

            <div>
              <Label htmlFor="occupation">Occupation / Role</Label>
              <Input id="occupation" placeholder="e.g. Teacher, Entrepreneur, Parent, Sales Rep, Student, whatever you are" required className="mt-1.5" />
            </div>

            <div>
              <Label>Coaching Interest</Label>
              <Select required value={coachingInterest} onValueChange={(v) => {
                setCoachingInterest(v);
                if (v === "business") setTrack("business");
                else if (v === "life") setTrack("life");
              }}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business Coaching</SelectItem>
                  <SelectItem value="life">Life Coaching</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Business-specific fields */}
            {track === "business" && (
              <div className="space-y-5 rounded-lg border-2 border-primary/20 bg-primary/[0.02] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Business Track Details</p>
                
                <div>
                  <Label htmlFor="businessName">Business Name (optional)</Label>
                  <Input id="businessName" placeholder="Your company name" className="mt-1.5" />
                </div>

                <div>
                  <Label>Industry</Label>
                  <Select>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions.map(i => (
                        <SelectItem key={i} value={i}>{i}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Current Annual Revenue Range</Label>
                  <Select>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-revenue">Pre-revenue</SelectItem>
                      <SelectItem value="under-100k">Under $100K</SelectItem>
                      <SelectItem value="100k-500k">$100K–$500K</SelectItem>
                      <SelectItem value="500k-1m">$500K–$1M</SelectItem>
                      <SelectItem value="over-1m">Over $1M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Team Size</Label>
                  <Select>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo</SelectItem>
                      <SelectItem value="2-5">2–5</SelectItem>
                      <SelectItem value="6-15">6–15</SelectItem>
                      <SelectItem value="16-50">16–50</SelectItem>
                      <SelectItem value="50+">50+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="avoidedDecision">Biggest business decision you're currently avoiding</Label>
                  <Textarea
                    id="avoidedDecision"
                    placeholder="Be specific. This is the first honest thing you'll do here."
                    className="mt-1.5 min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="decisionOutcome">What would change in your business if you made that decision?</Label>
                  <Textarea
                    id="decisionOutcome"
                    placeholder="Connect the decision to the outcome."
                    className="mt-1.5 min-h-[80px]"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="challenge">What's your main challenge right now?</Label>
              <Textarea id="challenge" placeholder="Be specific. What's actually not working?" required className="mt-1.5 min-h-[100px]" />
            </div>

            <div>
              <Label htmlFor="goals">What would you want to accomplish in the first 30 days?</Label>
              <Textarea id="goals" placeholder="Name 1-3 specific, measurable goals" required className="mt-1.5 min-h-[80px]" />
            </div>

            <div>
              <Label>Readiness Level</Label>
              <Select required>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="How ready are you?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ready">Ready now—let's go</SelectItem>
                  <SelectItem value="soon">Interested—deciding soon</SelectItem>
                  <SelectItem value="exploring">Just exploring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Prior Coaching Experience</Label>
              <Select>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Have you worked with a coach before?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No prior coaching</SelectItem>
                  <SelectItem value="some">Some experience</SelectItem>
                  <SelectItem value="extensive">Extensive experience</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>What level of support are you looking for? <span className="text-destructive">*</span></Label>
              <div className="grid gap-3 mt-3">
                {supportOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSupportLevel(option.value)}
                    className={cn(
                      "text-left rounded-lg border-2 p-4 transition-all",
                      supportLevel === option.value
                        ? "border-amber-500/80 bg-amber-500/5"
                        : "border-muted hover:border-muted-foreground/30"
                    )}
                  >
                    <p className={cn(
                      "font-semibold text-sm",
                      supportLevel === option.value ? "text-amber-400" : "text-foreground"
                    )}>
                      {option.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {option.subtitle}
                    </p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic mt-2.5">
                This helps us match you to the right structure. There's no wrong answer.
              </p>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full text-base mt-4">
              Submit Application
            </Button>

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              By applying, you understand that Terrible Coaching is not therapy and is not a 
              substitute for licensed mental health care. All sales are final. 
              No refunds are issued after payment is processed. You may cancel your 
              subscription after your first 30 days at any time with no further charges.
            </p>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}
