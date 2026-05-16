import { cn } from "@/lib/utils";

// Mock data - in production this comes from the coach_activity table
const mockLastActivity = {
  type: "check_in_review" as const,
  description: "Reviewed your check-in",
  date: "Apr 8, 2026",
  daysAgo: 2,
};

const activityLabels: Record<string, string> = {
  check_in_review: "Last reviewed your check-in",
  goal_review: "Reviewed your goal submission",
  voice_note_sent: "Sent you a voice note",
  goal_verified: "Verified your goal",
  radar_reviewed: "Reviewed your Help Radar",
  message_sent: "Sent you a message",
};

export function CoachActivityStrip() {
  const activity = mockLastActivity;
  const isStale = activity.daysAgo > 7;

  return (
    <div className="rounded-lg border border-border bg-card shadow-card border-l-[3px] border-l-primary/60 px-5 py-3.5 flex items-center gap-4 flex-wrap">
      {/* Coach avatar */}
      <div className="w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-primary-foreground">TC</span>
      </div>

      {/* Coach name + status */}
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-foreground leading-tight">Ty Allen</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-success inline-block flex-shrink-0" />
          Active coach
        </span>
      </div>

      {/* Activity line - pushed right */}
      <div className="ml-auto text-right min-w-0">
        {isStale ? (
          <p className="text-sm font-medium text-warning">Check-in review pending</p>
        ) : (
          <p className="text-sm text-muted-foreground truncate">
            {activityLabels[activity.type] || activity.description} - <span className="text-foreground font-medium">{activity.date}</span>
          </p>
        )}
      </div>
    </div>
  );
}
