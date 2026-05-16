import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type TrackKey = "life" | "operator" | "direct" | "unsure";

const tracks: { value: TrackKey; label: string; price: string }[] = [
  { value: "life", label: "Life Track", price: "$99/mo founding" },
  { value: "operator", label: "Operator Track", price: "$199/mo founding" },
  { value: "direct", label: "Direct", price: "$1,000/mo founding" },
  { value: "unsure", label: "Not sure", price: "We'll help you choose" },
];

const goalAreaOptions = [
  "Health / fitness / routine",
  "Business / revenue / clients",
  "Career / performance",
  "Content / brand / audience",
  "Money / discipline",
  "Relationships / personal standards",
  "Other",
];

const ynUnsure = [
  { v: "yes", l: "Yes" },
  { v: "no", l: "No" },
  { v: "unsure", l: "I am not sure" },
];

const ynClarify = [
  { v: "yes", l: "Yes" },
  { v: "no", l: "No" },
  { v: "clarification", l: "I need clarification" },
];

const podVisibility = [
  { v: "yes", l: "Yes" },
  { v: "no", l: "No" },
  { v: "private_only", l: "Only if private details are hidden" },
];

const truthOptions = [
  { v: "yes", l: "Yes" },
  { v: "no", l: "No" },
  { v: "depends", l: "Depends on the day" },
];

