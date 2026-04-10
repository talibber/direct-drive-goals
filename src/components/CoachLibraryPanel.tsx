import { useState } from "react";
import { BookOpen, Plus, Send, Check, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { clients } from "@/lib/mockData";

interface ContentItem {
  id: string;
  title: string;
  category: string;
  contentType: string;
  body: string;
  keyTakeaway: string;
  readTimeMinutes: number;
  isCore: boolean;
}

interface Assignment {
  id: string;
  contentId: string;
  contentTitle: string;
  clientId: string;
  clientName: string;
  assignedNote: string;
  completed: boolean;
  completedAt?: string;
  clientReflection?: string;
}

const categories = ["Mindset", "Execution", "Decision Making", "Habits", "Leadership", "Sales & Revenue", "Relationships"];

const mockLibrary: ContentItem[] = [
  { id: "c1", title: "The Gap Between Knowing and Doing", category: "Execution", contentType: "Article", body: "Most people don't have an information problem...", keyTakeaway: "Execution beats knowledge.", readTimeMinutes: 4, isCore: true },
  { id: "c2", title: "How to Set Goals That Actually Stick", category: "Execution", contentType: "Guide", body: "A goal without measurement is a wish...", keyTakeaway: "Make goals specific.", readTimeMinutes: 5, isCore: true },
  { id: "c3", title: "Understanding Your DISC Profile in Practice", category: "Mindset", contentType: "Article", body: "Your DISC profile isn't a label...", keyTakeaway: "Build systems around blind spots.", readTimeMinutes: 6, isCore: true },
  { id: "c4", title: "The 48-Hour Rule for Decision Making", category: "Decision Making", contentType: "Framework", body: "When facing a decision...", keyTakeaway: "Decide now.", readTimeMinutes: 3, isCore: false },
  { id: "c5", title: "Building Habits That Survive Bad Days", category: "Habits", contentType: "Guide", body: "The test of a habit...", keyTakeaway: "Create minimum viable habits.", readTimeMinutes: 4, isCore: false },
];

const mockAssignments: Assignment[] = [
  { id: "a1", contentId: "c1", contentTitle: "The Gap Between Knowing and Doing", clientId: "1", clientName: "Marcus J.", assignedNote: "Read before next check-in.", completed: false },
  { id: "a2", contentId: "c2", contentTitle: "How to Set Goals That Actually Stick", clientId: "1", clientName: "Marcus J.", assignedNote: "", completed: true, completedAt: "Apr 5, 2026", clientReflection: "This hit home. I've been setting goals that are too vague." },
  { id: "a3", contentId: "c5", contentTitle: "Building Habits That Survive Bad Days", clientId: "2", clientName: "Sarah K.", assignedNote: "Your consistency score was low.", completed: false },
];

export function CoachLibraryPanel() {
  const [tab, setTab] = useState<"content" | "assignments" | "create">("content");
  const [library, setLibrary] = useState(mockLibrary);
  const [assignments, setAssignments] = useState(mockAssignments);
  const [assignDialogFor, setAssignDialogFor] = useState<string | null>(null);
  const [assignClient, setAssignClient] = useState("");
  const [assignNote, setAssignNote] = useState("");

  // Create form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newType, setNewType] = useState("Article");
  const [newBody, setNewBody] = useState("");
  const [newTakeaway, setNewTakeaway] = useState("");
  const [newReadTime, setNewReadTime] = useState("5");
  const [newIsCore, setNewIsCore] = useState(false);

  const handleCreate = () => {
    if (!newTitle || !newCategory || !newBody) return;
    const item: ContentItem = {
      id: `c${Date.now()}`,
      title: newTitle,
      category: newCategory,
      contentType: newType,
      body: newBody,
      keyTakeaway: newTakeaway,
      readTimeMinutes: parseInt(newReadTime) || 5,
      isCore: newIsCore,
    };
    setLibrary(prev => [item, ...prev]);
    setNewTitle(""); setNewCategory(""); setNewBody(""); setNewTakeaway("");
    setTab("content");
  };

  const handleAssign = (contentId: string) => {
    if (!assignClient) return;
    const content = library.find(c => c.id === contentId);
    const client = clients.find(c => c.id === assignClient);
    if (!content || !client) return;
    setAssignments(prev => [...prev, {
      id: `a${Date.now()}`,
      contentId,
      contentTitle: content.title,
      clientId: assignClient,
      clientName: client.name,
      assignedNote: assignNote,
      completed: false,
    }]);
    setAssignDialogFor(null);
    setAssignClient("");
    setAssignNote("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        {(["content", "assignments", "create"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
              tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "content" ? "All Content" : t === "assignments" ? "Assignments" : "+ Create New"}
          </button>
        ))}
      </div>

      {tab === "content" && (
        <div className="space-y-3">
          {library.map(item => (
            <div key={item.id} className="rounded-lg border border-border bg-card p-4 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{item.category}</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{item.contentType}</span>
                  {item.isCore ? (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">Core</span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">Targeted</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.readTimeMinutes} min read</p>
              </div>
              <div className="flex items-center gap-2">
                {assignDialogFor === item.id ? (
                  <div className="flex items-center gap-2">
                    <Select value={assignClient} onValueChange={setAssignClient}>
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue placeholder="Client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={assignNote}
                      onChange={e => setAssignNote(e.target.value)}
                      placeholder="Note (optional)"
                      className="w-40 h-8 text-xs"
                    />
                    <button onClick={() => handleAssign(item.id)} className="p-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90">
                      <Check size={12} />
                    </button>
                    <button onClick={() => setAssignDialogFor(null)} className="p-1.5 rounded bg-muted text-muted-foreground hover:text-foreground">
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAssignDialogFor(item.id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Send size={10} /> Assign
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "assignments" && (
        <div className="space-y-3">
          {assignments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No assignments yet.</p>
          )}
          {assignments.map(a => (
            <div key={a.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{a.contentTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    Assigned to <span className="text-foreground font-medium">{a.clientName}</span>
                    {a.assignedNote && <span> — "{a.assignedNote}"</span>}
                  </p>
                </div>
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  a.completed ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                )}>
                  {a.completed ? `Completed ${a.completedAt}` : "Not started"}
                </span>
              </div>
              {a.clientReflection && (
                <div className="mt-2 rounded-md border border-primary/20 bg-primary/5 p-3">
                  <p className="text-xs font-medium text-primary mb-1 flex items-center gap-1"><Eye size={10} /> Client Reflection</p>
                  <p className="text-sm text-foreground/80 italic">"{a.clientReflection}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "create" && (
        <div className="rounded-lg border border-border bg-card p-5 max-w-xl space-y-4">
          <h3 className="font-display font-semibold text-foreground">Create New Content</h3>
          <div>
            <label className="text-xs text-muted-foreground">Title</label>
            <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Content title" className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Category</label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Type</label>
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Article">Article</SelectItem>
                  <SelectItem value="Guide">Guide</SelectItem>
                  <SelectItem value="Framework">Framework</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Body</label>
            <Textarea value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="Write content..." className="mt-1 min-h-[150px]" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Key Takeaway</label>
            <Input value={newTakeaway} onChange={e => setNewTakeaway(e.target.value)} placeholder="One-line takeaway" className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Read Time (minutes)</label>
              <Input type="number" value={newReadTime} onChange={e => setNewReadTime(e.target.value)} className="mt-1" />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <button
                onClick={() => setNewIsCore(!newIsCore)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border transition-colors",
                  newIsCore ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                )}
              >
                {newIsCore ? "Core Content" : "Targeted Content"}
              </button>
            </div>
          </div>
          <Button variant="hero" onClick={handleCreate} disabled={!newTitle || !newCategory || !newBody}>
            <Plus size={14} /> Create Content
          </Button>
        </div>
      )}
    </div>
  );
}
