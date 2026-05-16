import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { BookOpen, Check, Clock, ArrowLeft, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── Types ───
interface ContentItem {
  id: string;
  title: string;
  category: string;
  contentType: string;
  body: string;
  keyTakeaway: string;
  readTimeMinutes: number;
  isCore: boolean;
  assignedByCoach?: boolean;
  assignedNote?: string;
  completed: boolean;
  clientReflection?: string;
}

interface PublishedQA {
  id: string;
  weekOf: string;
  question: string;
  answer: string;
  answerFormat: "text" | "voice" | "video";
  answerMediaUrl?: string;
  category: string;
  trackVisibility: "all" | "life" | "business";
  resonanceCount: number;
  hasResonated: boolean;
  isMine: boolean;
}

// ─── Mock Data ───
const qaCategories = ["Mindset", "Habits", "Decisions", "Relationships", "Business", "Leadership", "Execution", "Confidence", "Other"];

const libraryCategories = ["All", "Mindset", "Execution", "Decision Making", "Habits", "Leadership", "Sales & Revenue", "Relationships"];

const mockPublishedQA: PublishedQA[] = [
  {
    id: "qa1",
    weekOf: "Apr 7, 2026",
    question: "How do you stay disciplined when the initial excitement of a new goal wears off and it just feels like grinding?",
    answer: "This is one of the most common patterns I see. The excitement fades around day 10-14, and that's where most people quit.\n\nHere's what actually works: stop relying on excitement entirely. Build your system around the minimum viable version of the habit. If your goal is to run 5 times a week, your minimum is putting on shoes and walking for 10 minutes. The point isn't the distance — it's maintaining the identity of someone who runs.\n\nThe grind isn't the problem. The problem is that you're comparing how you feel now to how you felt on day one. That comparison will always make the present feel worse.\n\nDiscipline isn't a feeling. It's a system. Build the system, and the feeling becomes irrelevant.",
    answerFormat: "text",
    category: "Habits",
    trackVisibility: "all",
    resonanceCount: 14,
    hasResonated: false,
    isMine: false,
  },
  {
    id: "qa2",
    weekOf: "Mar 31, 2026",
    question: "I know I need to have a hard conversation with a business partner but I keep finding reasons to delay it. What's the real issue?",
    answer: "The real issue is rarely the conversation itself. It's the story you're telling yourself about what happens after.\n\nYou're not avoiding the talk — you're avoiding the discomfort of potential conflict, rejection, or change. And every day you delay, you're choosing short-term comfort over long-term clarity.\n\nApply the 48-hour rule: if you've been thinking about this for more than 48 hours, the decision to have the conversation is already made. Now it's just execution.\n\nScript the opening line. Set the meeting. The anxiety before is always worse than the conversation itself.",
    answerFormat: "text",
    category: "Decisions",
    trackVisibility: "business",
    resonanceCount: 8,
    hasResonated: true,
    isMine: false,
  },
  {
    id: "qa3",
    weekOf: "Mar 24, 2026",
    question: "My check-in scores have been flat for three weeks. Same energy, same focus, same stress. How do I break the plateau?",
    answer: "Flat scores aren't always a plateau — sometimes they're stability. But if you're feeling stuck, here's what I'd look at:\n\nFirst, check your goals. Are they still challenging, or have you settled into comfortable targets? Comfort is the enemy of growth.\n\nSecond, look at what you're avoiding. Your Help Radar should have something on it. If it doesn't, you're probably not being honest about where you're stuck.\n\nThird, talk to your pod. The people around you can see patterns you can't. Ask them what they notice.\n\nA plateau breaks when you raise the bar, not when you try harder at the same level.",
    answerFormat: "text",
    category: "Execution",
    trackVisibility: "all",
    resonanceCount: 11,
    hasResonated: false,
    isMine: false,
  },
];

const mockContent: ContentItem[] = [
  {
    id: "c1", title: "The Gap Between Knowing and Doing", category: "Execution", contentType: "Article",
    body: "Most people don't have an information problem. They have an execution problem. You already know what to do — you're just not doing it consistently.\n\nThe gap between knowing and doing isn't closed by more knowledge. It's closed by structure, accountability, and honest self-assessment.\n\nHere's what typically happens: you learn something valuable, feel motivated for 48 hours, then return to your default patterns. The insight fades. The behavior stays the same.\n\nThe fix isn't more motivation. It's building systems that make the right action the default action. That's what your goals, check-ins, and stakes are designed to do.\n\nStop collecting insights. Start executing on the ones you already have.",
    keyTakeaway: "Execution beats knowledge. Build systems that make the right action your default.", readTimeMinutes: 4, isCore: true,
    assignedByCoach: true, assignedNote: "Read this before your next check-in. Relates to what we discussed.", completed: false,
  },
  {
    id: "c2", title: "How to Set Goals That Actually Stick", category: "Execution", contentType: "Guide",
    body: "A goal without measurement is a wish. A goal without a deadline is a dream. A goal without stakes is optional.\n\nThe Terrible Coaching goal framework requires three things:\n\n1. Specificity — not 'get healthier' but 'run 3x per week for 4 weeks'\n2. Measurability — a clear binary: did you or didn't you?\n3. Time-bound — a deadline that creates urgency\n\nWhen you set your goals, ask yourself: 'If I showed this to my coach, would they be able to verify whether I hit it or not?' If the answer is no, sharpen it.\n\nVague goals are comfortable. Specific goals are terrifying. That's exactly why they work.",
    keyTakeaway: "Make goals specific, measurable, and time-bound. Comfort is the enemy of progress.", readTimeMinutes: 5, isCore: true,
    completed: true, clientReflection: "This hit home. I've been setting goals that are too vague to actually measure.",
  },
  {
    id: "c3", title: "Understanding Your DISC Profile in Practice", category: "Mindset", contentType: "Article",
    body: "Your DISC profile isn't a label — it's a lens. It shows you your natural tendencies, not your limitations.",
    keyTakeaway: "Your DISC profile shows tendencies, not limits. Build systems around your blind spots.", readTimeMinutes: 6, isCore: true, completed: false,
  },
  {
    id: "c4", title: "The 48-Hour Rule for Decision Making", category: "Decision Making", contentType: "Framework",
    body: "When facing a decision that's been lingering for more than 48 hours, you're not gathering more information — you're avoiding the discomfort of commitment.",
    keyTakeaway: "If a decision has been lingering for 48 hours, decide now. Delay costs more than mistakes.", readTimeMinutes: 3, isCore: false, completed: false,
  },
  {
    id: "c5", title: "Building Habits That Survive Bad Days", category: "Habits", contentType: "Guide",
    body: "The test of a habit isn't how well it holds up on a good day. It's whether it survives your worst day.",
    keyTakeaway: "Create a minimum viable version of every habit. Consistency beats intensity.", readTimeMinutes: 4, isCore: false,
    assignedByCoach: true, assignedNote: "Your consistency score was low. This will help.", completed: false,
  },
];

// ─── Component ───
export default function LibraryPage() {
  const [pageTab, setPageTab] = useState<"qa" | "library">("qa");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [items, setItems] = useState(mockContent);
  const [reflection, setReflection] = useState("");

  // Q&A state
  const [questionText, setQuestionText] = useState("");
  const [questionCategory, setQuestionCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [publishedQA, setPublishedQA] = useState(mockPublishedQA);

  const coachingTrack = "life"; // would come from auth context

  const handleSubmitQuestion = () => {
    if (questionText.length < 50 || !questionCategory) return;
    setSubmitted(true);
    setQuestionText("");
    setQuestionCategory("");
    setTimeout(() => setSubmitted(false), 6000);
  };

  const toggleResonance = (qaId: string) => {
    setPublishedQA(prev => prev.map(q => q.id === qaId
      ? { ...q, hasResonated: !q.hasResonated, resonanceCount: q.hasResonated ? q.resonanceCount - 1 : q.resonanceCount + 1 }
      : q
    ));
  };

  const toggleMine = (qaId: string) => {
    setPublishedQA(prev => prev.map(q => q.id === qaId ? { ...q, isMine: !q.isMine } : q));
  };

  // Library logic
  const filtered = activeCategory === "All" ? items : items.filter(c => c.category === activeCategory);
  const assigned = filtered.filter(c => c.assignedByCoach);
  const other = filtered.filter(c => !c.assignedByCoach);
  const sortedItems = [...assigned, ...other];

  const toggleComplete = (id: string) => {
    setItems(prev => prev.map(c => c.id === id ? { ...c, completed: !c.completed, clientReflection: c.completed ? c.clientReflection : undefined } : c));
  };

  const openContent = (item: ContentItem) => {
    setSelectedContent(item);
    setReflection(item.clientReflection || "");
  };

  const saveReflection = () => {
    if (!selectedContent) return;
    setItems(prev => prev.map(c => c.id === selectedContent.id ? { ...c, clientReflection: reflection } : c));
    setSelectedContent({ ...selectedContent, clientReflection: reflection });
  };

  // Content detail view
  if (selectedContent) {
    return (
      <DashboardLayout>
        <button onClick={() => setSelectedContent(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Coaching Content
        </button>
        <article className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{selectedContent.category}</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{selectedContent.contentType}</span>
            {selectedContent.isCore && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">Core</span>}
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={10} /> {selectedContent.readTimeMinutes} min read</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">{selectedContent.title}</h1>
          {selectedContent.assignedByCoach && selectedContent.assignedNote && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 mb-6">
              <p className="text-xs font-medium text-primary mb-1 flex items-center gap-1"><User size={10} /> Assigned by your coach</p>
              <p className="text-sm text-foreground/80">{selectedContent.assignedNote}</p>
            </div>
          )}
          <div className="prose prose-sm prose-invert max-w-none mb-8">
            {selectedContent.body.split("\n\n").map((p, i) => (
              <p key={i} className="text-foreground/90 leading-relaxed mb-4">{p}</p>
            ))}
          </div>
          {selectedContent.keyTakeaway && (
            <div className="rounded-lg border border-primary/30 bg-card p-5 mb-8">
              <h3 className="font-display font-semibold text-foreground mb-2">Key Takeaway</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{selectedContent.keyTakeaway}</p>
            </div>
          )}
          <div className="rounded-lg border border-border bg-card p-5 mb-6">
            <h3 className="font-display font-semibold text-foreground mb-1">Your Reflection</h3>
            <p className="text-xs text-muted-foreground mb-3">What stood out? How does this apply to you right now? Your coach can see this.</p>
            <Textarea value={reflection} onChange={e => setReflection(e.target.value)} placeholder="Write your reflection here..." className="min-h-[100px] mb-3" />
            <Button variant="outline" size="sm" onClick={saveReflection}>Save Reflection</Button>
          </div>
          <button onClick={() => toggleComplete(selectedContent.id)} className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
            selectedContent.completed ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted text-muted-foreground hover:text-foreground"
          )}>
            <Check size={14} /> {selectedContent.completed ? "Completed" : "Mark as Complete"}
          </button>
        </article>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Coaching Content</h1>
        <p className="text-muted-foreground mt-1">Weekly perspectives, curated resources, and assigned content from your coach.</p>
      </div>

      {/* Page tabs */}
      <div className="flex gap-2 mb-8">
        {([
          { key: "qa" as const, label: "Weekly Q&A" },
          { key: "library" as const, label: "Library" },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setPageTab(t.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              pageTab === t.key
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── WEEKLY Q&A TAB ─── */}
      {pageTab === "qa" && (
        <div className="space-y-8 max-w-3xl">
          {/* Header */}
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Weekly Q&A</h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Submit a question privately. I answer the highest-value ones in content form — every week. You learn from your own patterns and everyone else's simultaneously.
            </p>
          </div>

          {/* Submission box */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground">Submit a question</label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Private submission. Your name never appears in the answer. Be specific — vague questions get vague answers.
              </p>
            </div>
            <Textarea
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              placeholder="What are you actually trying to figure out right now? Not the surface question — the real one underneath it."
              className="min-h-[120px]"
            />
            {questionText.length > 0 && questionText.length < 50 && (
              <p className="text-xs text-destructive">{50 - questionText.length} more characters needed</p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Category</label>
                <Select value={questionCategory} onValueChange={setQuestionCategory}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {qaCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground w-full">
                  Submitting as: <span className="text-foreground font-medium capitalize">{coachingTrack} Track</span>
                </div>
              </div>
            </div>

            <Button
              variant="hero"
              onClick={handleSubmitQuestion}
              disabled={questionText.length < 50 || !questionCategory}
            >
              Submit Question
            </Button>

            {submitted && (
              <p className="text-sm text-primary">
                Submitted privately. I review all questions on Monday and answer the highest-value ones by Wednesday. Watch this page Thursday.
              </p>
            )}
          </div>

          {/* Published Q&A Feed */}
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Published Answers</h3>
            <div className="space-y-4">
              {publishedQA.map(qa => (
                <div key={qa.id} className="rounded-xl border border-border bg-card p-6">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-xs text-muted-foreground">Week of {qa.weekOf}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{qa.category}</span>
                    <span className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      qa.trackVisibility === "business"
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {qa.trackVisibility === "all" ? "All tracks" : "Operator Track"}
                    </span>
                  </div>

                  {/* Question */}
                  <p className="text-sm italic text-foreground/70 mb-4 leading-relaxed">"{qa.question}"</p>

                  {/* Answer */}
                  <div className="space-y-3 mb-5">
                    {qa.answer.split("\n\n").map((p, i) => (
                      <p key={i} className="text-sm text-foreground/90 leading-relaxed">{p}</p>
                    ))}
                  </div>

                  {qa.answerFormat === "voice" && qa.answerMediaUrl && (
                    <div className="rounded-lg bg-muted/30 border border-border p-3 mb-4">
                      <audio controls className="w-full h-8" src={qa.answerMediaUrl} />
                    </div>
                  )}

                  {qa.answerFormat === "video" && qa.answerMediaUrl && (
                    <div className="rounded-lg bg-muted/30 border border-border p-3 mb-4">
                      <video controls className="w-full rounded" src={qa.answerMediaUrl} />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-3 border-t border-border">
                    <button
                      onClick={() => toggleResonance(qa.id)}
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors",
                        qa.hasResonated
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      {qa.resonanceCount} resonated
                    </button>

                    <button
                      onClick={() => toggleMine(qa.id)}
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-md transition-colors",
                        qa.isMine
                          ? "bg-primary/10 text-primary border border-primary/30 font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {qa.isMine ? "This was my question" : "This was my question"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── LIBRARY TAB ─── */}
      {pageTab === "library" && (
        <>
          {/* Filter tabs */}
          <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
            {libraryCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors",
                  activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Content grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedItems.map(item => (
              <button
                key={item.id}
                onClick={() => openContent(item)}
                className="text-left rounded-xl border border-border bg-card p-5 shadow-card hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{item.category}</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{item.contentType}</span>
                  {item.isCore && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">Core</span>}
                  {!item.isCore && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">Targeted</span>}
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">{item.title}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Clock size={10} /> {item.readTimeMinutes} min</span>
                  {item.assignedByCoach && <span className="flex items-center gap-1 text-primary font-medium"><User size={10} /> Assigned by coach</span>}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleComplete(item.id); }}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-colors",
                      item.completed ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center",
                      item.completed ? "bg-primary border-primary" : "border-muted-foreground/40"
                    )}>
                      {item.completed && <Check size={10} className="text-primary-foreground" />}
                    </div>
                    {item.completed ? "Completed" : "Not started"}
                  </button>
                  <BookOpen size={14} className="text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>
          {sortedItems.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
              <p>No content in this category yet.</p>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
