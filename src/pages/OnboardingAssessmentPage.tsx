import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ArrowRight, Brain, Zap } from "lucide-react";

// ──────────────────────────────────────
// DISC Assessment — 24 question sets
// ──────────────────────────────────────
const discQuestions: { words: [string, string, string, string] }[] = [
  { words: ["Determined", "Enthusiastic", "Patient", "Careful"] },
  { words: ["Competitive", "Inspiring", "Supportive", "Accurate"] },
  { words: ["Bold", "Talkative", "Calm", "Systematic"] },
  { words: ["Decisive", "Optimistic", "Loyal", "Analytical"] },
  { words: ["Direct", "Persuasive", "Predictable", "Perfectionist"] },
  { words: ["Daring", "Charming", "Agreeable", "Precise"] },
  { words: ["Assertive", "Expressive", "Reliable", "Detailed"] },
  { words: ["Demanding", "Sociable", "Gentle", "Cautious"] },
  { words: ["Forceful", "Lively", "Steady", "Logical"] },
  { words: ["Independent", "Cheerful", "Cooperative", "Disciplined"] },
  { words: ["Results-driven", "Fun-loving", "Easygoing", "Methodical"] },
  { words: ["Strong-willed", "Spontaneous", "Considerate", "Restrained"] },
  { words: ["Pioneering", "Animated", "Accommodating", "Thorough"] },
  { words: ["Ambitious", "Convincing", "Thoughtful", "Reserved"] },
  { words: ["Tough", "Popular", "Harmonious", "Orderly"] },
  { words: ["Dominant", "Enthusiastic", "Composed", "Fact-finder"] },
  { words: ["Risk-taker", "Magnetic", "Tolerant", "Structured"] },
  { words: ["Adventurous", "Outgoing", "Mild", "Meticulous"] },
  { words: ["Persistent", "Impulsive", "Relaxed", "Critical-thinker"] },
  { words: ["Action-oriented", "Charismatic", "Understanding", "Exacting"] },
  { words: ["Firm", "Stimulating", "Amiable", "Organized"] },
  { words: ["Commanding", "Vibrant", "Stable", "Conscientious"] },
  { words: ["Driven", "Influential", "Dependable", "Compliant"] },
  { words: ["Self-starter", "Warm", "Sincere", "Diplomatic"] },
];
// word index 0=D, 1=I, 2=S, 3=C

type DiscAnswer = { most: number; least: number };

// ──────────────────────────────────────
// Execution Style — 16 questions
// ──────────────────────────────────────
interface ExecQuestion {
  text: string;
  dimension: "planning" | "consistency" | "motivation" | "risk";
  reversed?: boolean;
}

const execQuestions: ExecQuestion[] = [
  // Planning vs Action (high = planning-biased)
  { text: "I often spend more time planning than doing.", dimension: "planning" },
  { text: "I jump into tasks before fully thinking them through.", dimension: "planning", reversed: true },
  { text: "I feel anxious if I don't have a clear plan before starting.", dimension: "planning" },
  { text: "I'd rather start imperfectly than wait for a perfect plan.", dimension: "planning", reversed: true },
  // Consistency vs Intensity (high = consistent)
  { text: "I prefer steady daily effort over intense bursts.", dimension: "consistency" },
  { text: "I tend to go all-in for a short period, then burn out.", dimension: "consistency", reversed: true },
  { text: "I can maintain the same routine for months without losing interest.", dimension: "consistency" },
  { text: "My productivity fluctuates dramatically week to week.", dimension: "consistency", reversed: true },
  // Internal vs External motivation (high = internal)
  { text: "I'm self-motivated even when no one is watching.", dimension: "motivation" },
  { text: "I perform better when someone is holding me accountable.", dimension: "motivation", reversed: true },
  { text: "External deadlines matter more to me than personal ones.", dimension: "motivation", reversed: true },
  { text: "I set high standards for myself regardless of external expectations.", dimension: "motivation" },
  // Risk tolerance (high = risk-tolerant)
  { text: "I'm comfortable making decisions with incomplete information.", dimension: "risk" },
  { text: "I avoid uncertain situations when possible.", dimension: "risk", reversed: true },
  { text: "I'd rather take a bold risk than play it safe.", dimension: "risk" },
  { text: "I prefer proven methods over experimental approaches.", dimension: "risk", reversed: true },
];

