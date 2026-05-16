import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const mockSession = {
  id: "ag-1",
  date: "May 3, 2026 · 12:00 PM EST",
  joinLink: "https://meet.example.com/achievement-may-2026",
  enrolled: true,
  completed: false,
  recordingUrl: null as string | null,
};

export default function AchievementGroupPage() {
  const [proudGoal, setProudGoal] = useState("");
  const [whatMadeDifference, setWhatMadeDifference] = useState("");
  const [nextBar, setNextBar] = useState("");
  const [preCallSubmitted, setPreCallSubmitted] = useState(false);
  const [nextCommitment, setNextCommitment] = useState("");
  const [commitmentSubmitted, setCommitmentSubmitted] = useState(false);
  const hasPerfectMonth = true; // would come from real data

  if (!hasPerfectMonth) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl">
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Achievement Group</h1>
          <p className="text-muted-foreground">
            This room is earned. Complete a Perfect Month - every goal verified - to unlock access.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Achievement Group</h1>
        <p className="text-muted-foreground mb-6">You earned this room. Not everyone gets here.</p>

        {/* Enrollment Banner */}
        {mockSession.enrolled && (
          <div className="rounded-xl border border-primary/30 bg-primary/[0.04] p-5 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <p className="text-sm font-display font-bold text-primary">
                You're enrolled - Perfect Month confirmed.
              </p>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>{mockSession.date}</p>
              {mockSession.joinLink && !mockSession.completed && (
                <a
                  href={mockSession.joinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm font-medium inline-block mt-1"
                >
                  Join Call
                </a>
              )}
            </div>
          </div>
        )}

        {/* Pre-Call Form */}
        {!mockSession.completed && !preCallSubmitted && (
          <div className="rounded-xl border border-primary/20 bg-card p-6 mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1">Before the call</p>
            <p className="text-sm text-muted-foreground mb-6">Share your win. Required 24 hours before.</p>

            <div className="space-y-5">
              <div>
                <Label>What goal are you most proud of completing this month?</Label>
                <Textarea
                  className="mt-1.5 min-h-[80px]"
                  placeholder="Name the specific goal."
                  value={proudGoal}
                  onChange={(e) => setProudGoal(e.target.value)}
                />
              </div>
              <div>
                <Label>What specifically made the difference this month compared to months you've missed?</Label>
                <Textarea
                  className="mt-1.5 min-h-[80px]"
                  placeholder="What changed in your behavior, environment, or mindset?"
                  value={whatMadeDifference}
                  onChange={(e) => setWhatMadeDifference(e.target.value)}
                />
              </div>
              <div>
                <Label>What are you raising the bar to next month?</Label>
                <Textarea
                  className="mt-1.5 min-h-[80px]"
                  placeholder="Name the next level."
                  value={nextBar}
                  onChange={(e) => setNextBar(e.target.value)}
                />
              </div>
              <Button
                variant="hero"
                className="w-full"
                disabled={!proudGoal || !whatMadeDifference || !nextBar}
                onClick={() => {
                  setPreCallSubmitted(true);
                  toast.success("Submitted. Come ready to share this. The room will push you higher.");
                }}
              >
                Submit Win
              </Button>
            </div>
          </div>
        )}

        {preCallSubmitted && !mockSession.completed && (
          <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-5 mb-8">
            <p className="text-sm font-medium text-primary">Submitted. Come ready to share this. The room will push you higher.</p>
          </div>
        )}

        {/* Post-Call */}
        {mockSession.completed && (
          <div className="space-y-6">
            {mockSession.recordingUrl && (
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-2">Recording</p>
                <a
                  href={mockSession.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Watch Recording
                </a>
              </div>
            )}

            {!commitmentSubmitted ? (
              <div className="rounded-xl border border-primary/20 bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1">Elevated Commitment</p>
                <p className="text-sm text-muted-foreground mb-4">
                  What is your elevated commitment for next month? Required within 24 hours.
                </p>
                <Textarea
                  className="min-h-[80px] mb-4"
                  placeholder="What are you committing to?"
                  value={nextCommitment}
                  onChange={(e) => setNextCommitment(e.target.value)}
                />
                <Button
                  variant="hero"
                  className="w-full"
                  disabled={!nextCommitment}
                  onClick={() => {
                    setCommitmentSubmitted(true);
                    toast.success("Commitment logged. Your coach will see this.");
                  }}
                >
                  Submit Commitment
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-5">
                <p className="text-sm font-medium text-primary">Commitment logged. Now go do it.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
