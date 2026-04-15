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
import { supabase } from "@/integrations/supabase/client";

const industryOptions = [
  "SaaS / Technology", "E-commerce / Retail", "Professional Services", "Healthcare", "Real Estate",
  "Finance / Fintech", "Marketing / Advertising", "Construction / Trades", "Education", "Food & Beverage",
  "Manufacturing", "Media / Content", "Legal", "Non-Profit", "Other",
];

const communityMotivationOptions = [
  {
    value: "accountability",
    title: "Accountability I can't create alone",
    desc: "I need people who will notice when I go quiet and call me on it.",
  },
  {
    value: "understanding",
    title: "People who understand what I'm going through",
    desc: "I want to be around people who are working as hard as I am on things that actually matter.",
  },
  {
    value: "both",
    title: "Both — I need the structure and the right room equally",
    desc: "",
  },
];

const accountabilityStyleOptions = [
  { value: "restart", label: "I restart immediately and don't dwell on it" },
  { value: "understand", label: "I need to understand why before I can move forward" },
  { value: "external", label: "I need external pressure to get back on track" },
  { value: "avoid", label: "I tend to avoid it and hope no one notices" },
];

const supportOptions = [
  {
    value: "accountability_only",
    title: "System + Accountability",
    subtitle: "I'm self-directed. I need structure, a scorecard, and consequences.",
  },
  {
    value: "monthly_coaching",
    title: "System + Monthly Coaching",
    subtitle: "I want the full accountability system plus a dedicated monthly coaching call.",
  },
  {
    value: "undecided",
    title: "I'm not sure yet",
    subtitle: "I'll figure it out once I understand the program better.",
  },
];

