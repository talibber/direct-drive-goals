import { useState } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { conversations, mockMessages, type Conversation, type Message } from "@/lib/mockData";
import { Search, Paperclip, Send, MessageSquare, ArrowLeft, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function CoachMessagesPage() {
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>(mockMessages);

  const filtered = conversations
    .filter(c => !search || c.clientName.toLowerCase().includes(search.toLowerCase()))
    .filter(c => !unreadOnly || c.unreadCount > 0)
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0);

  const handleSend = () => {
    if (!messageInput.trim() || !activeConv) return;
    const newMsg: Message = {
      id: `m-new-${Date.now()}`,
      conversationId: activeConv.id,
      senderId: "coach-1",
      senderRole: "coach",
      content: messageInput.trim(),
      attachmentUrls: [],
      sentAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }),
      readAt: null,
    };
    setLocalMessages(prev => ({
      ...prev,
      [activeConv.id]: [...(prev[activeConv.id] || []), newMsg],
    }));
    setMessageInput("");
  };

  const messages = activeConv ? (localMessages[activeConv.id] || []) : [];

  return (
    <CoachLayout>
      <div className="flex h-[calc(100vh-8rem)] -m-6 md:-m-8">
        {/* Conversation List */}
        <div className={cn(
          "w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-card",
          activeConv && "hidden md:flex"
        )}>
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h1 className="font-display text-lg font-bold flex items-center gap-2">
                <MessageSquare size={20} /> Messages
                {totalUnread > 0 && (
                  <span className="text-xs font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                    {totalUnread}
                  </span>
                )}
              </h1>
              <button
                onClick={() => setUnreadOnly(!unreadOnly)}
                className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md transition-colors",
                  unreadOnly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Filter size={12} /> Unread
              </button>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients..."
                className="w-full pl-8 pr-3 py-2 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map(conv => (
              <button
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                className={cn(
                  "w-full text-left px-4 py-3 border-b border-border/50 hover:bg-secondary/50 transition-colors",
                  activeConv?.id === conv.id && "bg-secondary"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {conv.clientName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{conv.clientName}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {conv.lastMessageAt.split(",")[0]?.replace(", 2026", "")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessagePreview}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="text-xs font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className={cn(
          "flex-1 flex flex-col",
          !activeConv && "hidden md:flex"
        )}>
          {activeConv ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveConv(null)} className="md:hidden text-muted-foreground hover:text-foreground">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                    {activeConv.clientName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <Link to={`/coach/clients/${activeConv.clientId}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                      {activeConv.clientName}
                    </Link>
                  </div>
                  <Link to={`/coach/clients/${activeConv.clientId}`} className="text-xs text-primary hover:underline hidden md:inline">
                    View Profile
                  </Link>
                </div>

                {/* Context Bar */}
                <div className="flex gap-4 mt-3 text-xs">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary">
                    <span className="text-muted-foreground">Score:</span>
                    <span className={cn("font-bold", activeConv.clientScore >= 80 ? "text-success" : activeConv.clientScore >= 60 ? "text-warning" : "text-danger")}>
                      {activeConv.clientScore}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary">
                    <span className="text-muted-foreground">Goals:</span>
                    <span className="font-bold text-foreground">{activeConv.activeGoals}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary">
                    <span className="text-muted-foreground">Next Due:</span>
                    <span className="font-bold text-foreground">{activeConv.nextDeadline}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary hidden lg:flex">
                    <span className="text-muted-foreground">Last Check-In:</span>
                    <span className="font-bold text-foreground">{activeConv.lastCheckIn}</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={cn("flex", msg.senderRole === "coach" ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[75%] rounded-lg px-4 py-2.5",
                      msg.senderRole === "coach"
                        ? "bg-gradient-gold text-primary-foreground"
                        : "bg-card border border-border text-foreground"
                    )}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <div className={cn(
                        "flex items-center gap-2 mt-1 text-xs",
                        msg.senderRole === "coach" ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        <span>{msg.sentAt.split(", 2026 ")[1] || msg.sentAt}</span>
                        {msg.senderRole === "coach" && (
                          <span>{msg.readAt ? "Seen" : "Sent"}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                    placeholder="Type a message..."
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </CoachLayout>
  );
}
