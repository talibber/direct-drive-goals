import { useEffect, useState } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Row {
  phrase_added: string | null;
  phrase_removed: string | null;
  tone_shift: string | null;
  pressure_level: number | null;
  encouragement_level: number | null;
  directness_level: number | null;
  humor_level: number | null;
}

function topPhrases(rows: Row[], key: "phrase_added" | "phrase_removed") {
  const counts = new Map<string, number>();
  rows.forEach(r => {
    const v = (r[key] || "").trim().toLowerCase();
    if (v) counts.set(v, (counts.get(v) || 0) + 1);
  });
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 15);
}

function avg(rows: Row[], key: keyof Row) {
  const nums = rows.map(r => r[key]).filter((n): n is number => typeof n === "number");
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export default function CoachStyleLearningPage() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    supabase.from("coach_style_learning").select("*").order("created_at", { ascending: false }).limit(500)
      .then(({ data }) => setRows((data || []) as Row[]));
  }, []);

  const added = topPhrases(rows, "phrase_added");
  const removed = topPhrases(rows, "phrase_removed");

  const metrics: [string, number | null][] = [
    ["Directness", avg(rows, "directness_level")],
    ["Pressure", avg(rows, "pressure_level")],
    ["Encouragement", avg(rows, "encouragement_level")],
    ["Humor", avg(rows, "humor_level")],
  ];

  return (
    <CoachLayout>
      <h1 className="font-display text-2xl md:text-3xl font-bold">Style Learning</h1>
      <p className="text-muted-foreground text-sm mt-1 mb-6">
        What the system has learned from your edits. Drafts use these signals to match your voice over time.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {metrics.map(([label, val]) => (
          <Card key={label} className="p-4">
            <p className="text-xs uppercase text-muted-foreground">{label}</p>
            <p className="font-display text-2xl mt-1">{val == null ? "—" : (val * 100).toFixed(0) + "%"}</p>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="font-display font-semibold mb-3">Phrases you add</h2>
          {added.length === 0 && <p className="text-sm text-muted-foreground">Nothing yet.</p>}
          <ul className="space-y-1">
            {added.map(([p, c]) => (
              <li key={p} className="flex justify-between text-sm">
                <span className="text-foreground">{p}</span>
                <span className="text-muted-foreground font-mono">×{c}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h2 className="font-display font-semibold mb-3">Phrases you remove</h2>
          {removed.length === 0 && <p className="text-sm text-muted-foreground">Nothing yet.</p>}
          <ul className="space-y-1">
            {removed.map(([p, c]) => (
              <li key={p} className="flex justify-between text-sm">
                <span className="text-foreground">{p}</span>
                <span className="text-muted-foreground font-mono">×{c}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </CoachLayout>
  );
}
