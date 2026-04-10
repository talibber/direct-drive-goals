import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mic, CalendarDays, Clock, User, Video, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  "Sales & Revenue",
  "Operations",
  "Legal & Compliance",
  "Marketing & Brand",
  "Hiring & Team",
  "Finance & Capital",
  "Mindset & Leadership",
  "Other",
];

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

// Mock data
const nextCall = {
  date: "April 25, 2026 — 12:00 PM EST",
  guestName: "Sarah Chen",
  guestTitle: "Fractional CFO & Founder Advisor",
  guestTopic: "When to raise vs. bootstrap — reading your numbers honestly",
  joinLink: "#",
};

const mockQuestions = [
  { id: "q1", question_text: "How do I price a retainer when the client keeps expanding scope?", category: "Sales & Revenue", status: "on_agenda", submitted_at: "2026-04-10" },
  { id: "q2", question_text: "Should I bring on a part-time ops person or outsource fulfillment?", category: "Operations", status: "under_review", submitted_at: "2026-04-12" },
  { id: "q3", question_text: "My biggest client is 60% of revenue — how do I de-risk?", category: "Finance & Capital", status: "addressed", submitted_at: "2026-03-08" },
];

const mockRecording = {
  month: "March 2026",
  url: "#",
};

export default function OperatorCallPage() {
  const [questionText, setQuestionText] = useState("");
  const [category, setCategory] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [winText, setWinText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [winSubmitted, setWinSubmitted] = useState(false);

  const handleSubmitQuestion = () => {
    if (questionText.length < 100) {
      toast.error("Question must be at least 100 characters.");
      return;
    }
    if (!category) {
      toast.error("Please select a category.");
      return;
    }
    setSubmitted(true);
    toast.success("Submitted. Your coach will review and confirm if it makes the call agenda.");
    setQuestionText("");
    setCategory("");
    setIsUrgent(false);
  };

  const handleSubmitWin = () => {
    if (!winText.trim()) {
      toast.error("Please share your win.");
      return;
    }
    setWinSubmitted(true);
    toast.success("Win submitted for this month's call.");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Mic className="text-primary" size={28} />
            Operator Community Call
          </h1>
          <p className="text-muted-foreground mt-1">
            Monthly. Operator-led. Real questions from people actually running businesses.
          </p>
        </div>

        {/* Next Call Details */}
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Next Call</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CalendarDays size={18} className="text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{nextCall.date}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    10 min wins — 30 min operator questions — 15 min guest professional — 5 min commitments
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User size={18} className="text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{nextCall.guestName}</p>
                  <p className="text-sm text-muted-foreground">{nextCall.guestTitle}</p>
                  <p className="text-sm text-primary mt-1">{nextCall.guestTopic}</p>
                </div>
              </div>
            </div>
            <Button asChild className="mt-2">
              <a href={nextCall.joinLink} target="_blank" rel="noopener noreferrer">
                <Video size={16} className="mr-2" /> Join Call
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Win Submission */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your win for this month's call</CardTitle>
            <p className="text-sm text-muted-foreground">
              One business win. Specific. Real. We start every call with wins.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {winSubmitted ? (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle2 size={18} /> Win submitted for this month.
              </div>
            ) : (
              <>
                <Textarea
                  value={winText}
                  onChange={(e) => setWinText(e.target.value)}
                  placeholder="What's your biggest business win this month?"
                  className="min-h-[80px]"
                />
                <Button onClick={handleSubmitWin}>Submit Win</Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Question Submission */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submit your question for this month's call</CardTitle>
            <p className="text-sm text-muted-foreground">
              Questions are reviewed and the highest-value ones get addressed on the call. Be specific about your situation.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {submitted ? (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle2 size={18} /> Submitted. Your coach will review and confirm if it makes the call agenda.
              </div>
            ) : (
              <>
                <div>
                  <Label className="mb-2 block">What's the specific business challenge or decision you need perspective on?</Label>
                  <Textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Be specific about your situation — minimum 100 characters"
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{questionText.length}/100 minimum characters</p>
                </div>

                <div>
                  <Label className="mb-2 block">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <Switch checked={isUrgent} onCheckedChange={setIsUrgent} id="urgent" />
                  <Label htmlFor="urgent" className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-destructive" />
                    This is urgent — I need this addressed this month
                  </Label>
                </div>

                <Button onClick={handleSubmitQuestion}>Submit Question</Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Previous Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Submitted Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockQuestions.map((q) => (
              <div key={q.id} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-secondary/30">
                <div className="flex-1">
                  <p className="text-sm text-foreground">{q.question_text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{q.category} · {q.submitted_at}</p>
                </div>
                <Badge variant="outline" className={statusColors[q.status]}>
                  {statusLabels[q.status]}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Past Recording */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{mockRecording.month} Operator Call Recording</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <a href={mockRecording.url}>
                <Video size={16} className="mr-2" /> Watch Recording
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
