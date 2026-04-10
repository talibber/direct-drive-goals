import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { mockMessages, type Message } from "@/lib/mockData";
import { Paperclip, Send, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

// Client sees their conversation with the coach (conv-1 as mock)
const clientConvId = "conv-1";
const coachName = "Your Coach";

export default function ClientMessagesPage() {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages[clientConvId] || []);

  const handleSend = () => {
    if (!messageInput.trim()) return;
    const newMsg: Message = {
      id: `m-client-${Date.now()}`,
      conversationId: clientConvId,
      senderId: "1",
      senderRole: "client",
      content: messageInput.trim(),
      attachmentUrls: [],
      sentAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }),
      readAt: null,
    };
    setMessages(prev => [...prev, newMsg]);
    setMessageInput("");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] -m-6 md:-m-8">
        {/* Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              C
            </div>
            <div>
              <h1 className="font-display text-lg font-bold">{coachName}</h1>
              <p className="text-xs text-muted-foreground">Direct message thread with your coach</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">No messages yet. Start a conversation with your coach.</p>
              </div>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={cn("flex", msg.senderRole === "client" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[75%] rounded-lg px-4 py-2.5",
                  msg.senderRole === "client"
                    ? "bg-primary/20 text-foreground border border-primary/30"
                    : "bg-gradient-gold text-primary-foreground"
                )}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <div className={cn(
                    "flex items-center gap-2 mt-1 text-xs",
                    msg.senderRole === "client" ? "text-muted-foreground" : "text-primary-foreground/70"
                  )}>
                    <span>{msg.sentAt.split(", 2026 ")[1] || msg.sentAt}</span>
                    {msg.senderRole === "client" && msg.readAt && (
                      <span>Seen</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center gap-2">
            <button className="text-muted-foreground hover:text-foreground transition-colors p-2">
              <Paperclip size={18} />
            </button>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Message your coach..."
              className="flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={handleSend}
              disabled={!messageInput.trim()}
              className="p-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
