import { levels } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

export function LevelBadge({ level, size = "sm", showName = true }: LevelBadgeProps) {
  const levelData = levels.find((l) => l.level === level) || levels[0];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-display font-semibold",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        size === "lg" && "text-base"
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-gradient-gold text-primary-foreground font-bold",
          size === "sm" && "w-5 h-5 text-[10px]",
          size === "md" && "w-6 h-6 text-xs",
          size === "lg" && "w-8 h-8 text-sm"
        )}
      >
        {level}
      </span>
      {showName && (
        <span className="text-primary">{levelData.name}</span>
      )}
    </span>
  );
}
