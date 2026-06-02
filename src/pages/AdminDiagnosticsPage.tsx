import { useEffect, useState } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

type Category = "config" | "isolation" | "payments" | "rls" | "data";
interface Check { name: string; status: CheckStatus; detail: string; category?: Category }

const CATEGORY_LABEL: Record<Category, string> = {
  config: "Configuration",
  isolation: "Tenant & Coach Isolation",
  payments: "Payment Config",
  rls: "RLS & Data Integrity",
  data: "Data Snapshot",
};

export default function AdminDiagnosticsPage() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setRunning(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("production-readiness-check");
      if (error) throw error;
      const remote = (data?.checks ?? []) as Check[];

      // Client-side supplemental checks (things only visible from the browser).
      const local: Check[] = [];
      const { data: session } = await supabase.auth.getSession();
      local.push({
        name: "Auth session",
        status: session.session ? "pass" : "warn",
        detail: session.session ? "Active staff session" : "No session",
        category: "config",
      });

      // Detect production mockData import accidentally enabled.
      const mockEnabled = (import.meta.env as any).VITE_ENABLE_MOCK_DATA === "true";
      local.push({
        name: "Mock data flag",
        status: import.meta.env.PROD && mockEnabled ? "fail" : "pass",
        detail: mockEnabled ? "VITE_ENABLE_MOCK_DATA is on" : "Disabled in production",
        category: "data",
      });

      const all = [...remote, ...local];
      setChecks(all);
      setScore(typeof data?.score === "number" ? data.score : 0);
    } catch (e: any) {
      setError(e?.message ?? "Failed to run readiness check");
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => { run(); }, []);

  return (
    <CoachLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Production Diagnostics</h1>
          <p className="text-muted-foreground text-sm mt-1">Pre-flight checks. Re-run before onboarding each real client.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Readiness</div>
            <div className="text-2xl font-bold">{score}/100</div>
          </div>
          <Button variant="outline" size="sm" onClick={run} disabled={running}>
            <RefreshCw size={14} className={running ? "animate-spin" : ""} /> Re-run
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {checks.map((c, i) => (
          <Card key={i} className="p-4 flex items-start gap-3">
            {c.status === "pass" && <CheckCircle2 className="text-success mt-0.5" size={20} />}
            {c.status === "warn" && <AlertTriangle className="text-primary mt-0.5" size={20} />}
            {c.status === "fail" && <XCircle className="text-destructive mt-0.5" size={20} />}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{c.name}</p>
                <Badge variant={c.status === "pass" ? "default" : c.status === "warn" ? "secondary" : "destructive"}>
                  {c.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{c.detail}</p>
            </div>
          </Card>
        ))}
      </div>
    </CoachLayout>
  );
}
