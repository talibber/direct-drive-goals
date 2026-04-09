import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">
              {isLogin ? "Welcome back" : "Get started"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Log in to your coaching portal" : "Create your account after approval"}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your name" className="mt-1.5" />
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" className="mt-1.5" />
              </div>
              <Button variant="hero" className="w-full" type="submit">
                {isLogin ? "Log In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-medium">
                {isLogin ? "Apply first" : "Log in"}
              </button>
            </div>
          </div>

          {/* Demo links */}
          <div className="mt-8 rounded-lg border border-border bg-card p-4 shadow-card">
            <p className="text-xs text-muted-foreground mb-3 font-medium">Demo Access:</p>
            <div className="flex flex-col gap-2">
              <Link to="/dashboard">
                <Button variant="secondary" size="sm" className="w-full justify-start">
                  → Client Dashboard
                </Button>
              </Link>
              <Link to="/coach">
                <Button variant="secondary" size="sm" className="w-full justify-start">
                  → Coach Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
