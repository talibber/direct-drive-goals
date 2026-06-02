import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function OnboardingPendingPage() {
  const [status, setStatus] = useState<string>("unprovisioned");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      setEmail(session.user.email ?? "");
      const { data } = await supabase.from("profiles").select("subscription_status").eq("user_id", session.user.id).maybeSingle();
      if (data?.subscription_status) setStatus(data.subscription_status);
    })();
  }, []);

  const headline = status === "pending_payment" ? "Payment required" : "Application pending";
  const body = status === "pending_payment"
    ? "Your application was accepted. Your coach will send you a checkout link to activate your subscription. Once payment is confirmed, your dashboard will unlock."
    : "Your account isn't active yet. Submit an application or wait for coach approval. You'll receive an email when your dashboard is ready.";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container max-w-lg text-center">
          <h1 className="font-display text-3xl font-bold mb-3">{headline}</h1>
          <p className="text-muted-foreground mb-2">{body}</p>
          {email && <p className="text-xs text-muted-foreground mb-8">Signed in as {email}</p>}
          <div className="flex flex-col gap-3">
            {status !== "pending_payment" && (
              <Link to="/apply"><Button variant="hero" className="w-full">Submit an application</Button></Link>
            )}
            <Button variant="outline" className="w-full" onClick={() => supabase.auth.signOut().then(() => (window.location.href = "/login"))}>
              Sign out
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
