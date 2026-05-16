import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { clientResetSession } from "@/lib/mockData";
import { RotateCcw, Calendar, CheckCircle2, Clock, Send, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function isEmbeddableUrl(url: string): boolean {
  return /loom\.com|youtube\.com|youtu\.be|vimeo\.com/.test(url);
}

function getEmbedUrl(url: string): string {
  if (url.includes("loom.com/share/")) return url.replace("/share/", "/embed/");
  if (url.includes("youtube.com/watch?v=")) return url.replace("watch?v=", "embed/");
  if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/");
  if (url.includes("vimeo.com/")) return url.replace("vimeo.com/", "player.vimeo.com/video/");
  return url;
}

export default function ResetSessionPage() {
  const session = clientResetSession;
  const [reflection, setReflection] = useState(session.reflection || "");
  const [commitment, setCommitment] = useState(session.commitment || "");
  const [reflectionSubmitted, setReflectionSubmitted] = useState(false);
  const [commitmentSubmitted, setCommitmentSubmitted] = useState(false);
  const [watched, setWatched] = useState(session.recordingWatched);

  const handleSubmitReflection = () => {
    if (!reflection.trim()) return;
    setReflectionSubmitted(true);
    toast.success("Your reflection has been submitted privately to your coach.");
  };

  const handleSubmitCommitment = () => {
    if (!commitment.trim()) return;
    setCommitmentSubmitted(true);
    toast.success("Your commitment has been recorded.");
  };

  const handleToggleWatched = () => {
    setWatched(true);
    toast.success("Marked as watched. Now log your commitment below.");
  };

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Reset Session</h1>
      <p className="text-muted-foreground mb-8">Monthly group coaching for pattern-breaking.</p>

      {!session.enrolled ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <RotateCcw size={32} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-foreground font-medium mb-1">No Reset Session enrollment</p>
          <p className="text-sm text-muted-foreground">You're not currently enrolled in a Reset Session. Keep hitting your goals!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Recording Player (after session completed and recording sent) */}
          {session.completed && session.recordingUrl && session.recordingSentAt && (
            <div className="rounded-lg border border-primary/30 bg-card p-6">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <Play size={18} className="text-primary" /> {session.month} Reset Session Recording
              </h3>
              {isEmbeddableUrl(session.recordingUrl) ? (
                <div className="aspect-video rounded-lg overflow-hidden bg-background mb-4">
                  <iframe
                    src={getEmbedUrl(session.recordingUrl)}
                    className="w-full h-full"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    title="Reset Session Recording"
                  />
                </div>
              ) : (
                <a
                  href={session.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline mb-4"
                >
                  <ExternalLink size={14} /> Open Recording
                </a>
              )}

              {/* Watch acknowledgment */}
              {!watched ? (
                <div className="flex items-center gap-3 p-3 rounded-md bg-primary/5 border border-primary/20">
                  <button
                    onClick={handleToggleWatched}
                    className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center shrink-0 hover:bg-primary/10 transition-colors"
                  >
                    {watched && <CheckCircle2 size={14} className="text-primary" />}
                  </button>
                  <p className="text-sm text-foreground">I've watched this session</p>
                </div>
              ) : (
                <p className="text-xs text-success flex items-center gap-1">
                  <CheckCircle2 size={14} /> You've confirmed watching this session
                </p>
              )}
            </div>
          )}

          {/* Enrollment Card */}
          <div className="rounded-lg border-2 border-danger/30 bg-danger/5 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                <RotateCcw size={20} className="text-danger" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground text-lg">You're enrolled</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  A missed goal this month means you're part of the next Reset Session - a group coaching call where common patterns get addressed without attribution. No one is called out. Everyone benefits.
                </p>
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-primary" /> Session Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{session.sessionDate}</p>
                  <p className="text-xs text-muted-foreground">{session.month} Reset Session</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className={session.completed ? "text-success" : "text-muted-foreground"} />
                <p className="text-sm text-muted-foreground">
                  {session.completed ? "Session completed" : "Session upcoming"}
                </p>
              </div>
            </div>
          </div>

          {/* Pre-session Reflection */}
          {!session.completed && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
              <h3 className="font-display font-semibold mb-2">Before the call, answer this:</h3>
              <p className="text-sm text-muted-foreground mb-4 italic">
                What pattern do you think is behind your missed goal?
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                This is submitted privately to your coach. Not shared with the group.
              </p>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                disabled={reflectionSubmitted}
                placeholder="Be honest with yourself. What kept showing up? What did you avoid?"
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px] resize-y disabled:opacity-60"
              />
              {!reflectionSubmitted ? (
                <Button onClick={handleSubmitReflection} disabled={!reflection.trim()} className="mt-3" size="sm">
                  <Send size={14} className="mr-2" /> Submit Reflection
                </Button>
              ) : (
                <p className="text-xs text-success mt-3 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Reflection submitted to your coach
                </p>
              )}
            </div>
          )}

          {/* Session Recap (after completion) */}
          {session.completed && session.sessionRecap && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-display font-semibold mb-3">Session Recap</h3>
              <div className="border-l-2 border-primary/30 pl-4">
                <p className="text-sm text-foreground leading-relaxed">{session.sessionRecap}</p>
              </div>
            </div>
          )}

          {/* Post-session Commitment - only unlocked after watching */}
          {session.completed && watched && (
            <div className="rounded-lg border border-success/30 bg-success/5 p-6">
              <h3 className="font-display font-semibold mb-2">Post-Session Commitment</h3>
              <p className="text-sm text-muted-foreground mb-4">
                What is your one commitment coming out of this session? Required within 48 hours of the recording being sent.
              </p>
              <textarea
                value={commitment}
                onChange={(e) => setCommitment(e.target.value)}
                disabled={commitmentSubmitted}
                placeholder="One specific, measurable commitment..."
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px] resize-y disabled:opacity-60"
              />
              {!commitmentSubmitted ? (
                <Button onClick={handleSubmitCommitment} disabled={!commitment.trim()} className="mt-3" size="sm" variant="default">
                  <CheckCircle2 size={14} className="mr-2" /> Submit Commitment
                </Button>
              ) : (
                <p className="text-xs text-success mt-3 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Commitment recorded
                </p>
              )}
            </div>
          )}

          {/* Locked commitment message when not yet watched */}
          {session.completed && session.recordingUrl && !watched && (
            <div className="rounded-lg border border-border bg-card p-6 opacity-60">
              <h3 className="font-display font-semibold mb-2 text-muted-foreground">Post-Session Commitment</h3>
              <p className="text-sm text-muted-foreground">
                Watch the session recording and confirm above to unlock your commitment field.
              </p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}