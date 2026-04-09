import { clientPoints, levels, clientAchievements } from "@/lib/mockData";
import { LevelBadge } from "./LevelBadge";
import { Award, TrendingUp } from "lucide-react";

const badgeIcons: Record<string, string> = {
  "First Goal Approved": "🎯",
  "First Goal Verified": "✅",
  "Perfect Month": "🏆",
  "4 Week Streak": "🔥",
  "12 Week Streak": "💎",
  "Reset Rebound": "🔄",
  "No Mercy": "⚡",
  "Pattern Breaker": "🧠",
  "Full Send": "📎",
};

export function GamificationPanel() {
  const currentLevel = levels.find((l) => l.level === clientPoints.currentLevel)!;
  const nextLevel = levels.find((l) => l.level === clientPoints.currentLevel + 1);
  const progressToNext = nextLevel
    ? ((clientPoints.totalPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card">
      {/* Level & Points */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <LevelBadge level={clientPoints.currentLevel} size="lg" />
          <div>
            <p className="text-sm text-muted-foreground">{clientPoints.totalPoints.toLocaleString()} total points</p>
            <p className="text-xs text-muted-foreground/60">{clientPoints.monthlyPoints} this month</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-primary">
          <TrendingUp size={14} />
          <span className="font-medium">+{clientPoints.monthlyPoints} pts</span>
        </div>
      </div>

      {/* Progress bar */}
      {nextLevel && (
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Lvl {clientPoints.currentLevel}</span>
            <span>{nextLevel.minPoints - clientPoints.totalPoints} pts to Lvl {nextLevel.level}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-gold transition-all"
              style={{ width: `${Math.min(progressToNext, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground/60 mt-1 italic">{currentLevel.description}</p>
        </div>
      )}
      {!nextLevel && (
        <p className="text-xs text-primary italic mb-4">{currentLevel.description}</p>
      )}

      {/* Badges */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Award size={14} className="text-primary" />
          <span className="text-xs font-medium text-foreground">Badges</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {clientAchievements.map((a) => (
            <span
              key={a.id}
              title={`${a.badgeName} — ${a.description}`}
              className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary cursor-default"
            >
              {badgeIcons[a.badgeName] || "🏅"} {a.badgeName}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
