import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LevelBadge } from "@/components/LevelBadge";
import { communityPosts, teams, leaderboard, levels, type CommunityPost, type Team } from "@/lib/mockData";
import { Flame, MessageSquare, Send, Users, Trophy, Award, Crown, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ========== FEED TAB ==========
function FeedTab() {
  const [posts, setPosts] = useState(communityPosts);
  const [newPost, setNewPost] = useState("");
  const [postType, setPostType] = useState<"post" | "win" | "question" | "reflection">("post");
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likesCount: p.liked ? p.likesCount - 1 : p.likesCount + 1 }
          : p
      )
    );
  };

  const toggleReplies = (postId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  };

  const typeLabels = { post: "Post", win: "🏆 Win", question: "❓ Question", reflection: "💭 Reflection" };

  return (
    <div className="space-y-6">
      {/* Compose */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex gap-2 mb-3">
          {(Object.keys(typeLabels) as Array<keyof typeof typeLabels>).map((t) => (
            <button
              key={t}
              onClick={() => setPostType(t)}
              className={cn(
                "text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
                postType === t
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {typeLabels[t]}
            </button>
          ))}
        </div>
        <Textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share a win, ask a question, or post a reflection..."
          className="min-h-[80px] mb-3"
        />
        <div className="flex justify-end">
          <Button variant="hero" size="sm" disabled={!newPost.trim()}>
            <Send size={14} className="mr-1.5" /> Post
          </Button>
        </div>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <div key={post.id} className="rounded-lg border border-border bg-card p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {post.postType === "system" ? (
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Flame size={16} className="text-primary" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {post.clientName[0]}
                </div>
              )}
              <div>
                {post.postType === "system" ? (
                  <p className="text-sm font-medium text-primary">Terrible Coaching</p>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{post.clientName}</p>
                    <LevelBadge level={post.level} size="sm" />
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground">{post.createdAt}</p>
              </div>
            </div>
            {post.postType !== "system" && post.postType !== "post" && (
              <span className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded-full border",
                post.postType === "win" && "text-primary border-primary/30 bg-primary/10",
                post.postType === "question" && "text-foreground border-border bg-secondary",
                post.postType === "reflection" && "text-muted-foreground border-border bg-muted/50"
              )}>
                {post.postType === "win" ? "Win" : post.postType === "question" ? "Question" : "Reflection"}
              </span>
            )}
          </div>

          {/* Content */}
          <p className="text-sm text-foreground leading-relaxed mb-3">{post.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-4 border-t border-border/50 pt-3">
            <button
              onClick={() => handleLike(post.id)}
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium transition-colors",
                post.liked ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              🔥 {post.likesCount}
            </button>
            {post.replies.length > 0 && (
              <button
                onClick={() => toggleReplies(post.id)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare size={13} />
                {post.replies.length} {post.replies.length === 1 ? "reply" : "replies"}
                {expandedReplies.has(post.id) ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>

          {/* Replies */}
          {expandedReplies.has(post.id) && post.replies.length > 0 && (
            <div className="mt-3 ml-4 pl-4 border-l-2 border-primary/10 space-y-3">
              {post.replies.map((r) => (
                <div key={r.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-foreground text-[10px] font-bold">
                      {r.clientName[0]}
                    </div>
                    <span className="text-xs font-medium text-foreground">{r.clientName}</span>
                    <LevelBadge level={r.level} size="sm" showName={false} />
                    <span className="text-[10px] text-muted-foreground">{r.createdAt}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed ml-8">{r.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ========== TEAMS TAB ==========
function TeamsTab() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const categories = ["Entrepreneurs & Founders", "Career & Corporate", "Health & Habits", "Creative & Artists", "Parents & Family", "Sales & Revenue", "Students & Early Career", "Investors & Finance", "Real Estate", "General — Open to Everyone"];

  if (selectedTeam) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedTeam(null)} className="text-sm text-primary hover:underline">
          ← Back to Teams
        </button>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">{selectedTeam.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{selectedTeam.description}</p>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary mt-2 inline-block">
                {selectedTeam.category}
              </span>
            </div>
            {!selectedTeam.isMember && selectedTeam.isOpen && (
              <Button variant="hero" size="sm">Join Team</Button>
            )}
            {selectedTeam.isMember && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Member</span>
            )}
          </div>

          {/* Team stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <div className="text-lg font-display font-bold text-gradient-gold">{selectedTeam.members.length}</div>
              <div className="text-[10px] text-muted-foreground">Members</div>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <div className="text-lg font-display font-bold text-gradient-gold">
                {selectedTeam.members.length > 0 ? Math.round(selectedTeam.members.reduce((a, m) => a + m.streak, 0) / selectedTeam.members.length) : 0}
              </div>
              <div className="text-[10px] text-muted-foreground">Avg Streak</div>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <div className="text-lg font-display font-bold text-gradient-gold">
                {selectedTeam.members.reduce((a, m) => a + m.activeGoals, 0)}
              </div>
              <div className="text-[10px] text-muted-foreground">Active Goals</div>
            </div>
          </div>

          {/* Team Challenge */}
          {selectedTeam.challenge && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={16} className="text-primary" />
                <span className="text-sm font-semibold text-foreground">Team Challenge</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{selectedTeam.challenge.description}</p>
              <div className="w-full bg-secondary rounded-full h-2 mb-1">
                <div
                  className="h-2 rounded-full bg-gradient-gold"
                  style={{ width: `${(selectedTeam.challenge.currentValue / selectedTeam.challenge.targetValue) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{selectedTeam.challenge.currentValue}/{selectedTeam.challenge.targetValue}</span>
                <span>Due {selectedTeam.challenge.dueDate}</span>
              </div>
            </div>
          )}

          {/* Members */}
          <h4 className="text-sm font-semibold text-foreground mb-3">Members</h4>
          <div className="space-y-2">
            {selectedTeam.members.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-bold text-xs">
                    {m.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{m.name}</span>
                      <LevelBadge level={m.level} size="sm" />
                    </div>
                    <p className="text-[10px] text-muted-foreground">{m.streak} wk streak · {m.activeGoals} active goals</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {m.badges.slice(0, 3).map((b) => (
                    <span key={b} title={b} className="text-xs">🏅</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* My teams */}
      {teams.filter((t) => t.isMember).length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Your Teams</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {teams.filter((t) => t.isMember).map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className="text-left rounded-lg border-2 border-primary/20 bg-card p-4 hover:border-primary/40 transition-colors"
              >
                <h4 className="font-display font-bold text-foreground">{team.name}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{team.description}</p>
                <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Users size={11} /> {team.memberCount}/{team.maxMembers}</span>
                  <span className="px-1.5 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary">{team.category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Browse teams */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Browse Teams</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {teams.filter((t) => !t.isMember).map((team) => (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team)}
              className="text-left rounded-lg border border-border bg-card p-4 hover:border-muted-foreground/30 transition-colors"
            >
              <h4 className="font-display font-semibold text-foreground">{team.name}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{team.description}</p>
              <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Users size={11} /> {team.memberCount}/{team.maxMembers}</span>
                <span className="px-1.5 py-0.5 rounded-full border border-border text-muted-foreground">{team.category}</span>
                {team.isOpen && <span className="text-success">Open</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========== LEADERBOARD TAB ==========
function LeaderboardTab() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-foreground">April 2026 Leaderboard</h3>
          <span className="text-[10px] text-muted-foreground">Resets monthly · Lifetime tracked separately</span>
        </div>
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={cn(
                "flex items-center justify-between rounded-lg p-3",
                entry.rank <= 3
                  ? "border-2 border-primary/20 bg-primary/5"
                  : "border border-border bg-background/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm",
                  entry.rank === 1 && "bg-gradient-gold text-primary-foreground",
                  entry.rank === 2 && "bg-secondary text-foreground",
                  entry.rank === 3 && "bg-secondary text-foreground",
                  entry.rank > 3 && "bg-muted text-muted-foreground"
                )}>
                  {entry.rank <= 3 ? (
                    <Crown size={16} className={entry.rank === 1 ? "text-primary-foreground" : "text-primary"} />
                  ) : (
                    entry.rank
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{entry.clientName}</span>
                    <LevelBadge level={entry.level} size="sm" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{entry.streak} wk streak</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-display font-bold text-gradient-gold">{entry.monthlyPoints}</span>
                <span className="text-xs text-muted-foreground ml-1">pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========== MAIN PAGE ==========
export default function CommunityPage() {
  const [tab, setTab] = useState<"feed" | "teams" | "leaderboard">("feed");

  const tabs = [
    { id: "feed" as const, label: "The Feed", icon: MessageSquare },
    { id: "teams" as const, label: "Teams", icon: Users },
    { id: "leaderboard" as const, label: "Leaderboard", icon: Trophy },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Community</h1>
        <p className="text-muted-foreground mt-1">Connect, share wins, and learn from each other.</p>
      </div>

      {/* Privacy notice */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2.5 mb-6">
        <Shield size={14} className="text-primary flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          Your coaching data is always private. Only what you choose to share appears here.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "feed" && <FeedTab />}
      {tab === "teams" && <TeamsTab />}
      {tab === "leaderboard" && <LeaderboardTab />}
    </DashboardLayout>
  );
}
