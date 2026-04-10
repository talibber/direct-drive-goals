import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Zap, Clock, Send, Mic, Square, Play, Pause, AlertTriangle, CheckCircle2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["Decision", "Mindset", "Strategy", "Pattern Recognition", "Other"];

interface MockMessage {
  id: string;
  message_type: "text" | "voice";
  question_text: string | null;
  context_text: string | null;
  voice_url: string | null;
  category: string;
  sent_at: string;
  read_at: string | null;
  response_text: string | null;
  response_voice_url: string | null;
  responded_at: string | null;
}

const mockMessages: MockMessage[] = [
  {
    id: "m1",
    message_type: "text",
    question_text: "I have a client who wants to renegotiate our retainer down 30%. They're my second largest account. Do I hold the line or negotiate?",
    context_text: "They've been with me 8 months. Good relationship but they're cutting costs across the board.",
    category: "Decision",
    sent_at: "2026-04-09T14:30:00Z",
    read_at: "2026-04-09T15:00:00Z",
    response_text: "Don't negotiate the price. Negotiate the scope. If they want to pay 30% less, remove 30% of the deliverables. Present it as 'here's what the adjusted engagement looks like' — not as a concession. If they push back, you'll learn whether they value the work or just want a discount. Either answer is useful.",
    response_voice_url: null,
    responded_at: "2026-04-09T18:45:00Z",
  },
  {
    id: "m2",
    message_type: "text",
    question_text: "I keep putting off the conversation with my business partner about equity restructuring. What's actually stopping me?",
    context_text: null,
    category: "Pattern Recognition",
    sent_at: "2026-04-10T09:15:00Z",
    read_at: null,
    response_text: null,
    response_voice_url: null,
    responded_at: null,
  },
];

