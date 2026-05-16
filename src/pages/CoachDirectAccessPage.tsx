import { useState } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Zap, Clock, Send, Mic, Play, Pause, Square, AlertTriangle, User } from "lucide-react";
import { toast } from "sonner";

interface PendingMessage {
  id: string;
  clientName: string;
  discType: string;
  message_type: "text" | "voice";
  question_text: string | null;
  context_text: string | null;
  voice_url: string | null;
  category: string;
  sent_at: string;
  hoursAgo: number;
}

const mockPending: PendingMessage[] = [
  {
    id: "da1",
    clientName: "Marcus Rivera",
    discType: "D",
    message_type: "text",
    question_text: "I keep putting off the conversation with my business partner about equity restructuring. What's actually stopping me?",
    context_text: null,
    category: "Pattern Recognition",
    voice_url: null,
    sent_at: "2026-04-10T09:15:00Z",
    hoursAgo: 6,
  },
  {
    id: "da2",
    clientName: "Daniella Osei",
    discType: "I",
    message_type: "voice",
    question_text: null,
    context_text: null,
    category: "Decision",
    voice_url: "#",
    sent_at: "2026-04-09T22:00:00Z",
    hoursAgo: 17,
  },
  {
    id: "da3",
    clientName: "Jake Hernandez",
    discType: "S",
    message_type: "text",
    question_text: "Should I take on a second major client knowing it'll stretch my team, or wait until I've fully stabilized delivery for my current anchor client?",
    context_text: "Current client is 60% of revenue. New client would be a 6-month contract at $15k/mo.",
    category: "Strategy",
    voice_url: null,
    sent_at: "2026-04-09T16:30:00Z",
    hoursAgo: 22,
  },
];

const discColors: Record<string, string> = {
  D: "bg-red-500/20 text-red-400 border-red-500/30",
  I: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  S: "bg-green-500/20 text-green-400 border-green-500/30",
  C: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default function CoachDirectAccessPage() {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isRecordingFor, setIsRecordingFor] = useState<string | null>(null);
  const [recordedFor, setRecordedFor] = useState<Set<string>>(new Set());

  const handleSend = (id: string) => {
    const hasText = responses[id]?.trim();
    const hasVoice = recordedFor.has(id);
    if (!hasText && !hasVoice) {
      toast.error("Add a text or voice response.");
      return;
    }
    toast.success("Response sent - client will be notified.");
    setResponses((prev) => ({ ...prev, [id]: "" }));
    setRecordedFor((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  return (
    <CoachLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Zap className="text-primary" size={28} />
            Direct Access Queue
          </h1>
          <p className="text-muted-foreground mt-1">
            {mockPending.length} pending messages · Operator Track clients only
          </p>
        </div>

        {/* Pending Messages */}
        <div className="space-y-4">
          {mockPending
            .sort((a, b) => b.hoursAgo - a.hoursAgo)
            .map((msg) => (
              <Card key={msg.id} className={msg.hoursAgo >= 20 ? "border-destructive/50" : ""}>
                <CardContent className="pt-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
                        <User size={16} className="text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{msg.clientName}</span>
                          <Badge variant="outline" className={`text-xs ${discColors[msg.discType]}`}>
                            {msg.discType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">{msg.category}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock size={10} /> {msg.hoursAgo}h ago
                          {msg.hoursAgo >= 20 && (
                            <span className="flex items-center gap-1 text-destructive font-medium">
                              <AlertTriangle size={10} /> Approaching 24hr window
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {msg.message_type === "voice" && (
                      <Badge variant="outline" className="text-xs"><Mic size={10} className="mr-1" /> Voice Note</Badge>
                    )}
                  </div>

                  {/* Message Content */}
                  {msg.question_text && (
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <p className="text-sm text-foreground">{msg.question_text}</p>
                    </div>
                  )}
                  {msg.context_text && (
                    <p className="text-xs text-muted-foreground italic px-1">Context: {msg.context_text}</p>
                  )}
                  {msg.voice_url && (
                    <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                      <Button size="icon" variant="ghost" className="h-8 w-8"><Play size={14} /></Button>
                      <div className="flex-1 h-1 bg-muted rounded-full">
                        <div className="h-1 bg-primary rounded-full w-0" />
                      </div>
                      <span className="text-xs text-muted-foreground">2:34</span>
                    </div>
                  )}

                  <Separator />

                  {/* Response Area */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Your response</label>
                    <Textarea
                      value={responses[msg.id] || ""}
                      onChange={(e) => setResponses((prev) => ({ ...prev, [msg.id]: e.target.value }))}
                      placeholder="Respond with perspective, not advice..."
                      className="min-h-[80px]"
                    />

                    <div className="flex items-center gap-3">
                      {isRecordingFor === msg.id ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setIsRecordingFor(null);
                            setRecordedFor((prev) => new Set(prev).add(msg.id));
                          }}
                        >
                          <Square size={14} className="mr-1" /> Stop Recording
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsRecordingFor(msg.id)}
                        >
                          <Mic size={14} className="mr-1" />
                          {recordedFor.has(msg.id) ? "Re-record" : "Add Voice Note"}
                        </Button>
                      )}
                      {recordedFor.has(msg.id) && (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <Mic size={10} /> Voice note recorded
                        </span>
                      )}
                    </div>

                    <Button onClick={() => handleSend(msg.id)}>
                      <Send size={14} className="mr-2" /> Send Response
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {mockPending.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No pending direct access messages.
            </CardContent>
          </Card>
        )}
      </div>
    </CoachLayout>
  );
}