type DiscType = "D" | "I" | "S" | "C";

const discDescriptions: Record<DiscType, { title: string; summary: string }> = {
  D: { title: "Dominance", summary: "You're direct, results-oriented, and decisive. You thrive when you have control over outcomes and can see measurable progress." },
  I: { title: "Influence", summary: "You're social, optimistic, and persuasive. You thrive in collaborative environments and draw energy from connecting with others." },
  S: { title: "Steadiness", summary: "You're patient, reliable, and consistent. You value stability, follow-through, and creating supportive environments for yourself and others." },
  C: { title: "Conscientiousness", summary: "You're analytical, precise, and quality-driven. You value accuracy, thorough preparation, and well-researched decisions." },
};

const businessDiscFraming: Record<DiscType, string> = {
  D: "You decide fast and execute. Watch for decisions made without enough data.",
  I: "You sell ideas well. Watch for avoiding hard conversations with your team or clients.",
  S: "You build loyalty and consistency. Watch for staying in situations too long out of comfort.",
  C: "You analyze well. Watch for analysis becoming a reason not to move.",
};

const executionLabels: Record<string, { low: string; high: string }> = {
  planning: { low: "Action-First", high: "Planner" },
  consistency: { low: "Sprint & Crash", high: "Steady Operator" },
  motivation: { low: "External Fuel", high: "Self-Driven" },
  risk: { low: "Risk-Averse", high: "Risk-Tolerant" },
};

