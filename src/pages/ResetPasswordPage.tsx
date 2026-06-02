import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated. You're signed in.");
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Set a new password</h1>
            <p className="text-sm text-muted-foreground">
              {ready ? "Enter a new password to finish resetting." : "Open this page from the password reset email you received."}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <Label htmlFor="password">New password</Label>
                <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
              </div>
              <Button variant="hero" className="w-full" type="submit" disabled={loading || !ready}>
                {loading ? "Updating…" : "Update password"}
              </Button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