export default function DirectAccessPage() {
  const [questionText, setQuestionText] = useState("");
  const [contextText, setContextText] = useState("");
  const [category, setCategory] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const monthMessages = mockMessages.length;
  const avgResponse = "4.2 hours";

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 180) {
            setIsRecording(false);
            setHasRecording(true);
            if (timerRef.current) clearInterval(timerRef.current);
            toast.info("3-minute limit reached. Recording stopped.");
            return 180;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleSendText = () => {
    if (!questionText.trim()) { toast.error("Please enter your question."); return; }
    if (!category) { toast.error("Please select a category."); return; }
    toast.success("Message sent for review.");
    setQuestionText("");
    setContextText("");
    setCategory("");
  };

  const handleSendVoice = () => {
    if (!hasRecording) { toast.error("Please record a voice note first."); return; }
    if (!category) { toast.error("Please select a category."); return; }
    toast.success("Voice note sent for review.");
    setHasRecording(false);
    setRecordingTime(0);
    setCategory("");
  };

  const startRecording = () => { setIsRecording(true); setRecordingTime(0); setHasRecording(false); };
  const stopRecording = () => { setIsRecording(false); setHasRecording(true); };

  return (
    <DashboardLayout coachingTrack="business">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Zap className="text-primary" size={28} />
              Direct Access
            </h1>
            <p className="text-muted-foreground mt-1">One question. Real perspective. Within 24 hours.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={14} />
            Typical response time: under 24 hours
          </div>
        </div>

        {/* Access Rules */}
        <Card className="border-primary/30 bg-card">
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold text-primary mb-3">How this works:</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>— One specific question per message</li>
              <li>— Voice notes max 3 minutes</li>
              <li>— Responses within 24hrs Mon–Fri</li>
              <li>— Business decisions and mindset only</li>
              <li>— The clearer your question, the more useful the response</li>
            </ul>
          </CardContent>
        </Card>

        {/* Soft limit warning */}
        {monthMessages >= 8 && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="pt-6 flex items-start gap-3">
              <AlertTriangle size={18} className="text-destructive mt-0.5" />
              <p className="text-sm text-muted-foreground">
                You've sent {monthMessages} messages this month. Direct Access works best for specific decisions — not ongoing conversation. Consider saving your next question for the Operator Community Call.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Message Composer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Message</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="text">
              <TabsList className="mb-4">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <MessageSquare size={14} /> Text Message
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex items-center gap-2">
                  <Mic size={14} /> Voice Note
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Your question</label>
                  <Textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value.slice(0, 500))}
                    placeholder="Be specific. One question. What do you need perspective on?"
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{questionText.length}/500</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Brief context <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <Textarea
                    value={contextText}
                    onChange={(e) => setContextText(e.target.value.slice(0, 300))}
                    placeholder="What's the situation? Keep it to 3 sentences max."
                    className="min-h-[60px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{contextText.length}/300</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSendText}>
                  <Send size={16} className="mr-2" /> Send for Review
                </Button>
              </TabsContent>

              <TabsContent value="voice" className="space-y-4">
                <p className="text-sm text-muted-foreground">3 minutes max. Get to the question fast.</p>

                <div className="flex flex-col items-center gap-4 py-6">
                  {!isRecording && !hasRecording && (
                    <Button size="lg" variant="outline" className="rounded-full h-20 w-20" onClick={startRecording}>
                      <Mic size={32} className="text-destructive" />
                    </Button>
                  )}
                  {isRecording && (
                    <>
                      <div className="text-2xl font-mono text-destructive">{formatTime(recordingTime)} / 3:00</div>
                      <div className="w-full max-w-xs bg-secondary rounded-full h-2">
                        <div className="bg-destructive h-2 rounded-full transition-all" style={{ width: `${(recordingTime / 180) * 100}%` }} />
                      </div>
                      <Button size="lg" variant="destructive" className="rounded-full h-16 w-16" onClick={stopRecording}>
                        <Square size={24} />
                      </Button>
                    </>
                  )}
                  {hasRecording && !isRecording && (
                    <div className="flex items-center gap-3">
                      <Button size="icon" variant="outline" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      </Button>
                      <span className="text-sm text-muted-foreground">{formatTime(recordingTime)} recorded</span>
                      <Button variant="ghost" size="sm" onClick={() => { setHasRecording(false); setRecordingTime(0); }}>
                        Re-record
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSendVoice} disabled={!hasRecording}>
                  <Send size={16} className="mr-2" /> Send Voice Note
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Message History</h2>
          <div className="space-y-4">
            {mockMessages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {/* Client message */}
                <div className="flex justify-start">
                  <Card className="max-w-lg bg-secondary/50">
                    <CardContent className="pt-4 pb-3 px-4 space-y-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{msg.category}</Badge>
                        {msg.message_type === "voice" && <Badge variant="outline" className="text-xs"><Mic size={10} className="mr-1" /> Voice</Badge>}
                      </div>
                      {msg.question_text && <p className="text-sm text-foreground">{msg.question_text}</p>}
                      {msg.context_text && <p className="text-xs text-muted-foreground italic">Context: {msg.context_text}</p>}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{new Date(msg.sent_at).toLocaleDateString()} {new Date(msg.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        {msg.read_at && <span>· Read</span>}
                      </div>
                      {!msg.responded_at && (
                        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                          Awaiting response
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Coach response */}
                {msg.responded_at && (
                  <div className="flex justify-end">
                    <Card className="max-w-lg border-primary/30">
                      <CardContent className="pt-4 pb-3 px-4 space-y-2">
                        <p className="text-xs font-medium text-primary">Coach Response</p>
                        {msg.response_text && <p className="text-sm text-foreground">{msg.response_text}</p>}
                        {msg.response_voice_url && (
                          <div className="flex items-center gap-2 p-2 bg-primary/10 rounded">
                            <Button size="icon" variant="ghost" className="h-8 w-8"><Play size={14} /></Button>
                            <span className="text-xs text-muted-foreground">Voice response</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          <CheckCircle2 size={10} className="inline mr-1 text-green-400" />
                          Responded {new Date(msg.responded_at).toLocaleDateString()} {new Date(msg.responded_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Usage Stats */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span>This month: <strong className="text-foreground">{monthMessages} messages</strong> sent</span>
          <span>Average response: <strong className="text-foreground">{avgResponse}</strong></span>
        </div>
      </div>
    </DashboardLayout>
  );
}
