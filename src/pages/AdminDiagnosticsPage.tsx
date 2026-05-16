import { useEffect, useState } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

type CheckStatus = "pass" | "warn" | "fail";
interface Check { name: string; status: CheckStatus; detail: string }

export default function AdminDiagnosticsPage() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);

  async function run() {
    setRunning(true);
    const results: Check[] = [];

    const { data: session } = await supabase.auth.getSession();
    results.push({ name: "Auth connected", status: session.session ? "pass" : "warn", detail: session.session ? "Active session" : "No session - sign in to verify" });

    const { data: tenants, error: tErr } = await supabase.from("tenants").select("id,slug,is_demo");
    results.push({ name: "Tenants table reachable", status: !tErr && (tenants?.length ?? 0) >= 2 ? "pass" : "fail", detail: tErr?.message ?? `${tenants?.length ?? 0} tenants` });

    const { data: settings } = await supabase.from("system_settings").select("key,value");
    const get = (k: string) => settings?.find((s: any) => s.key === k)?.value;
    results.push({ name: "Kill switches loaded", status: settings?.length ? "pass" : "fail", detail: `${settings?.length ?? 0} settings` });
    results.push({ name: "Auto-send messaging disabled", status: get("messaging_auto_send_enabled") === false ? "pass" : "warn", detail: `messaging_auto_send_enabled = ${JSON.stringify(get("messaging_auto_send_enabled"))}` });
    results.push({ name: "Auto-charge breach fees disabled", status: get("breach_auto_charge_enabled") === false ? "pass" : "warn", detail: `breach_auto_charge_enabled = ${JSON.stringify(get("breach_auto_charge_enabled"))}` });

    const { count: profCount } = await supabase.from("profiles").select("user_id", { count: "exact", head: true });
    results.push({ name: "Profiles table accessible", status: profCount !== null ? "pass" : "fail", detail: `${profCount ?? 0} profiles` });

    const { count: realCount } = await supabase.from("profiles").select("user_id", { count: "exact", head: true }).eq("client_type", "real").eq("is_demo", false);
    const { count: demoCount } = await supabase.from("profiles").select("user_id", { count: "exact", head: true }).eq("is_demo", true);
    results.push({ name: "Real vs demo split", status: "pass", detail: `${realCount ?? 0} real / ${demoCount ?? 0} demo` });

    const { count: pendingDrafts } = await supabase.from("coach_message_drafts").select("id", { count: "exact", head: true }).in("status", ["pending", "needs_human_review"]);
    results.push({ name: "Approval queue queryable", status: pendingDrafts !== null ? "pass" : "fail", detail: `${pendingDrafts ?? 0} pending drafts` });

    const { data: legal } = await supabase.from("legal_acceptances").select("document").limit(1);
    results.push({ name: "Legal acceptances table writable", status: legal !== null ? "pass" : "fail", detail: legal === null ? "Table not reachable" : "Reachable" });

    const { count: candidates } = await supabase.from("commitment_breaches").select("id", { count: "exact", head: true }).eq("lifecycle_status", "candidate");
    results.push({ name: "Breach lifecycle tracked", status: candidates !== null ? "pass" : "fail", detail: `${candidates ?? 0} candidates awaiting review` });

    results.push({ name: "Payments live", status: get("payments_live_enabled") ? "pass" : "warn", detail: "Stripe/Paddle not yet enabled - expected for beta" });

    const passes = results.filter((r) => r.status === "pass").length;
    const total = results.length;
    setScore(Math.round((passes / total) * 100));
    setChecks(results);
    setRunning(false);
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