export default function OnboardingAssessmentPage() {
  const [searchParams] = useSearchParams();
  const isBusinessTrack = searchParams.get("track") === "business";
  const [phase, setPhase] = useState<"intro" | "disc" | "disc-result" | "exec" | "exec-result" | "complete">("intro");
  const [discIndex, setDiscIndex] = useState(0);
  const [discAnswers, setDiscAnswers] = useState<DiscAnswer[]>([]);
  const [currentMost, setCurrentMost] = useState<number | null>(null);
  const [currentLeast, setCurrentLeast] = useState<number | null>(null);
  const [execIndex, setExecIndex] = useState(0);
  const [execAnswers, setExecAnswers] = useState<number[]>([]);
  const [discResult, setDiscResult] = useState<{ type: DiscType; scores: Record<DiscType, number> } | null>(null);
  const [execResult, setExecResult] = useState<Record<string, number> | null>(null);

  // DISC scoring
  const scoreDisc = (answers: DiscAnswer[]) => {
    const scores: Record<DiscType, number> = { D: 0, I: 0, S: 0, C: 0 };
    const types: DiscType[] = ["D", "I", "S", "C"];
    answers.forEach(a => {
      scores[types[a.most]] += 2;
      scores[types[a.least]] -= 1;
    });
    const maxType = (Object.keys(scores) as DiscType[]).reduce((a, b) => scores[a] > scores[b] ? a : b);
    return { type: maxType, scores };
  };

  // Execution scoring
  const scoreExecution = (answers: number[]) => {
    const dims: Record<string, number[]> = { planning: [], consistency: [], motivation: [], risk: [] };
    answers.forEach((val, i) => {
      const q = execQuestions[i];
      dims[q.dimension].push(q.reversed ? (6 - val) : val);
    });
    const result: Record<string, number> = {};
    Object.entries(dims).forEach(([dim, vals]) => {
      result[dim] = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 20);
    });
    return result;
  };

  const handleDiscNext = () => {
    if (currentMost === null || currentLeast === null) return;
    const newAnswers = [...discAnswers, { most: currentMost, least: currentLeast }];
    setDiscAnswers(newAnswers);
    setCurrentMost(null);
    setCurrentLeast(null);
    if (discIndex + 1 >= discQuestions.length) {
      const result = scoreDisc(newAnswers);
      setDiscResult(result);
      setPhase("disc-result");
    } else {
      setDiscIndex(discIndex + 1);
    }
  };

  const handleExecAnswer = (val: number) => {
    const newAnswers = [...execAnswers, val];
    setExecAnswers(newAnswers);
    if (execIndex + 1 >= execQuestions.length) {
      const result = scoreExecution(newAnswers);
      setExecResult(result);
      setPhase("exec-result");
    } else {
      setExecIndex(execIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container max-w-2xl">

          {/* ─── INTRO ─── */}
          {phase === "intro" && (
            <div className="text-center">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
                Before we start — <span className="text-gradient-gold">know yourself.</span>
              </h1>
              <p className="text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
                This takes 8 minutes. Your coach reviews this before your onboarding call. Be honest — there are no good or bad results.
              </p>

              <div className="grid gap-5 sm:grid-cols-2 max-w-xl mx-auto">
                <div className="rounded-xl border-2 border-border bg-card p-6 text-left">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Brain className="text-primary" size={20} />
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-1">DISC Profile</h3>
                  <p className="text-xs text-primary font-medium mb-2">How you operate</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Tells us how you make decisions, handle pressure, and prefer to receive feedback.
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">24 questions · ~5 min</p>
                </div>
                <div className="rounded-xl border-2 border-border bg-card p-6 text-left">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Zap className="text-primary" size={20} />
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-1">Execution Style</h3>
                  <p className="text-xs text-primary font-medium mb-2">How you follow through</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Tells us where your execution tends to break down.
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">16 questions · ~3 min</p>
                </div>
              </div>

              <Button variant="hero" size="lg" className="mt-10 text-base px-10" onClick={() => setPhase("disc")}>
                Start Assessment <ArrowRight size={18} />
              </Button>
            </div>
          )}

          {/* ─── DISC QUESTIONS ─── */}
          {phase === "disc" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-foreground">DISC Profile</h2>
                <span className="text-xs text-muted-foreground">{discIndex + 1} / {discQuestions.length}</span>
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full mb-8">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((discIndex + 1) / discQuestions.length) * 100}%` }} />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Select the word that describes you <span className="text-primary font-medium">MOST</span> and <span className="text-danger font-medium">LEAST</span>.</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {discQuestions[discIndex].words.map((word, i) => {
                  const isMost = currentMost === i;
                  const isLeast = currentLeast === i;
                  return (
                    <div key={i} className={cn(
                      "rounded-lg border-2 p-4 text-center transition-all cursor-pointer select-none",
                      isMost ? "border-primary bg-primary/10" :
                      isLeast ? "border-danger bg-danger/10" :
                      "border-border hover:border-muted-foreground/40"
                    )}>
                      <p className="text-sm font-semibold text-foreground mb-3">{word}</p>
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (currentLeast === i) setCurrentLeast(null);
                            setCurrentMost(i);
                          }}
                          className={cn(
                            "text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all",
                            isMost ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                          )}
                        >
                          MOST
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (currentMost === i) setCurrentMost(null);
                            setCurrentLeast(i);
                          }}
                          className={cn(
                            "text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all",
                            isLeast ? "bg-danger text-danger-foreground border-danger" : "border-border text-muted-foreground hover:border-danger hover:text-danger"
                          )}
                        >
                          LEAST
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button
                variant="hero"
                size="lg"
                className="w-full mt-6"
                disabled={currentMost === null || currentLeast === null || currentMost === currentLeast}
                onClick={handleDiscNext}
              >
                {discIndex + 1 === discQuestions.length ? "See Results" : "Next"} <ArrowRight size={16} />
              </Button>
            </div>
          )}

          {/* ─── DISC RESULT ─── */}
          {phase === "disc-result" && discResult && (
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold mb-2">Your DISC Profile</h2>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-primary bg-primary/10 my-6">
                <span className="font-display text-3xl font-black text-primary">{discResult.type}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">{discDescriptions[discResult.type].title}</h3>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed mb-6">
                {discDescriptions[discResult.type].summary}
              </p>

              {/* Score bars */}
              <div className="grid gap-3 max-w-sm mx-auto mb-8">
                {(["D", "I", "S", "C"] as DiscType[]).map(t => {
                  const maxScore = discQuestions.length * 2;
                  const normalized = Math.max(0, Math.round(((discResult.scores[t] + maxScore) / (maxScore * 2)) * 100));
                  return (
                    <div key={t} className="flex items-center gap-3">
                      <span className={cn("w-6 text-xs font-bold", t === discResult.type ? "text-primary" : "text-muted-foreground")}>{t}</span>
                      <div className="flex-1 h-2 bg-secondary rounded-full">
                        <div className={cn("h-full rounded-full transition-all", t === discResult.type ? "bg-primary" : "bg-muted-foreground/40")} style={{ width: `${normalized}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{normalized}%</span>
                    </div>
                  );
                })}
              </div>

              {isBusinessTrack && (
                <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 max-w-lg mx-auto mb-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-warning mb-2">Business Lens</p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {businessDiscFraming[discResult.type]}
                  </p>
                </div>
              )}

              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 max-w-lg mx-auto mb-8">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  This shows how you're wired — not what you're limited to. Your coach will use this to communicate more effectively with you, not to make assumptions about you.
                </p>
              </div>

              <Button variant="hero" size="lg" className="text-base px-10" onClick={() => setPhase("exec")}>
                Continue to Execution Style <ArrowRight size={18} />
              </Button>
            </div>
          )}

          {/* ─── EXECUTION STYLE ─── */}
          {phase === "exec" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-foreground">Execution Style</h2>
                <span className="text-xs text-muted-foreground">{execIndex + 1} / {execQuestions.length}</span>
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full mb-8">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((execIndex + 1) / execQuestions.length) * 100}%` }} />
              </div>
              <p className="text-lg font-medium text-foreground mb-8 leading-relaxed text-center">
                "{execQuestions[execIndex].text}"
              </p>
              <div className="flex flex-col items-center gap-3 max-w-md mx-auto">
                <div className="flex items-center justify-between w-full text-xs text-muted-foreground mb-1">
                  <span>Strongly Disagree</span>
                  <span>Strongly Agree</span>
                </div>
                <div className="flex gap-3 w-full">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      onClick={() => handleExecAnswer(val)}
                      className="flex-1 py-4 rounded-lg border-2 border-border bg-card hover:border-primary hover:bg-primary/10 transition-all text-lg font-bold text-foreground"
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── EXECUTION RESULT ─── */}
          {phase === "exec-result" && execResult && (
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold mb-6">Your Execution Style</h2>
              <div className="grid gap-5 max-w-md mx-auto mb-8">
                {Object.entries(executionLabels).map(([dim, labels]) => {
                  const score = execResult[dim] || 50;
                  return (
                    <div key={dim}>
                      <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                        <span className={score < 50 ? "text-primary" : "text-muted-foreground"}>{labels.low}</span>
                        <span className={score >= 50 ? "text-primary" : "text-muted-foreground"}>{labels.high}</span>
                      </div>
                      <div className="relative h-3 bg-secondary rounded-full">
                        <div className="absolute top-0 left-1/2 w-px h-full bg-border" />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-primary-foreground shadow-md transition-all"
                          style={{ left: `calc(${score}% - 8px)` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-lg border border-border bg-card p-5 max-w-md mx-auto mb-8 text-left">
                <p className="text-sm text-foreground leading-relaxed">
                  {execResult.planning > 60 ? "You lean toward planning before acting — which means structure will serve you, but over-preparation might slow you down." : "You lean toward action over planning — which means momentum is your strength, but you may benefit from more upfront clarity."}
                  {" "}
                  {execResult.consistency > 60 ? "Your consistency is strong — you maintain effort over time." : "You tend toward intense bursts of effort — pacing strategies will be key."}
                  {" "}
                  {execResult.motivation > 60 ? "You're primarily self-driven." : "External accountability gives you a significant boost."}
                  {" "}
                  {execResult.risk > 60 ? "You're comfortable with uncertainty and willing to experiment." : "You prefer proven paths — which means we'll frame experiments as low-risk tests."}
                </p>
              </div>

              <Button variant="hero" size="lg" className="text-base px-10" onClick={() => setPhase("complete")}>
                Complete Assessment <Check size={18} />
              </Button>
            </div>
          )}

          {/* ─── COMPLETE ─── */}
          {phase === "complete" && (
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="font-display text-2xl font-bold mb-3">Assessments Complete</h2>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
                Your coach has been notified and will review your results before your onboarding call.
              </p>
              <Button variant="hero" size="lg" className="text-base px-10" onClick={() => window.location.href = "/dashboard"}>
                Enter Your Portal <ArrowRight size={18} />
              </Button>
            </div>
          )}

        </div>
      </section>
      <Footer />
    </div>
  );
}
