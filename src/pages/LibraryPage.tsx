import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { BookOpen, Check, Clock, Tag, ArrowLeft, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

const categories = ["All", "Mindset", "Execution", "Decision Making", "Habits", "Leadership", "Sales & Revenue", "Relationships"];

const mockContent: ContentItem[] = [
  {
    id: "c1",
    title: "The Gap Between Knowing and Doing",
    category: "Execution",
    contentType: "Article",
    body: "Most people don't have an information problem. They have an execution problem. You already know what to do — you're just not doing it consistently.\n\nThe gap between knowing and doing isn't closed by more knowledge. It's closed by structure, accountability, and honest self-assessment.\n\nHere's what typically happens: you learn something valuable, feel motivated for 48 hours, then return to your default patterns. The insight fades. The behavior stays the same.\n\nThe fix isn't more motivation. It's building systems that make the right action the default action. That's what your goals, check-ins, and stakes are designed to do.\n\nStop collecting insights. Start executing on the ones you already have.",
    keyTakeaway: "Execution beats knowledge. Build systems that make the right action your default.",
    readTimeMinutes: 4,
    isCore: true,
    assignedByCoach: true,
    assignedNote: "Read this before your next check-in. Relates to what we discussed.",
    completed: false,
  },
  {
    id: "c2",
    title: "How to Set Goals That Actually Stick",
    category: "Execution",
    contentType: "Guide",
    body: "A goal without measurement is a wish. A goal without a deadline is a dream. A goal without stakes is optional.\n\nThe Terrible Coaching goal framework requires three things:\n\n1. Specificity — not 'get healthier' but 'run 3x per week for 4 weeks'\n2. Measurability — a clear binary: did you or didn't you?\n3. Time-bound — a deadline that creates urgency\n\nWhen you set your goals, ask yourself: 'If I showed this to my coach, would they be able to verify whether I hit it or not?' If the answer is no, sharpen it.\n\nVague goals are comfortable. Specific goals are terrifying. That's exactly why they work.",
    keyTakeaway: "Make goals specific, measurable, and time-bound. Comfort is the enemy of progress.",
    readTimeMinutes: 5,
    isCore: true,
    completed: true,
    clientReflection: "This hit home. I've been setting goals that are too vague to actually measure.",
  },
  {
    id: "c3",
    title: "Understanding Your DISC Profile in Practice",
    category: "Mindset",
    contentType: "Article",
    body: "Your DISC profile isn't a label — it's a lens. It shows you your natural tendencies, not your limitations.\n\nHigh D types: You'll want to rush through goals. Slow down on the planning phase — it'll save you time later.\n\nHigh I types: You'll be tempted to over-commit. Start with fewer goals and nail them before adding more.\n\nHigh S types: Change is harder for you. Use the system's structure as your anchor when things feel uncertain.\n\nHigh C types: You'll want perfect data before acting. Set a 'good enough' threshold and ship.\n\nThe key isn't to fight your wiring. It's to build compensating systems around your blind spots.",
    keyTakeaway: "Your DISC profile shows tendencies, not limits. Build systems around your blind spots.",
    readTimeMinutes: 6,
    isCore: true,
    completed: false,
  },
  {
    id: "c4",
    title: "The 48-Hour Rule for Decision Making",
    category: "Decision Making",
    contentType: "Framework",
    body: "When facing a decision that's been lingering for more than 48 hours, you're not gathering more information — you're avoiding the discomfort of commitment.\n\nThe 48-Hour Rule: If you've been thinking about a decision for more than 48 hours, decide now. Not tomorrow. Now.\n\nMost decisions are reversible. The cost of delay almost always exceeds the cost of a wrong choice. And you learn more from action than from analysis.\n\nExceptions: decisions involving legal contracts, large financial commitments, or irreversible consequences. Everything else — pull the trigger.",
    keyTakeaway: "If a decision has been lingering for 48 hours, decide now. Delay costs more than mistakes.",
    readTimeMinutes: 3,
    isCore: false,
    completed: false,
  },
  {
    id: "c5",
    title: "Building Habits That Survive Bad Days",
    category: "Habits",
    contentType: "Guide",
    body: "The test of a habit isn't how well it holds up on a good day. It's whether it survives your worst day.\n\nMost habit-building advice assumes you'll always have energy, motivation, and time. You won't.\n\nThe fix: create a 'minimum viable version' of every habit. If your habit is 'run 5 miles,' your minimum version is 'put on running shoes and walk for 10 minutes.' The point isn't the distance — it's maintaining the identity of someone who runs.\n\nOn your worst days, do the minimum. On your best days, do the maximum. Over time, the minimum becomes your baseline.",
    keyTakeaway: "Create a minimum viable version of every habit. Consistency beats intensity.",
    readTimeMinutes: 4,
    isCore: false,
    assignedByCoach: true,
    assignedNote: "Your consistency score was low. This will help.",
    completed: false,
  },
  {
    id: "c6",
    title: "Revenue Is a Reflection of Value Delivered",
    category: "Sales & Revenue",
    contentType: "Article",
    body: "If your revenue isn't where you want it, the question isn't 'how do I sell more?' It's 'how do I deliver more value?'\n\nRevenue follows value. Always. If you're struggling to close, you're either talking to the wrong people, solving the wrong problem, or not communicating the value clearly enough.\n\nStop focusing on tactics. Start focusing on outcomes. What transformation does your client experience? What problem disappears? What becomes possible?\n\nWhen you can answer those questions clearly, selling becomes a conversation about fit — not a pitch.",
    keyTakeaway: "Revenue follows value. Focus on outcomes and transformation, not tactics.",
    readTimeMinutes: 5,
    isCore: false,
    completed: false,
  },
  {
    id: "c7",
    title: "Leading Without Being Liked",
    category: "Leadership",
    contentType: "Article",
    body: "The need to be liked is the fastest path to ineffective leadership. It doesn't mean you should be cruel — it means you should prioritize clarity over comfort.\n\nGreat leaders say what needs to be said, even when it's uncomfortable. They hold standards even when it creates friction. They make decisions based on outcomes, not popularity.\n\nThe paradox: people respect leaders who hold them accountable more than leaders who let things slide. You don't earn respect by being nice. You earn it by being consistent.\n\nStop managing feelings. Start managing standards.",
    keyTakeaway: "Prioritize clarity over comfort. Respect is earned through consistency, not niceness.",
    readTimeMinutes: 5,
    isCore: false,
    completed: false,
  },
  {
    id: "c8",
    title: "The Accountability Paradox in Relationships",
    category: "Relationships",
    contentType: "Article",
    body: "You can't hold others accountable if you're not holding yourself accountable first. That's the paradox.\n\nThe same patterns that show up in your goals — avoidance, vagueness, inconsistency — show up in your relationships too. If you set vague expectations at work, you probably set vague expectations at home.\n\nStart here: practice the same specificity you use in goal-setting in your personal relationships. Say what you need. Set clear expectations. Follow through on your commitments.\n\nAccountability isn't a work tool. It's a life tool.",
    keyTakeaway: "The accountability patterns in your goals mirror your relationship patterns. Fix one, fix both.",
    readTimeMinutes: 4,
    isCore: false,
    completed: false,
  },
];

export default function LibraryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [items, setItems] = useState(mockContent);
  const [reflection, setReflection] = useState("");

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

  if (selectedContent) {
    return (
      <DashboardLayout>
        <button onClick={() => setSelectedContent(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Library
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
            <Textarea
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              placeholder="Write your reflection here..."
              className="min-h-[100px] mb-3"
            />
            <Button variant="outline" size="sm" onClick={saveReflection}>Save Reflection</Button>
          </div>

          <button
            onClick={() => toggleComplete(selectedContent.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              selectedContent.completed
                ? "bg-primary/10 text-primary border border-primary/30"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <Check size={14} /> {selectedContent.completed ? "Completed" : "Mark as Complete"}
          </button>
        </article>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Library</h1>
        <p className="text-muted-foreground mt-1">Curated resources from your coach and the Terrible Coaching system.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors",
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
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
              {item.isCore && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">Core</span>
              )}
              {!item.isCore && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">Targeted</span>
              )}
            </div>

            <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
              {item.title}
            </h3>

            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><Clock size={10} /> {item.readTimeMinutes} min</span>
              {item.assignedByCoach && (
                <span className="flex items-center gap-1 text-primary font-medium"><User size={10} /> Assigned by coach</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={(e) => { e.stopPropagation(); toggleComplete(item.id); }}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-colors",
                  item.completed
                    ? "bg-primary/10 text-primary"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground"
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
    </DashboardLayout>
  );
}
