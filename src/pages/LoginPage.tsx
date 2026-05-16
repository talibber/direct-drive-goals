import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back.");
    navigate("/dashboard");
  }

  async function onGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) toast.error(error.message);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Log in to your coaching portal</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
              </div>
              <Button variant="hero" className="w-full" type="submit" disabled={loading}>
                {loading ? "Signing in…" : "Log In"}
              </Button>
            </form>
            <div className="my-4 text-center text-xs text-muted-foreground">or</div>
            <Button variant="outline" className="w-full" onClick={onGoogle}>Continue with Google</Button>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              No account? <Link to="/signup" className="text-primary hover:underline font-medium">Create one</Link>
              {" · "}
              <Link to="/apply" className="text-primary hover:underline font-medium">Apply</Link>
            </div>
          </div>

          {/* Demo links - preserved for internal testing */}
          <div className="mt-8 rounded-lg border border-border bg-card p-4 shadow-card">
            <p className="text-xs text-muted-foreground mb-3 font-medium">Demo Access:</p>
            <div className="flex flex-col gap-2">
              <Link to="/dashboard"><Button variant="secondary" size="sm" className="w-full justify-start">→ Client Dashboard</Button></Link>
              <Link to="/coach"><Button variant="secondary" size="sm" className="w-full justify-start">→ Coach Dashboard</Button></Link>
              <Link to="/admin/diagnostics"><Button variant="secondary" size="sm" className="w-full justify-start">→ Production Diagnostics</Button></Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
