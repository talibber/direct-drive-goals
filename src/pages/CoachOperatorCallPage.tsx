import { useState } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, CalendarDays, User, ArrowUp, ArrowDown, Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  under_review: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  on_agenda: "bg-primary/20 text-primary border-primary/30",
  not_this_month: "bg-muted text-muted-foreground border-border",
  addressed: "bg-green-500/20 text-green-400 border-green-500/30",
};

const statusLabels: Record<string, string> = {
  under_review: "Under Review",
  on_agenda: "On The Agenda",
  not_this_month: "Not This Month",
  addressed: "Addressed",
};

interface MockQuestion {
  id: string;
  clientName: string;
  question_text: string;
  category: string;
  is_urgent: boolean;
  status: string;
  submitted_at: string;
  coach_note: string;
  agenda_order: number | null;
}

const initialQuestions: MockQuestion[] = [
  { id: "q1", clientName: "Marcus Rivera", question_text: "How do I price a retainer when the client keeps expanding scope? I've been undercharging for 6 months and I know it but the conversation feels hard.", category: "Sales & Revenue", is_urgent: true, status: "on_agenda", submitted_at: "2026-04-10", coach_note: "", agenda_order: 1 },
  { id: "q2", clientName: "Daniella Osei", question_text: "Should I bring on a part-time ops person or outsource fulfillment? I'm at $30k/mo and spending 20 hours a week on operations instead of selling.", category: "Operations", is_urgent: false, status: "under_review", submitted_at: "2026-04-12", coach_note: "", agenda_order: null },
  { id: "q3", clientName: "Jake Hernandez", question_text: "My biggest client is 60% of revenue and I've known this is a problem for months. What's the playbook for diversifying when you're capacity-constrained?", category: "Finance & Capital", is_urgent: true, status: "under_review", submitted_at: "2026-04-11", coach_note: "", agenda_order: null },
  { id: "q4", clientName: "Priya Mehta", question_text: "I need to fire my first employee and I've been avoiding it for two months. How do I do this cleanly while protecting the company?", category: "Hiring & Team", is_urgent: false, status: "under_review", submitted_at: "2026-04-13", coach_note: "", agenda_order: null },
];

const mockWins = [
  { id: "w1", clientName: "Marcus Rivera", win_text: "Closed a $12k/month retainer with a SaaS company — largest deal to date." },
  { id: "w2", clientName: "Daniella Osei", win_text: "Hired a VA and freed up 15 hours/week. Revenue didn't drop." },
];

export default function CoachOperatorCallPage() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [guestName, setGuestName] = useState("Sarah Chen");
  const [guestTitle, setGuestTitle] = useState("Fractional CFO & Founder Advisor");
  const [guestTopic, setGuestTopic] = useState("When to raise vs. bootstrap — reading your numbers honestly");
  const [recapNotes, setRecapNotes] = useState("");

  const sortedQuestions = [...questions].sort((a, b) => {
    if (a.status === "on_agenda" && b.status !== "on_agenda") return -1;
    if (b.status === "on_agenda" && a.status !== "on_agenda") return 1;
    if (a.is_urgent && !b.is_urgent) return -1;
    if (b.is_urgent && !a.is_urgent) return 1;
    return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
  });

  const agendaQuestions = questions
    .filter((q) => q.status === "on_agenda")
    .sort((a, b) => (a.agenda_order ?? 99) - (b.agenda_order ?? 99));

  const updateStatus = (id: string, newStatus: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status: newStatus, agenda_order: newStatus === "on_agenda" ? agendaQuestions.length + 1 : null } : q
      )
    );
    if (newStatus === "on_agenda") {
      toast.success("Question added to agenda — client will be notified.");
    }
  };

  const moveAgenda = (id: string, direction: "up" | "down") => {
    const idx = agendaQuestions.findIndex((q) => q.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === agendaQuestions.length - 1)) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const newOrder = [...agendaQuestions];
    [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];
    setQuestions((prev) =>
      prev.map((q) => {
        const agendaIdx = newOrder.findIndex((aq) => aq.id === q.id);
        return agendaIdx >= 0 ? { ...q, agenda_order: agendaIdx + 1 } : q;
      })
    );
  };

  return (
    <CoachLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Mic className="text-primary" size={28} />
            Operator Call Management
          </h1>
          <p className="text-muted-foreground mt-1">Next call: April 25, 2026 · {questions.length} questions submitted</p>
        </div>

        {/* Guest Professional */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><User size={18} /> Guest Professional</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="mb-1 block">Name</Label>
              <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block">Title</Label>
              <Input value={guestTitle} onChange={(e) => setGuestTitle(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block">Topic</Label>
              <Input value={guestTopic} onChange={(e) => setGuestTopic(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Wins */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submitted Wins ({mockWins.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockWins.map((w) => (
              <div key={w.id} className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <p className="text-sm font-medium text-foreground">{w.clientName}</p>
                <p className="text-sm text-muted-foreground mt-1">{w.win_text}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submitted Questions ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedQuestions.map((q) => (
              <div key={q.id} className="p-4 rounded-lg bg-secondary/30 border border-border space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{q.clientName}</span>
                      <Badge variant="outline" className="text-xs">{q.category}</Badge>
                      {q.is_urgent && (
                        <Badge variant="outline" className="text-xs bg-destructive/20 text-destructive border-destructive/30">
                          <AlertCircle size={10} className="mr-1" /> Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{q.question_text}</p>
                    <p className="text-xs text-muted-foreground mt-1">Submitted {q.submitted_at}</p>
                  </div>
                  <Badge variant="outline" className={statusColors[q.status]}>
                    {statusLabels[q.status]}
                  </Badge>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {q.status !== "on_agenda" && (
                    <Button size="sm" variant="default" onClick={() => updateStatus(q.id, "on_agenda")}>
                      On Agenda
                    </Button>
                  )}
                  {q.status !== "not_this_month" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(q.id, "not_this_month")}>
                      Not This Month
                    </Button>
                  )}
                  {q.status !== "addressed" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(q.id, "addressed")}>
                      Addressed
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Agenda Builder */}
        {agendaQuestions.length > 0 && (
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Call Agenda ({agendaQuestions.length} questions)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {agendaQuestions.map((q, idx) => (
                <div key={q.id} className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <span className="text-primary font-bold text-sm w-6">{idx + 1}.</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{q.clientName}</p>
                    <p className="text-xs text-muted-foreground">{q.question_text.slice(0, 80)}...</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveAgenda(q.id, "up")} disabled={idx === 0}>
                      <ArrowUp size={14} />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveAgenda(q.id, "down")} disabled={idx === agendaQuestions.length - 1}>
                      <ArrowDown size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Post-Call */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Post-Call</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-1 block">Recording URL</Label>
              <Input placeholder="Paste recording link..." />
            </div>
            <div>
              <Label className="mb-1 block">Recap Notes</Label>
              <Textarea
                value={recapNotes}
                onChange={(e) => setRecapNotes(e.target.value)}
                placeholder="Key takeaways and action items from this month's call..."
                className="min-h-[120px]"
              />
            </div>
            <Button onClick={() => toast.success("Recording uploaded and commitment prompt sent to all attendees.")}>
              <Upload size={16} className="mr-2" /> Save & Notify Clients
            </Button>
          </CardContent>
        </Card>
      </div>
    </CoachLayout>
  );
}