export default function ApplyPage() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [supportLevel, setSupportLevel] = useState("");
  const [coachingInterest, setCoachingInterest] = useState("");
  const [track, setTrack] = useState<"life" | "business" | "direct">("life");

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [challenge, setChallenge] = useState("");
  const [goals30Day, setGoals30Day] = useState("");
  const [readiness, setReadiness] = useState("");
  const [priorCoaching, setPriorCoaching] = useState("");
  const [communityMotivation, setCommunityMotivation] = useState("");
  const [accountabilityStyle, setAccountabilityStyle] = useState("");

  // Business-specific
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [revenueRange, setRevenueRange] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [avoidedDecision, setAvoidedDecision] = useState("");
  const [decisionOutcome, setDecisionOutcome] = useState("");

  useEffect(() => {
    const t = searchParams.get("track");
    if (t === "business") { setTrack("business"); setCoachingInterest("business"); }
    else if (t === "direct") { setTrack("direct"); setCoachingInterest("business"); }
    else { setTrack("life"); setCoachingInterest("life"); }
  }, [searchParams]);

  const isBusiness = track === "business" || track === "direct";

  const trackLabel = track === "direct" ? "Direct" : track === "business" ? "Business Track" : "Life Track";
  const trackPrice = track === "direct" ? "$1,000/month" : track === "business" ? "$199/month" : "$99/month";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportLevel) {
      toast({ title: "Required field", description: "Please select your preferred level of support.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("applications").insert({
        name,
        email,
        occupation,
        coaching_interest: coachingInterest || "life",
        track: track === "direct" ? "direct" : track,
        challenge,
        goals_30_day: goals30Day,
        readiness,
        prior_coaching: priorCoaching,
        support_level: supportLevel,
        community_motivation: communityMotivation || null,
        accountability_style: accountabilityStyle || null,
        business_name: isBusiness ? businessName || null : null,
        industry: isBusiness ? industry || null : null,
        revenue_range: isBusiness ? revenueRange || null : null,
        team_size: isBusiness ? teamSize || null : null,
        avoided_decision: isBusiness ? avoidedDecision || null : null,
        decision_outcome: isBusiness ? decisionOutcome || null : null,
      } as any);

      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Application submitted", description: "We'll review your application within 48 hours." });
    } catch (err: any) {
      console.error("Application submission error:", err);
      toast({ title: "Error submitting application", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-20 md:pt-40">
          <div className="container max-w-lg text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Application Received</h1>
            <p className="text-muted-foreground mb-6">
              We'll review your application within 48 hours. If you're a fit, you'll receive an email with next steps. No sales calls. No BS.
            </p>
            <div className="text-left max-w-sm mx-auto space-y-2">
              {[
                "We review within 48 hours",
                "You complete your personality assessment",
                "Your coaching call is scheduled",
                "Your 30-60-90 goals are built from that call",
                "You're matched to your pod",
                "Day 1 begins",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="text-primary font-display font-bold text-xs mt-0.5">{i + 1}.</span>
                  {step}
                </div>
              ))}
            </div>
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
            This takes 3 minutes. Be honest — that's the whole point.
          </p>

          {/* Track Badge */}
          <div className="mb-8 flex items-center justify-between rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <span className={cn(
                "text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full",
                track === "direct"
                  ? "bg-primary text-primary-foreground"
                  : track === "business"
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/10 text-foreground"
              )}>
                {trackLabel}
              </span>
              <span className="text-sm text-muted-foreground">{trackPrice}</span>
            </div>
            <Link
              to="/apply/select"
              className="text-xs text-primary hover:underline font-medium"
            >
              Change track
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Email */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Your name" required className="mt-1.5" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required className="mt-1.5" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <Label htmlFor="occupation">Occupation / Role</Label>
              <Input id="occupation" placeholder="e.g. Teacher, Entrepreneur, Sales Rep" required className="mt-1.5" value={occupation} onChange={e => setOccupation(e.target.value)} />
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

            {/* Community Motivation — ALL TRACKS */}
            <div>
              <Label>What are you most hoping to get from the Terrible Coaching community? <span className="text-destructive">*</span></Label>
              <div className="grid gap-3 mt-3">
                {communityMotivationOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCommunityMotivation(opt.value)}
                    className={cn(
                      "text-left rounded-lg border-2 p-4 transition-all",
                      communityMotivation === opt.value
                        ? "border-primary/80 bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    )}
                  >
                    <p className={cn(
                      "font-semibold text-sm",
                      communityMotivation === opt.value ? "text-primary" : "text-foreground"
                    )}>{opt.title}</p>
                    {opt.desc && (
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{opt.desc}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Accountability Style — ALL TRACKS */}
            <div>
              <Label>How do you typically respond when you fall behind on a commitment? <span className="text-destructive">*</span></Label>
              <div className="grid gap-3 mt-3">
                {accountabilityStyleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAccountabilityStyle(opt.value)}
                    className={cn(
                      "text-left rounded-lg border-2 p-4 transition-all",
                      accountabilityStyle === opt.value
                        ? "border-primary/80 bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    )}
                  >
                    <p className={cn(
                      "font-medium text-sm",
                      accountabilityStyle === opt.value ? "text-primary" : "text-foreground"
                    )}>{opt.label}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic mt-2">
                Used alongside your personality assessment for pod matching. No wrong answer.
              </p>
            </div>

            {/* Business-specific fields */}
            {isBusiness && (
              <div className="space-y-5 rounded-lg border-2 border-primary/20 bg-primary/[0.02] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  {track === "direct" ? "Direct Track Details" : "Business Track Details"}
                </p>

                <div>
                  <Label htmlFor="businessName">Business Name (optional)</Label>
                  <Input id="businessName" placeholder="Your company name" className="mt-1.5" value={businessName} onChange={e => setBusinessName(e.target.value)} />
                </div>

                <div>
                  <Label>Industry</Label>
                  <Select value={industry} onValueChange={setIndustry}>
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
                  <Select value={revenueRange} onValueChange={setRevenueRange}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-revenue">Pre-revenue</SelectItem>
                      <SelectItem value="under-100k">Under $100K</SelectItem>
                      <SelectItem value="100k-500k">$100K-$500K</SelectItem>
                      <SelectItem value="500k-1m">$500K-$1M</SelectItem>
                      <SelectItem value="over-1m">Over $1M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Team Size</Label>
                  <Select value={teamSize} onValueChange={setTeamSize}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo</SelectItem>
                      <SelectItem value="2-5">2-5</SelectItem>
                      <SelectItem value="6-15">6-15</SelectItem>
                      <SelectItem value="16-50">16-50</SelectItem>
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
                    value={avoidedDecision}
                    onChange={e => setAvoidedDecision(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="decisionOutcome">What would change in your business if you made that decision?</Label>
                  <Textarea
                    id="decisionOutcome"
                    placeholder="Connect the decision to the outcome."
                    className="mt-1.5 min-h-[80px]"
                    value={decisionOutcome}
                    onChange={e => setDecisionOutcome(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="challenge">What's your main challenge right now?</Label>
              <Textarea id="challenge" placeholder="Be specific. What's actually not working?" required className="mt-1.5 min-h-[100px]" value={challenge} onChange={e => setChallenge(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="goals">What would you want to accomplish in the first 30 days?</Label>
              <Textarea id="goals" placeholder="Name 1-3 specific, measurable goals" required className="mt-1.5 min-h-[80px]" value={goals30Day} onChange={e => setGoals30Day(e.target.value)} />
            </div>

            <div>
              <Label>Readiness Level</Label>
              <Select required value={readiness} onValueChange={setReadiness}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="How ready are you?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ready">Ready now — let's go</SelectItem>
                  <SelectItem value="soon">Interested — deciding soon</SelectItem>
                  <SelectItem value="exploring">Just exploring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Prior Coaching Experience</Label>
              <Select value={priorCoaching} onValueChange={setPriorCoaching}>
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
                        ? "border-primary/80 bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    )}
                  >
                    <p className={cn(
                      "font-semibold text-sm",
                      supportLevel === option.value ? "text-primary" : "text-foreground"
                    )}>{option.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{option.subtitle}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full text-base mt-4" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>

            {/* Post-submit flow */}
            <div className="rounded-lg border border-border bg-card/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">After you apply:</p>
              <div className="space-y-2">
                {[
                  "We review within 48 hours",
                  "You complete your personality assessment",
                  "Your coaching call is scheduled",
                  "Your 30-60-90 goals are built from that call",
                  "You're matched to your pod",
                  "Day 1 begins",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-primary/60 font-display font-bold text-xs mt-0.5">{i + 1}.</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>

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
