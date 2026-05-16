import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DOCS = [
  { key: "terms_of_service", label: "I agree to the Terms of Service." },
  { key: "privacy_policy", label: "I agree to the Privacy Policy." },
  { key: "coaching_disclaimer", label: "I understand Terrible Coaching is not therapy and not medical advice." },
  { key: "payment_authorization", label: "I authorize Terrible Coaching to charge my payment method for subscription and approved $75 commitment breach fees." },
];

export default function LegalAcceptancePage() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const allAccepted = DOCS.every((d) => accepted[d.key]);

  async function submit() {
    if (!userId) { toast.error("You must be signed in."); return; }
    if (!allAccepted) return;
    setSubmitting(true);
    const rows = DOCS.map((d) => ({ user_id: userId, document: d.key, version: "v1" }));
    const { error } = await supabase.from("legal_acceptances").upsert(rows, { onConflict: "user_id,document,version" });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Acknowledgements recorded.");
    navigate("/onboarding/assessment");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container max-w-xl">
          <h1 className="font-display text-3xl font-bold mb-2">Acknowledge the rules</h1>
          <p className="text-sm text-muted-foreground mb-6">
            The mirror doesn't lie. Read and confirm before we put your money where your goals are.
          </p>
          <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
            {DOCS.map((d) => (
              <label key={d.key} className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={!!accepted[d.key]}
                  onCheckedChange={(v) => setAccepted((p) => ({ ...p, [d.key]: !!v }))}
                />
                <span className="text-sm text-foreground">{d.label}</span>
              </label>
            ))}
            <Button variant="hero" className="w-full" disabled={!allAccepted || submitting} onClick={submit}>
              {submitting ? "Saving…" : "Continue"}
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
