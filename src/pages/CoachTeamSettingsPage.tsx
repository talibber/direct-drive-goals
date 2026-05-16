import { useEffect, useState } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Users, Shield, Clock, FileText } from "lucide-react";
import { toast } from "sonner";

const ROLES = ["owner","lead_coach","assistant_coach","client_success","billing_admin","viewer"] as const;

export default function CoachTeamSettingsPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [perms, setPerms] = useState<any[]>([]);
  const [targets, setTargets] = useState<any[]>([]);
  const [audit, setAudit] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<typeof ROLES[number]>("assistant_coach");

  useEffect(() => { load(); }, []);
  async function load() {
    const [m, p, t, a] = await Promise.all([
      supabase.from("staff_members").select("*").order("created_at"),
      supabase.from("staff_permissions").select("*").order("role"),
      supabase.from("response_target_settings").select("*").order("priority"),
      supabase.from("audit_log").select("*").order("occurred_at", { ascending: false }).limit(50),
    ]);
    setMembers(m.data || []); setPerms(p.data || []); setTargets(t.data || []); setAudit(a.data || []);
  }

  async function addMember() {
    if (!newEmail) return;
    // Look up user_id by email via profiles
    const { data: prof } = await supabase.from("profiles").select("user_id, display_name").eq("email", newEmail).maybeSingle();
    if (!prof) return toast.error("No user found with that email. They must sign up first.");
    const { error } = await supabase.from("staff_members").insert({
      user_id: prof.user_id, role: newRole, display_name: prof.display_name, email: newEmail,
    });
    if (error) return toast.error(error.message);
    toast.success("Staff member added");
    setNewEmail(""); load();
  }

  const grouped = ROLES.map((r) => ({ role: r, perms: perms.filter((p) => p.role === r).map((p) => p.permission) }));

  return (
    <CoachLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3"><Settings className="text-primary" /> Team & Settings</h1>
        <p className="text-muted-foreground mt-1">Staff roles, permissions, internal response targets, and audit log.</p>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="font-semibold flex items-center gap-2 mb-4"><Users className="h-4 w-4" /> Staff Members</h2>
        <div className="flex gap-2 mb-4">
          <Input placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
          <Select value={newRole} onValueChange={(v) => setNewRole(v as any)}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
          </Select>
          <Button onClick={addMember}>Add</Button>
        </div>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">No staff members yet. Add yourself as Owner to enable role-based access.</p>
        ) : (
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-border/40">
                <div>
                  <p className="font-medium">{m.display_name || m.email}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
                <Badge>{m.role}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="font-semibold flex items-center gap-2 mb-4"><Shield className="h-4 w-4" /> Permission Matrix</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {grouped.map((g) => (
            <div key={g.role} className="border border-border rounded-md p-3">
              <p className="font-medium mb-2">{g.role}</p>
              <div className="flex flex-wrap gap-1">
                {g.perms.map((p) => <Badge key={p} variant="outline" className="text-xs">{p}</Badge>)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="font-semibold flex items-center gap-2 mb-4"><Clock className="h-4 w-4" /> Response Targets (internal only)</h2>
        <p className="text-xs text-muted-foreground mb-3">Never shown to clients. Used to set Action Queue priorities.</p>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-muted-foreground">
            <th className="pb-2">Track</th><th>Message Type</th><th>Priority</th><th>Target (min)</th>
          </tr></thead>
          <tbody>
            {targets.map((t) => (
              <tr key={t.id} className="border-t border-border/40">
                <td className="py-2">{t.track}</td><td>{t.message_type}</td><td>P{t.priority}</td><td>{t.internal_target_minutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold flex items-center gap-2 mb-4"><FileText className="h-4 w-4" /> Audit Log (last 50)</h2>
        {audit.length === 0 ? <p className="text-sm text-muted-foreground">No audit entries yet.</p> : (
          <div className="space-y-1 text-xs font-mono">
            {audit.map((a) => (
              <div key={a.id} className="py-1 border-b border-border/30 flex justify-between gap-4">
                <span>{new Date(a.occurred_at).toLocaleString()}</span>
                <span className="text-primary">{a.action}</span>
                <span className="text-muted-foreground">{a.entity_type}</span>
                <span className="truncate">{a.entity_id}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </CoachLayout>
  );
}
