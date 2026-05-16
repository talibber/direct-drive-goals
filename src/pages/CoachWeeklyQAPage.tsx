import { useState } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── Types ───
interface SubmittedQuestion {
  id: string;
  clientName: string;
  clientId: string;
  track: string;
  category: string;
  questionText: string;
  submittedAt: string;
  status: "pending" | "selected" | "not_selected";
  clusterId?: string;
}

interface QuestionCluster {
  id: string;
  theme: string;
  questions: SubmittedQuestion[];
}

interface PublishedQA {
  id: string;
  weekOf: string;
  question: string;
  answer: string;
  answerFormat: string;
  category: string;
  trackVisibility: string;
  resonanceCount: number;
  mineCount: number;
}

// ─── Mock Data ───
const mockQuestions: SubmittedQuestion[] = [
  { id: "q1", clientName: "Marcus J.", clientId: "1", track: "life", category: "Habits", questionText: "How do I stay consistent when I'm traveling for work? My routines completely fall apart every time I'm on the road.", submittedAt: "Apr 14", status: "pending" },
  { id: "q2", clientName: "Sarah K.", clientId: "2", track: "business", category: "Decisions", questionText: "I keep delaying hiring my first employee because I'm afraid they won't care as much as I do. How do I get past this?", submittedAt: "Apr 14", status: "pending" },
  { id: "q3", clientName: "James R.", clientId: "3", track: "life", category: "Habits", questionText: "My habits break down every time I travel. How do you build something portable?", submittedAt: "Apr 13", status: "pending" },
  { id: "q4", clientName: "Aisha T.", clientId: "4", track: "business", category: "Leadership", questionText: "How do I hold my team accountable without micromanaging? I feel like I'm either too loose or too controlling.", submittedAt: "Apr 13", status: "pending" },
  { id: "q5", clientName: "David L.", clientId: "5", track: "life", category: "Confidence", questionText: "I hit my goals last month but I still don't feel like I've made real progress. Why doesn't achievement feel like enough?", submittedAt: "Apr 12", status: "pending" },
  { id: "q6", clientName: "Priya M.", clientId: "6", track: "business", category: "Execution", questionText: "I have three projects competing for my attention and I can't focus on any of them properly. How do I choose?", submittedAt: "Apr 11", status: "pending" },
];

const mockPublished: PublishedQA[] = [
  {
    id: "pub1", weekOf: "Apr 7, 2026",
    question: "How do you stay disciplined when the initial excitement of a new goal wears off?",
    answer: "This is one of the most common patterns I see...",
    answerFormat: "text", category: "Habits", trackVisibility: "all",
    resonanceCount: 14, mineCount: 1,
  },
];

const qaCategories = ["Mindset", "Habits", "Decisions", "Relationships", "Business", "Leadership", "Execution", "Confidence", "Other"];