export default function ApplyPage() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [crisisBlocked, setCrisisBlocked] = useState(false);

  const [track, setTrack] = useState<TrackKey>("life");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [goals30Day, setGoals30Day] = useState("");
  const [triedBefore, setTriedBefore] = useState("");
  const [avoiding, setAvoiding] = useState("");
  const [goalArea, setGoalArea] = useState("");
  const [willingCheckins, setWillingCheckins] = useState("");
  const [willingEvidence, setWillingEvidence] = useState("");
  const [podVisOk, setPodVisOk] = useState("");
  const [understandsNotTherapy, setUnderstandsNotTherapy] = useState("");
  const [inCrisis, setInCrisis] = useState("");
  const [breachAck, setBreachAck] = useState(false);
  const [truthReadiness, setTruthReadiness] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Subscription disclosure
  const [agreeSubscription, setAgreeSubscription] = useState(false);
  const [agreeBreach, setAgreeBreach] = useState(false);
  const [agreeNotTherapy, setAgreeNotTherapy] = useState(false);
  const [agreeCancellation, setAgreeCancellation] = useState(false);

  useEffect(() => {
    const t = searchParams.get("track");
    if (t === "operator" || t === "business") setTrack("operator");
    else if (t === "direct") setTrack("direct");
    else if (t === "life") setTrack("life");
  }, [searchParams]);

  // Crisis block
  useEffect(() => {
    setCrisisBlocked(inCrisis === "yes");
  }, [inCrisis]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (crisisBlocked) {
      toast({ title: "We cannot accept this application", description: "Please reach out to a licensed professional.", variant: "destructive" });
      return;
    }
    if (!breachAck) {
      toast({ title: "Acknowledgment required", description: "Please acknowledge the Commitment Breach Fee.", variant: "destructive" });
      return;
    }
    if (!agreeSubscription || !agreeBreach || !agreeNotTherapy || !agreeCancellation) {
      toast({ title: "Subscription + commitment terms", description: "Please agree to all four subscription terms.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const trackForDb = track === "unsure" ? "life" : track;
      const coachingInterest = track === "life" ? "life" : "business";
      const { error } = await supabase.from("applications").insert({
        name,
        email,
        coaching_interest: coachingInterest,
        track: trackForDb,
        goals_30_day: goals30Day,
        tried_before: triedBefore,
        avoiding,
        goal_area: goalArea,
        willing_checkins: willingCheckins,
        willing_evidence: willingEvidence,
        pod_visibility_ok: podVisOk,
        understands_not_therapy: understandsNotTherapy === "yes",
        in_crisis: false,
        breach_fee_acknowledged: breachAck,
        truth_readiness: truthReadiness,
        additional_notes: additionalNotes,
        subscription_terms_agreed: agreeSubscription,
        breach_terms_agreed: agreeBreach,
        not_therapy_agreed: agreeNotTherapy,
        cancellation_terms_agreed: agreeCancellation,
      } as any);

      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Application received", description: "We'll get back to you within 48 hours." });
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
            <h1 className="font-display text-3xl font-bold mb-4">Application received.</h1>
            <p className="text-muted-foreground mb-6">
              If accepted, you will receive the next step within 48 hours.
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
        <div className="container max-w-2xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Apply for <span className="text-gradient-gold">Terrible Coaching</span>
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            This is not a motivation group. This is a commitment system. The questionnaire helps us determine whether you are a fit, which track makes sense, and what kind of pod you should be matched with.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name & Email */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" required className="mt-1.5" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required className="mt-1.5" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            {/* Q1: Track */}
            <div>
              <Label>1. Which track are you applying for? <span className="text-destructive">*</span></Label>
              <div className="grid gap-3 mt-3 sm:grid-cols-2">
                {tracks.map(t => (
                  <button key={t.value} type="button" onClick={() => setTrack(t.value)}
                    className={cn(
                      "text-left rounded-lg border-2 p-4 transition-all",
                      track === t.value ? "border-primary/80 bg-primary/5" : "border-border hover:border-muted-foreground/30"
                    )}>
                    <p className={cn("font-semibold text-sm", track === t.value ? "text-primary" : "text-foreground")}>{t.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div>
              <Label htmlFor="goals">2. What is the main goal you want to hit in the next 90 days? <span className="text-destructive">*</span></Label>
              <Textarea id="goals" required className="mt-1.5 min-h-[90px]" value={goals30Day} onChange={e => setGoals30Day(e.target.value)} />
            </div>

            {/* Q3 */}
            <div>
              <Label htmlFor="tried">3. What have you already tried that did not work?</Label>
              <Textarea id="tried" className="mt-1.5 min-h-[80px]" value={triedBefore} onChange={e => setTriedBefore(e.target.value)} />
            </div>

            {/* Q4 */}
            <div>
              <Label htmlFor="avoiding">4. What do you keep avoiding? <span className="text-destructive">*</span></Label>
              <Textarea id="avoiding" required className="mt-1.5 min-h-[80px]" value={avoiding} onChange={e => setAvoiding(e.target.value)} />
            </div>

            {/* Q5 */}
            <div>
              <Label>5. Which area best describes your goal? <span className="text-destructive">*</span></Label>
              <div className="grid gap-2 mt-3 sm:grid-cols-2">
                {goalAreaOptions.map(opt => (
                  <button key={opt} type="button" onClick={() => setGoalArea(opt)}
                    className={cn(
                      "text-left rounded-lg border-2 px-3 py-2 text-sm transition-all",
                      goalArea === opt ? "border-primary/80 bg-primary/5 text-primary" : "border-border text-foreground hover:border-muted-foreground/30"
                    )}>{opt}</button>
                ))}
              </div>
            </div>

            {/* Q6 */}
            <RadioRow
              label="6. Are you willing to complete weekly check-ins?"
              options={ynUnsure}
              value={willingCheckins}
              onChange={setWillingCheckins}
              required
            />

            {/* Q7 */}
            <RadioRow
              label="7. Are you willing to submit evidence when your commitment requires it?"
              options={ynClarify}
              value={willingEvidence}
              onChange={setWillingEvidence}
              required
            />

            {/* Q8 */}
            <RadioRow
              label="8. Are you comfortable with your pod seeing your completion percentage, streak, and commitment ratio?"
              options={podVisibility}
              value={podVisOk}
              onChange={setPodVisOk}
              required
            />

            {/* Q9 */}
            <RadioRow
              label="9. Do you understand that Terrible Coaching is not therapy, counseling, crisis care, diagnosis, or treatment?"
              options={[{ v: "yes", l: "Yes" }, { v: "no", l: "No" }]}
              value={understandsNotTherapy}
              onChange={setUnderstandsNotTherapy}
              required
            />

            {/* Q10 — Crisis */}
            <RadioRow
              label="10. Are you currently in crisis, at risk of harming yourself or someone else, or seeking clinical mental health care from this program?"
              options={[{ v: "no", l: "No" }, { v: "yes", l: "Yes" }]}
              value={inCrisis}
              onChange={setInCrisis}
              required
            />

            {crisisBlocked && (
              <div className="rounded-lg border-2 border-danger/40 bg-danger/5 p-5">
                <p className="font-display font-bold text-foreground mb-2">Terrible Coaching is not the right support for this moment.</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Please contact a licensed mental health professional, emergency services, or a crisis support line in your area. In the US, you can dial or text <strong>988</strong> for the Suicide &amp; Crisis Lifeline.
                </p>
              </div>
            )}

            {/* Q11 — Breach Fee acknowledgment */}
            <div className="rounded-lg border-2 border-border bg-card p-5">
              <Label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={breachAck} onCheckedChange={(v) => setBreachAck(v === true)} className="mt-0.5" />
                <span className="text-sm text-foreground/90 leading-relaxed">
                  11. I understand that a <strong>$75 Commitment Breach Fee</strong> may apply if I miss required check-ins, fail to submit evidence, ghost the system, or break controllable commitments I agreed to.
                </span>
              </Label>
            </div>

            {/* Q12 */}
            <RadioRow
              label="12. Are you ready to be told the truth about your patterns?"
              options={truthOptions}
              value={truthReadiness}
              onChange={setTruthReadiness}
              required
            />

            {/* Q13 */}
            <div>
              <Label htmlFor="notes">13. Anything else we should know before reviewing your application?</Label>
              <Textarea id="notes" className="mt-1.5 min-h-[80px]" value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} />
            </div>

            {/* Subscription + Commitment Terms */}
            <div className="rounded-xl border-2 border-primary/30 bg-primary/[0.03] p-6">
              <h3 className="font-display font-bold text-foreground mb-4">Subscription + Commitment Terms</h3>
              <div className="text-xs text-muted-foreground space-y-3 leading-relaxed mb-5 max-h-72 overflow-y-auto pr-2">
                <p>By subscribing, I understand that Terrible Coaching is a recurring monthly subscription. My selected track will renew monthly until I cancel.</p>
                <p>I understand my membership includes a 60-minute initial coaching call, monthly goals, weekly check-ins, evidence-based accountability, pod matching, unlimited in-app messaging, and access to the monthly Reset Call if needed.</p>
                <p>I understand Terrible Coaching is not therapy, counseling, medical care, crisis care, diagnosis, or treatment.</p>
                <p>I understand that my pod may see my completion percentage, streak, and commitment ratio, but not my private evidence or personal details unless I choose to share them.</p>
                <p>I understand that a $75 Commitment Breach Fee may apply if I miss a required check-in, fail to submit required evidence, ghost the system, or break a controllable commitment I agreed to.</p>
                <p>I understand that missing an outcome target is different from breaching a controllable commitment. Honest failure gets reviewed. Avoidance gets reset.</p>
                <p>I understand that if a Commitment Breach Fee applies, I may be automatically enrolled in the monthly Reset Call.</p>
                <p>I understand that fees may be waived at the coach's discretion when life genuinely happens.</p>
                <p>I understand that payments are non-refundable after my initial coaching call has been completed.</p>
                <p>I understand that I may cancel my subscription before my next billing cycle to avoid future subscription charges.</p>
              </div>
              <div className="space-y-3">
                <CheckRow checked={agreeSubscription} onChange={setAgreeSubscription} label="I agree to the subscription terms." />
                <CheckRow checked={agreeBreach} onChange={setAgreeBreach} label="I agree to the Commitment Breach Fee terms." />
                <CheckRow checked={agreeNotTherapy} onChange={setAgreeNotTherapy} label="I understand this is not therapy or mental health care." />
                <CheckRow checked={agreeCancellation} onChange={setAgreeCancellation} label="I understand cancellation stops future billing but does not refund completed services." />
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full text-base" disabled={submitting || crisisBlocked}>
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>

            <div className="rounded-lg border border-border bg-card/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">After you apply:</p>
              <div className="space-y-2">
                {[
                  "We review within 48 hours",
                  "If accepted, your 60-minute coaching call is scheduled",
                  "Monthly goals and weekly commitments are built from that call",
                  "Evidence requirements are set per commitment",
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
              By applying, you confirm that Terrible Coaching is not therapy, counseling, crisis care, diagnosis, or treatment. See our{" "}
              <Link to="/legal/subscription" className="underline">Subscription &amp; Fee Terms</Link> and{" "}
              <Link to="/legal/disclaimer" className="underline">Coaching Disclaimer</Link>.
            </p>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function RadioRow({ label, options, value, onChange, required }: {
  label: string;
  options: { v: string; l: string }[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
      <div className="flex flex-wrap gap-2 mt-3">
        {options.map(o => (
          <button key={o.v} type="button" onClick={() => onChange(o.v)}
            className={cn(
              "rounded-lg border-2 px-4 py-2 text-sm transition-all",
              value === o.v ? "border-primary/80 bg-primary/5 text-primary font-medium" : "border-border text-foreground hover:border-muted-foreground/30"
            )}>{o.l}</button>
        ))}
      </div>
    </div>
  );
}

function CheckRow({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Label className="flex items-start gap-3 cursor-pointer">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" />
      <span className="text-sm text-foreground/90 leading-relaxed">{label}</span>
    </Label>
  );
}
