import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { helpRadarItems as initialItems, type HelpRadarItem } from "@/lib/mockData";
import {
  Megaphone, DollarSign, TrendingUp, Settings, Users, Rocket, Package, Heart,
  Clock, Zap, UserCheck, Brain, Wallet, MessageCircle, Scale, Compass, RotateCcw,
  CheckCircle2, X, Radio, Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const businessCategories = [
  { label: "Marketing & Brand", icon: Megaphone },
  { label: "Paid Ads & Traffic", icon: TrendingUp },
  { label: "Sales & Closing", icon: DollarSign },
  { label: "Revenue & Pricing", icon: Wallet },
  { label: "Operations & Systems", icon: Settings },
  { label: "Hiring & Team Building", icon: Users },
  { label: "Fundraising & Capital", icon: Rocket },
  { label: "Product Development", icon: Package },
  { label: "Customer Retention", icon: Heart },
  { label: "Business Strategy", icon: Compass },
];

const lifeCategories = [
  { label: "Time Management", icon: Clock },
  { label: "Energy & Health", icon: Zap },
  { label: "Relationships", icon: UserCheck },
  { label: "Confidence & Mindset", icon: Brain },
  { label: "Financial Literacy", icon: Wallet },
  { label: "Communication", icon: MessageCircle },
  { label: "Decision Making", icon: Scale },
  { label: "Work-Life Balance", icon: RotateCcw },
  { label: "Purpose & Direction", icon: Compass },
  { label: "Personal Habits", icon: CheckCircle2 },
];

const allCategories = [...businessCategories, ...lifeCategories];

function getCategoryIcon(category: string) {
  const found = allCategories.find((c) => c.label === category);
  return found?.icon || Radio;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  seen: { bg: "bg-muted", text: "text-muted-foreground", label: "Seen" },
  on_deck: { bg: "bg-primary/10", text: "text-primary", label: "On Deck" },
  addressed: { bg: "bg-success/10", text: "text-success", label: "Addressed" },
};

export default function HelpRadarPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [customChallenge, setCustomChallenge] = useState("");
  const [context, setContext] = useState("");
  const [items, setItems] = useState<HelpRadarItem[]>(initialItems);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContext, setEditContext] = useState("");

  const toggleCategory = (label: string) => {
    setSelected((prev) => prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]);
  };

  const handleSave = () => {
    if (selected.length === 0 && !customChallenge.trim()) return;
    const newItems: HelpRadarItem[] = selected.map((cat) => ({
      id: crypto.randomUUID(),
      clientId: "self",
      category: cat,
      customDescription: null,
      context: context || null,
      coachStatus: "seen" as const,
      coachNote: null,
      flaggedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      addressedAt: null,
      resolvedByClient: false,
      resolvedAt: null,
    }));
    if (customChallenge.trim()) {
      newItems.push({
        id: crypto.randomUUID(),
        clientId: "self",
        category: "Custom",
        customDescription: customChallenge.trim(),
        context: context || null,
        coachStatus: "seen" as const,
        coachNote: null,
        flaggedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        addressedAt: null,
        resolvedByClient: false,
        resolvedAt: null,
      });
    }
    setItems((prev) => [...newItems, ...prev]);
    setSelected([]);
    setCustomChallenge("");
    setContext("");
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
    toast.success("Your coach can see these. Expect it to come up.");
  };

  const handleResolve = (id: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, resolvedByClient: true, resolvedAt: new Date().toISOString() } : item));
  };

  const handleUpdateContext = (id: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, context: editContext } : item));
    setEditingId(null);
    setEditContext("");
    toast.success("Context updated.");
  };

  const activeItems = items.filter((i) => !i.resolvedByClient);

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
        <Radio size={28} className="text-primary" /> Help Radar
      </h1>
      <p className="text-muted-foreground mb-8 max-w-xl">
        What are you struggling with outside of your goals? Be honest. This is how we know where to focus.
      </p>

      {/* Section 1 - Flag a Challenge Area */}
      <div className="rounded-lg border border-border bg-card p-6 mb-8">
        <h2 className="font-display font-semibold text-lg mb-4">Flag a Challenge Area</h2>

        {/* Business */}
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Business</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-6">
          {businessCategories.map((cat) => {
            const isSelected = selected.includes(cat.label);
            return (
              <button
                key={cat.label}
                onClick={() => toggleCategory(cat.label)}
                className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 text-center transition-all text-xs font-medium ${
                  isSelected
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.02]"
                }`}
              >
                {isSelected && (
                  <CheckCircle2 size={14} className="absolute top-1.5 right-1.5 text-primary" />
                )}
                <cat.icon size={20} className={isSelected ? "text-primary" : ""} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Life */}
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Life</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-6">
          {lifeCategories.map((cat) => {
            const isSelected = selected.includes(cat.label);
            return (
              <button
                key={cat.label}
                onClick={() => toggleCategory(cat.label)}
                className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 text-center transition-all text-xs font-medium ${
                  isSelected
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.02]"
                }`}
              >
                {isSelected && (
                  <CheckCircle2 size={14} className="absolute top-1.5 right-1.5 text-primary" />
                )}
                <cat.icon size={20} className={isSelected ? "text-primary" : ""} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Custom */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground block mb-1">Anything not listed?</label>
          <input
            type="text"
            value={customChallenge}
            onChange={(e) => setCustomChallenge(e.target.value)}
            placeholder="Describe a specific challenge in your own words."
            className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Context */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground block mb-1">What's the real situation?</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Don't summarize. Tell us what's actually happening. The more specific you are, the more useful the feedback will be."
            className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-y"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={selected.length === 0 && !customChallenge.trim()}
        >
          Flag These Challenges
        </Button>

        {saved && (
          <p className="text-sm text-success mt-3 flex items-center gap-1">
            <CheckCircle2 size={14} /> Your coach can see these. Expect it to come up.
          </p>
        )}
      </div>

      {/* Section 2 - Active Challenges */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-display font-semibold text-lg mb-4">Your Active Challenges</h2>
        {activeItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active challenges. Flag one above to get started.</p>
        ) : (
          <div className="space-y-3">
            {activeItems.map((item) => {
              const Icon = getCategoryIcon(item.category);
              const status = statusColors[item.coachStatus];
              const isEditing = editingId === item.id;
              return (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={16} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-foreground">
                            {item.category === "Custom" ? item.customDescription : item.category}
                          </p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Flagged {item.flaggedAt}</p>
                        {item.context && !isEditing && (
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.context}</p>
                        )}
                        {isEditing && (
                          <div className="mt-2">
                            <textarea
                              value={editContext}
                              onChange={(e) => setEditContext(e.target.value)}
                              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[60px] resize-y"
                            />
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" onClick={() => handleUpdateContext(item.id)}>Save</Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                            </div>
                          </div>
                        )}
                        {item.coachNote && item.coachStatus === "addressed" && (
                          <div className="mt-3 border-l-2 border-success/30 pl-3">
                            <p className="text-xs text-muted-foreground mb-0.5">Coach response:</p>
                            <p className="text-sm text-foreground leading-relaxed">{item.coachNote}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!isEditing && (
                        <button
                          onClick={() => { setEditingId(item.id); setEditContext(item.context || ""); }}
                          className="p-1.5 text-muted-foreground hover:text-foreground rounded"
                          title="Edit context"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleResolve(item.id)}
                        className="p-1.5 text-muted-foreground hover:text-danger rounded"
                        title="Mark resolved"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}