// ─── Component ───
export default function CoachWeeklyQAPage() {
  const [tab, setTab] = useState<"review" | "create" | "published">("review");
  const [questions, setQuestions] = useState(mockQuestions);
  const [published] = useState(mockPublished);

  // Create Q&A state
  const [createFor, setCreateFor] = useState<string | null>(null);
  const [anonQuestion, setAnonQuestion] = useState("");
  const [answerFormat, setAnswerFormat] = useState("text");
  const [answerText, setAnswerText] = useState("");
  const [answerCategory, setAnswerCategory] = useState("");
  const [answerTrack, setAnswerTrack] = useState("all");
  const [publishDate, setPublishDate] = useState(getNextThursday());

  // Cluster similar questions
  const clusters = clusterQuestions(questions.filter(q => q.status === "pending"));
  const totalPending = questions.filter(q => q.status === "pending").length;
  const topCategory = getMostCommonCategory(questions.filter(q => q.status === "pending"));

  const openCreator = (questionIds: string[]) => {
    const qs = questions.filter(q => questionIds.includes(q.id));
    setCreateFor(questionIds.join(","));
    setAnonQuestion(qs[0]?.questionText || "");
    setAnswerCategory(qs[0]?.category || "");
    setTab("create");
  };

  const handlePublish = () => {
    if (!anonQuestion || !answerText) return;
    // Mark source questions as selected
    const ids = createFor?.split(",") || [];
    setQuestions(prev => prev.map(q => ids.includes(q.id) ? { ...q, status: "selected" as const } : q));
    setCreateFor(null);
    setAnonQuestion("");
    setAnswerText("");
    setTab("review");
  };

  return (
    <CoachLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Weekly Q&A</h1>
        <p className="text-muted-foreground mt-1">Review client questions, create answers, publish weekly.</p>
      </div>

      {/* Monday reminder */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 mb-6">
        <p className="text-sm font-semibold text-primary mb-2">Weekly Q&A workflow</p>
        <div className="grid grid-cols-3 gap-3 text-xs text-foreground/80 mb-3">
          <div className="rounded-lg bg-card border border-border p-3">
            <p className="font-medium text-foreground mb-0.5">1. Review submissions</p>
            <p className="text-muted-foreground">Monday</p>
          </div>
          <div className="rounded-lg bg-card border border-border p-3">
            <p className="font-medium text-foreground mb-0.5">2. Create answers</p>
            <p className="text-muted-foreground">Tuesday</p>
          </div>
          <div className="rounded-lg bg-card border border-border p-3">
            <p className="font-medium text-foreground mb-0.5">3. Publish</p>
            <p className="text-muted-foreground">Wed/Thu</p>
          </div>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>Questions this week: <span className="text-foreground font-semibold">{totalPending}</span></span>
          <span>Most common theme: <span className="text-primary font-semibold">{topCategory}</span></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {([
          { key: "review" as const, label: `Review (${totalPending})` },
          { key: "create" as const, label: "Create Q&A" },
          { key: "published" as const, label: "Published" },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              tab === t.key
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── REVIEW TAB ─── */}
      {tab === "review" && (
        <div className="space-y-4 max-w-3xl">
          {clusters.map(cluster => (
            <div key={cluster.id} className="rounded-xl border border-border bg-card p-5">
              {cluster.questions.length > 1 && (
                <div className="text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1 inline-block mb-3">
                  {cluster.questions.length} clients asked versions of this question this week
                </div>
              )}

              {cluster.questions.map((q, i) => (
                <div key={q.id} className={cn("py-3", i > 0 && "border-t border-border")}>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-medium text-foreground">{q.clientName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{q.track} Track</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{q.category}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{q.submittedAt}</span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{q.questionText}</p>
                </div>
              ))}

              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => openCreator(cluster.questions.map(q => q.id))}
                >
                  Create Q&A
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const ids = cluster.questions.map(q => q.id);
                    setQuestions(prev => prev.map(q => ids.includes(q.id) ? { ...q, status: "not_selected" as const } : q));
                  }}
                >
                  Skip
                </Button>
              </div>
            </div>
          ))}

          {clusters.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-12">No pending questions this week.</p>
          )}
        </div>
      )}

      {/* ─── CREATE TAB ─── */}
      {tab === "create" && (
        <div className="rounded-xl border border-border bg-card p-6 max-w-2xl space-y-5">
          <h3 className="font-display font-semibold text-foreground">Create Q&A Content</h3>

          <div>
            <label className="text-xs text-muted-foreground">Anonymized Question</label>
            <p className="text-[10px] text-muted-foreground/60 mb-1">Edit to remove any identifying details</p>
            <Textarea
              value={anonQuestion}
              onChange={e => setAnonQuestion(e.target.value)}
              placeholder="The question as it will appear publicly..."
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Answer Format</label>
              <Select value={answerFormat} onValueChange={setAnswerFormat}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="voice">Voice Note</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Category</label>
              <Select value={answerCategory} onValueChange={setAnswerCategory}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {qaCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Track</label>
              <Select value={answerTrack} onValueChange={setAnswerTrack}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tracks</SelectItem>
                  <SelectItem value="life">Life Track</SelectItem>
                  <SelectItem value="business">Operator Track</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {answerFormat === "text" && (
            <div>
              <label className="text-xs text-muted-foreground">Answer</label>
              <Textarea
                value={answerText}
                onChange={e => setAnswerText(e.target.value)}
                placeholder="Write your answer..."
                className="min-h-[200px] mt-1"
              />
            </div>
          )}

          {answerFormat !== "text" && (
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">
                {answerFormat === "voice" ? "Voice note recorder" : "Video recorder"} — upload or record your {answerFormat} answer
              </p>
              <Input type="text" placeholder="Paste media URL..." className="mt-3 max-w-sm mx-auto" onChange={e => setAnswerText(e.target.value || "media")} />
            </div>
          )}

          <div>
            <label className="text-xs text-muted-foreground">Publish Date</label>
            <Input type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} className="mt-1 w-48" />
          </div>

          <Button variant="hero" onClick={handlePublish} disabled={!anonQuestion || !answerText}>
            Publish to Community
          </Button>
        </div>
      )}

      {/* ─── PUBLISHED TAB ─── */}
      {tab === "published" && (
        <div className="space-y-4 max-w-3xl">
          {published.map(qa => (
            <div key={qa.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs text-muted-foreground">Week of {qa.weekOf}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{qa.category}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{qa.trackVisibility === "all" ? "All tracks" : `${qa.trackVisibility} Track`}</span>
              </div>
              <p className="text-sm italic text-foreground/70 mb-2">"{qa.question}"</p>
              <p className="text-sm text-foreground/80 line-clamp-3">{qa.answer}</p>
              <div className="flex gap-4 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                <span>{qa.resonanceCount} resonated</span>
                <span>{qa.mineCount} claimed as theirs</span>
              </div>
            </div>
          ))}
          {published.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-12">No published Q&A content yet.</p>
          )}
        </div>
      )}
    </CoachLayout>
  );
}

// ─── Helpers ───
function getNextThursday(): string {
  const d = new Date();
  d.setDate(d.getDate() + ((4 - d.getDay() + 7) % 7 || 7));
  return d.toISOString().split("T")[0];
}

function clusterQuestions(questions: SubmittedQuestion[]): QuestionCluster[] {
  // Simple clustering by category
  const categoryMap = new Map<string, SubmittedQuestion[]>();
  questions.forEach(q => {
    const existing = categoryMap.get(q.category) || [];
    existing.push(q);
    categoryMap.set(q.category, existing);
  });

  const clusters: QuestionCluster[] = [];
  categoryMap.forEach((qs, cat) => {
    // If multiple in same category, group them
    if (qs.length > 1) {
      clusters.push({ id: `cluster-${cat}`, theme: cat, questions: qs });
    } else {
      clusters.push({ id: `single-${qs[0].id}`, theme: cat, questions: qs });
    }
  });

  return clusters.sort((a, b) => b.questions.length - a.questions.length);
}

function getMostCommonCategory(questions: SubmittedQuestion[]): string {
  if (questions.length === 0) return "None";
  const counts = new Map<string, number>();
  questions.forEach(q => counts.set(q.category, (counts.get(q.category) || 0) + 1));
  let max = 0, top = "";
  counts.forEach((count, cat) => { if (count > max) { max = count; top = cat; } });
  return top;
}
