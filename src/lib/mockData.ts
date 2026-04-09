export const weeklyCheckIns = [
  { week: "W1", energy: 7, stress: 5, focus: 8, confidence: 7, sleep: 6, habits: 80, score: 74 },
  { week: "W2", energy: 6, stress: 6, focus: 7, confidence: 6, sleep: 7, habits: 75, score: 69 },
  { week: "W3", energy: 8, stress: 4, focus: 8, confidence: 8, sleep: 7, habits: 90, score: 82 },
  { week: "W4", energy: 7, stress: 5, focus: 9, confidence: 8, sleep: 8, habits: 85, score: 79 },
  { week: "W5", energy: 8, stress: 3, focus: 9, confidence: 9, sleep: 8, habits: 92, score: 86 },
  { week: "W6", energy: 9, stress: 3, focus: 9, confidence: 9, sleep: 9, habits: 95, score: 91 },
];

export type GoalStatus = "pending_approval" | "revision_requested" | "active" | "at_risk" | "missed" | "completed" | "rejected" | "proof_pending" | "proof_submitted" | "waived";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  target: string;
  progress: number;
  status: GoalStatus;
  dueDate: string;
  stake: number;
  metricType: string;
  targetValue: number;
  currentValue: number;
  proofRequirement?: string;
  coachApproved: boolean;
  approvedAt?: string;
  coachNotes?: string;
  resubmissionCount: number;
  clientName?: string;
  clientScore?: number;
  clientType?: string;
  proofDescription?: string;
  proofFileUrl?: string;
  proofFileUrls?: string[];
  selfCompleted?: boolean;
  coachVerificationNote?: string;
  proofSubmittedAt?: string;
  selfAssessment?: "completed" | "not_completed";
  coachDecision?: "verified" | "waived" | "missed" | null;
}

export interface ProofSubmission {
  id: string;
  goalId: string;
  clientId: string;
  completionDescription: string;
  fileUrls: string[];
  selfAssessment: "completed" | "not_completed";
  coachDecision: "verified" | "waived" | "missed" | null;
  coachNote: string | null;
  submittedAt: string;
  decidedAt: string | null;
}

export const goals: Goal[] = [
  {
    id: "1",
    title: "Close 3 enterprise deals",
    category: "Business",
    target: "3 signed contracts",
    progress: 66,
    status: "active",
    dueDate: "Apr 30",
    stake: 75,
    metricType: "count",
    targetValue: 3,
    currentValue: 2,
    proofRequirement: "Screenshot of signed contracts",
    coachApproved: true,
    approvedAt: "Apr 2, 2026",
    resubmissionCount: 0,
  },
  {
    id: "2",
    title: "Morning routine 6 days/week",
    category: "Life",
    target: "6 days per week",
    progress: 83,
    status: "proof_pending",
    dueDate: "Apr 9",
    stake: 75,
    metricType: "count",
    targetValue: 24,
    currentValue: 20,
    proofRequirement: "Daily check-in log",
    coachApproved: true,
    approvedAt: "Apr 1, 2026",
    resubmissionCount: 0,
  },
  {
    id: "3",
    title: "Ship MVP by end of month",
    category: "Business",
    target: "Deployed product",
    progress: 40,
    status: "at_risk",
    dueDate: "Apr 30",
    stake: 75,
    metricType: "yes/no",
    targetValue: 1,
    currentValue: 0,
    proofRequirement: "Live URL",
    coachApproved: true,
    approvedAt: "Apr 1, 2026",
    resubmissionCount: 0,
  },
  {
    id: "4",
    title: "Read 2 business books",
    category: "Business",
    target: "2 books completed",
    progress: 0,
    status: "pending_approval",
    dueDate: "May 31",
    stake: 75,
    metricType: "count",
    targetValue: 2,
    currentValue: 0,
    proofRequirement: "Book summary notes",
    coachApproved: false,
    resubmissionCount: 0,
  },
  {
    id: "5",
    title: "Work out more",
    category: "Life",
    target: "Exercise regularly",
    progress: 0,
    status: "revision_requested",
    dueDate: "May 31",
    stake: 75,
    metricType: "count",
    targetValue: 10,
    currentValue: 0,
    proofRequirement: "Gym check-in screenshots",
    coachApproved: false,
    coachNotes: "This goal needs a clearer metric. Instead of 'work out more,' define the exact frequency and duration so we can score it fairly.",
    resubmissionCount: 1,
  },
];

export const pendingCoachGoals: Goal[] = [
  {
    id: "4",
    title: "Read 2 business books",
    category: "Business",
    target: "2 books completed",
    progress: 0,
    status: "pending_approval",
    dueDate: "May 31",
    stake: 75,
    metricType: "count",
    targetValue: 2,
    currentValue: 0,
    proofRequirement: "Book summary notes",
    coachApproved: false,
    resubmissionCount: 0,
    clientName: "Marcus Chen",
    clientScore: 86,
    clientType: "Business",
  },
  {
    id: "6",
    title: "Meditate 15 min daily",
    category: "Life",
    target: "15 minutes every day for 30 days",
    progress: 0,
    status: "pending_approval",
    dueDate: "May 31",
    stake: 75,
    metricType: "count",
    targetValue: 30,
    currentValue: 0,
    proofRequirement: "Meditation app screenshots",
    coachApproved: false,
    resubmissionCount: 0,
    clientName: "Sarah Kim",
    clientScore: 72,
    clientType: "Life",
  },
];

export const proofSubmittedGoals: Goal[] = [
  {
    id: "7",
    title: "Run a half marathon",
    category: "Life",
    target: "Complete 13.1 miles",
    progress: 100,
    status: "proof_submitted",
    dueDate: "Apr 10",
    stake: 75,
    metricType: "yes/no",
    targetValue: 1,
    currentValue: 1,
    proofRequirement: "Race finish photo or GPS tracker screenshot",
    coachApproved: true,
    approvedAt: "Mar 15, 2026",
    resubmissionCount: 0,
    clientName: "James Wright",
    clientScore: 91,
    clientType: "Business",
    proofDescription: "Completed the Austin Half Marathon on April 8th. Finished in 1:52:34. Attached my Strava screenshot and finisher medal photo.",
    selfCompleted: true,
    selfAssessment: "completed",
    proofSubmittedAt: "Apr 9, 2026",
    proofFileUrls: [
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
    ],
  },
  {
    id: "8",
    title: "Launch email newsletter",
    category: "Business",
    target: "First issue sent to 100+ subscribers",
    progress: 100,
    status: "proof_submitted",
    dueDate: "Apr 8",
    stake: 75,
    metricType: "yes/no",
    targetValue: 1,
    currentValue: 1,
    proofRequirement: "Screenshot of sent newsletter and subscriber count",
    coachApproved: true,
    approvedAt: "Mar 10, 2026",
    resubmissionCount: 0,
    clientName: "Alex Rivera",
    clientScore: 78,
    clientType: "Business",
    proofDescription: "Sent first edition of 'The Builder's Brief' to 142 subscribers via ConvertKit. Open rate was 48%.",
    selfCompleted: true,
    selfAssessment: "completed",
    proofSubmittedAt: "Apr 8, 2026",
    proofFileUrls: [],
  },
];

export const goalApprovalHistory = [
  { id: "1", goalTitle: "Close 3 enterprise deals", action: "approved" as const, coachNotes: null, createdAt: "Apr 2, 2026", clientName: "Marcus Chen" },
  { id: "2", goalTitle: "Morning routine 6 days/week", action: "approved" as const, coachNotes: null, createdAt: "Apr 1, 2026", clientName: "Marcus Chen" },
  { id: "3", goalTitle: "Work out more", action: "revision_requested" as const, coachNotes: "This goal needs a clearer metric. Instead of 'work out more,' define the exact frequency and duration so we can score it fairly.", createdAt: "Apr 5, 2026", clientName: "Marcus Chen" },
  { id: "4", goalTitle: "Ship MVP by end of month", action: "approved" as const, coachNotes: null, createdAt: "Apr 1, 2026", clientName: "Marcus Chen" },
];

export const goalDecisionHistory = [
  { id: "1", goalTitle: "Run a half marathon", dueDate: "Apr 10", selfAssessment: "completed" as const, coachDecision: "verified" as const, coachNote: "Great job on a strong finish time.", decidedAt: "Apr 10, 2026", stakeCharged: false, clientName: "James Wright" },
  { id: "2", goalTitle: "Daily journaling for 30 days", dueDate: "Mar 31", selfAssessment: "not_completed" as const, coachDecision: "missed" as const, coachNote: "Only 12 of 30 days completed. Enrolled in Reset Session.", decidedAt: "Apr 1, 2026", stakeCharged: true, clientName: "Marcus Chen" },
  { id: "3", goalTitle: "Complete sales playbook", dueDate: "Mar 31", selfAssessment: "completed" as const, coachDecision: "waived" as const, coachNote: "Playbook was 80% done with strong content. Waiving stake given extenuating travel schedule. Must complete remaining 20% this month.", decidedAt: "Apr 1, 2026", stakeCharged: false, clientName: "Alex Rivera" },
];

export const billingHistory = [
  { id: "1", date: "Apr 1, 2026", description: "Monthly Subscription", amount: 99, type: "subscription" },
  { id: "2", date: "Mar 31, 2026", description: "Missed Goal: Daily journaling", amount: 75, type: "stake" },
  { id: "3", date: "Mar 1, 2026", description: "Monthly Subscription", amount: 99, type: "subscription" },
  { id: "4", date: "Feb 1, 2026", description: "Monthly Subscription", amount: 99, type: "subscription" },
];

export const coachNotes = [
  { date: "Apr 7", note: "Strong week. Follow through on the enterprise outreach. Stop overthinking the MVP scope—ship ugly." },
  { date: "Mar 31", note: "Missed journaling goal. We discussed why avoidance patterns show up when stakes feel real. Recommit next month." },
  { date: "Mar 24", note: "Energy dipped. Sleep needs to be the priority. No negotiation on the 10pm cutoff." },
];

export const clients = [
  { id: "1", name: "Marcus Chen", email: "marcus@example.com", type: "Business", status: "active", score: 86, missedGoals: 1, lastCheckIn: "2 days ago", risk: false, perfectMonths: 2 },
  { id: "2", name: "Sarah Kim", email: "sarah@example.com", type: "Life", status: "active", score: 72, missedGoals: 0, lastCheckIn: "5 days ago", risk: true, perfectMonths: 0 },
  { id: "3", name: "James Wright", email: "james@example.com", type: "Business", status: "active", score: 91, missedGoals: 0, lastCheckIn: "1 day ago", risk: false, perfectMonths: 4 },
  { id: "4", name: "Priya Patel", email: "priya@example.com", type: "Life", status: "active", score: 65, missedGoals: 2, lastCheckIn: "8 days ago", risk: true, perfectMonths: 0 },
  { id: "5", name: "Alex Rivera", email: "alex@example.com", type: "Business", status: "active", score: 78, missedGoals: 1, lastCheckIn: "3 days ago", risk: false, perfectMonths: 1 },
];

export const applications = [
  { id: "1", name: "David Park", email: "david@example.com", type: "Business", occupation: "Startup Founder", challenge: "Scaling from $1M to $5M ARR", submitted: "Apr 8", status: "pending" },
  { id: "2", name: "Emily Foster", email: "emily@example.com", type: "Life", occupation: "VP of Engineering", challenge: "Work-life balance and burnout", submitted: "Apr 7", status: "pending" },
  { id: "3", name: "Tom Nguyen", email: "tom@example.com", type: "Business", occupation: "Solo Founder", challenge: "Decision paralysis on product direction", submitted: "Apr 5", status: "approved" },
];

export interface PerfectMonthAlert {
  id: string;
  clientId: string;
  clientName: string;
  month: string;
  triggeredAt: string;
  callScheduled: boolean;
  callScheduledAt?: string;
  callTitle?: string;
  coachNotes?: string;
}

export const perfectMonthAlerts: PerfectMonthAlert[] = [
  {
    id: "pm-1",
    clientId: "3",
    clientName: "James Wright",
    month: "April 2026",
    triggeredAt: "Apr 9, 2026",
    callScheduled: false,
  },
];

// Client-side perfect month data
export const clientPerfectMonth = {
  active: true,
  month: "April 2026",
  callScheduledAt: null as string | null,
  perfectMonthCount: 2,
};

// Help Radar data
export interface HelpRadarItem {
  id: string;
  clientId: string;
  clientName?: string;
  category: string;
  customDescription: string | null;
  context: string | null;
  coachStatus: "seen" | "on_deck" | "addressed";
  coachNote: string | null;
  flaggedAt: string;
  addressedAt: string | null;
  resolvedByClient: boolean;
  resolvedAt: string | null;
}

export const helpRadarItems: HelpRadarItem[] = [
  {
    id: "hr-1",
    clientId: "self",
    category: "Sales & Closing",
    customDescription: null,
    context: "I'm getting meetings booked but I freeze when it's time to ask for the sale. I've lost 3 deals this month because I couldn't close. I don't know if it's pricing confidence or fear of rejection.",
    coachStatus: "on_deck",
    coachNote: null,
    flaggedAt: "Apr 7, 2026",
    addressedAt: null,
    resolvedByClient: false,
    resolvedAt: null,
  },
  {
    id: "hr-2",
    clientId: "self",
    category: "Energy & Health",
    customDescription: null,
    context: "Sleeping 5 hours most nights. Caffeine is the only thing keeping me functional. I know it's affecting my decision making but I can't figure out where the time goes.",
    coachStatus: "addressed",
    coachNote: "We need to address the 10pm cutoff again. This is non-negotiable. Your performance data already shows the correlation — weeks with <6hrs sleep, your score drops 15+ points. Let's lock in a sleep protocol this week.",
    flaggedAt: "Apr 3, 2026",
    addressedAt: "Apr 5, 2026",
    resolvedByClient: false,
    resolvedAt: null,
  },
  {
    id: "hr-3",
    clientId: "self",
    category: "Decision Making",
    customDescription: null,
    context: "I have two potential co-founders and I can't decide. One is more experienced but I don't fully trust them. The other is less experienced but I'd trust them with anything.",
    coachStatus: "seen",
    coachNote: null,
    flaggedAt: "Apr 8, 2026",
    addressedAt: null,
    resolvedByClient: false,
    resolvedAt: null,
  },
];

// Coach-side Help Radar data (across all clients)
export const coachHelpRadarItems: HelpRadarItem[] = [
  { id: "chr-1", clientId: "1", clientName: "Marcus Chen", category: "Sales & Closing", customDescription: null, context: "Getting meetings but can't close. Lost 3 deals this month.", coachStatus: "on_deck", coachNote: null, flaggedAt: "Apr 7, 2026", addressedAt: null, resolvedByClient: false, resolvedAt: null },
  { id: "chr-2", clientId: "1", clientName: "Marcus Chen", category: "Energy & Health", customDescription: null, context: "Sleeping 5 hours most nights.", coachStatus: "addressed", coachNote: "Addressed sleep protocol.", flaggedAt: "Apr 3, 2026", addressedAt: "Apr 5, 2026", resolvedByClient: false, resolvedAt: null },
  { id: "chr-3", clientId: "1", clientName: "Marcus Chen", category: "Decision Making", customDescription: null, context: "Co-founder decision paralysis.", coachStatus: "seen", coachNote: null, flaggedAt: "Apr 8, 2026", addressedAt: null, resolvedByClient: false, resolvedAt: null },
  { id: "chr-4", clientId: "2", clientName: "Sarah Kim", category: "Work-Life Balance", customDescription: null, context: "Working until midnight every day. Relationship suffering.", coachStatus: "seen", coachNote: null, flaggedAt: "Apr 6, 2026", addressedAt: null, resolvedByClient: false, resolvedAt: null },
  { id: "chr-5", clientId: "2", clientName: "Sarah Kim", category: "Confidence & Mindset", customDescription: null, context: "Imposter syndrome at the VP level.", coachStatus: "seen", coachNote: null, flaggedAt: "Apr 6, 2026", addressedAt: null, resolvedByClient: false, resolvedAt: null },
  { id: "chr-6", clientId: "2", clientName: "Sarah Kim", category: "Communication", customDescription: null, context: "Can't give direct feedback to reports.", coachStatus: "seen", coachNote: null, flaggedAt: "Apr 6, 2026", addressedAt: null, resolvedByClient: false, resolvedAt: null },
  { id: "chr-7", clientId: "4", clientName: "Priya Patel", category: "Time Management", customDescription: null, context: "Constantly reactive. Never working on priorities.", coachStatus: "on_deck", coachNote: null, flaggedAt: "Apr 5, 2026", addressedAt: null, resolvedByClient: false, resolvedAt: null },
  { id: "chr-8", clientId: "5", clientName: "Alex Rivera", category: "Hiring & Team Building", customDescription: null, context: "Need to make first hire but don't know how to evaluate candidates.", coachStatus: "addressed", coachNote: "Sent hiring framework. Review in next session.", flaggedAt: "Apr 2, 2026", addressedAt: "Apr 4, 2026", resolvedByClient: false, resolvedAt: null },
  { id: "chr-9", clientId: "4", clientName: "Priya Patel", category: "Marketing & Brand", customDescription: null, context: "No idea where to start with marketing.", coachStatus: "seen", coachNote: null, flaggedAt: "Apr 7, 2026", addressedAt: null, resolvedByClient: false, resolvedAt: null },
  { id: "chr-10", clientId: "4", clientName: "Priya Patel", category: "Revenue & Pricing", customDescription: null, context: "Undercharging for services but afraid to raise prices.", coachStatus: "seen", coachNote: null, flaggedAt: "Apr 7, 2026", addressedAt: null, resolvedByClient: false, resolvedAt: null },
];

// Reset Session data
export interface ResetSession {
  id: string;
  sessionDate: string;
  month: string;
  enrolledClients: string[];
  sessionNotes: string | null;
  sessionRecap: string | null;
  completed: boolean;
  recordingUrl: string | null;
  recordingUploadedAt: string | null;
  recordingSentAt: string | null;
}

export interface ResetSessionEngagement {
  id: string;
  sessionId: string;
  clientId: string;
  clientName: string;
  recordingWatched: boolean;
  watchedAt: string | null;
  commitmentSubmitted: boolean;
  commitmentText: string | null;
  commitmentSubmittedAt: string | null;
  coachAcknowledged: boolean;
}

export const resetSessions: ResetSession[] = [
  {
    id: "rs-1",
    sessionDate: "Apr 25, 2026 at 7:00 PM EST",
    month: "April 2026",
    enrolledClients: ["1", "4"],
    sessionNotes: "Themes: avoidance patterns, scope creep, overcommitting.",
    sessionRecap: null,
    completed: false,
    recordingUrl: null,
    recordingUploadedAt: null,
    recordingSentAt: null,
  },
  {
    id: "rs-0",
    sessionDate: "Mar 28, 2026 at 7:00 PM EST",
    month: "March 2026",
    enrolledClients: ["1", "5"],
    sessionNotes: "Focus on follow-through vs. starting new things.",
    sessionRecap: "We covered three core patterns: over-promising scope, avoiding hard conversations, and using busyness as a shield. Each participant identified their own version of one of these. Commitments were set.",
    completed: true,
    recordingUrl: "https://www.loom.com/share/example-reset-march",
    recordingUploadedAt: "Mar 29, 2026",
    recordingSentAt: "Mar 29, 2026",
  },
];

export const resetSessionEngagements: ResetSessionEngagement[] = [
  { id: "rse-1", sessionId: "rs-0", clientId: "1", clientName: "Marcus Chen", recordingWatched: true, watchedAt: "Mar 30, 2026", commitmentSubmitted: true, commitmentText: "I will say no to at least 2 scope requests this month.", commitmentSubmittedAt: "Mar 30, 2026", coachAcknowledged: true },
  { id: "rse-2", sessionId: "rs-0", clientId: "5", clientName: "Alex Rivera", recordingWatched: true, watchedAt: "Mar 31, 2026", commitmentSubmitted: false, commitmentText: null, commitmentSubmittedAt: null, coachAcknowledged: false },
];

export const clientResetSession = {
  enrolled: true,
  sessionDate: "Apr 25, 2026 at 7:00 PM EST",
  month: "April 2026",
  sessionRecap: null as string | null,
  completed: false,
  reflection: null as string | null,
  commitment: null as string | null,
  recordingUrl: null as string | null,
  recordingSentAt: null as string | null,
  recordingWatched: false,
};

// ========== GAMIFICATION & COMMUNITY ==========

export interface ClientPoints {
  clientId: string;
  totalPoints: number;
  monthlyPoints: number;
  currentLevel: number;
  levelName: string;
  nextLevelPoints: number;
  streak: number;
}

export const levels = [
  { level: 1, name: "In The Mirror", minPoints: 0, maxPoints: 199, description: "You showed up. That's the first step." },
  { level: 2, name: "Getting Honest", minPoints: 200, maxPoints: 499, description: "You're starting to see yourself clearly." },
  { level: 3, name: "No Excuses", minPoints: 500, maxPoints: 999, description: "You've stopped negotiating with yourself." },
  { level: 4, name: "Pattern Breaker", minPoints: 1000, maxPoints: 1999, description: "You're rewriting old scripts." },
  { level: 5, name: "Committed", minPoints: 2000, maxPoints: 3999, description: "Your consistency speaks for itself." },
  { level: 6, name: "Terrible", minPoints: 4000, maxPoints: Infinity, description: "You've earned the name." },
];

export const clientPoints: ClientPoints = {
  clientId: "1",
  totalPoints: 1245,
  monthlyPoints: 185,
  currentLevel: 4,
  levelName: "Pattern Breaker",
  nextLevelPoints: 2000,
  streak: 6,
};

export interface Achievement {
  id: string;
  badgeName: string;
  earnedAt: string;
  description: string;
}

export const clientAchievements: Achievement[] = [
  { id: "a1", badgeName: "First Goal Approved", earnedAt: "Feb 1, 2026", description: "Had your first goal approved by your coach." },
  { id: "a2", badgeName: "First Goal Verified", earnedAt: "Feb 28, 2026", description: "Completed and verified your first goal." },
  { id: "a3", badgeName: "4 Week Streak", earnedAt: "Mar 1, 2026", description: "4 consecutive weekly check-ins." },
  { id: "a4", badgeName: "Perfect Month", earnedAt: "Mar 31, 2026", description: "Hit every goal in a calendar month." },
  { id: "a5", badgeName: "Reset Rebound", earnedAt: "Apr 5, 2026", description: "Missed a goal then hit all goals the following month." },
];

export const pointsBreakdown = [
  { reason: "Weekly check-in completed", points: 10 },
  { reason: "Goal approved", points: 5 },
  { reason: "Goal proof submitted", points: 10 },
  { reason: "Goal verified complete", points: 25 },
  { reason: "Perfect Month bonus", points: 100 },
  { reason: "Help Radar item logged", points: 5 },
  { reason: "Reset Session commitment", points: 15 },
  { reason: "Reset Session recording watched", points: 10 },
  { reason: "4-week streak milestone", points: 25 },
  { reason: "8-week streak milestone", points: 50 },
  { reason: "12-week streak milestone", points: 100 },
];

export interface CommunityPost {
  id: string;
  clientId: string;
  clientName: string;
  level: number;
  levelName: string;
  points: number;
  content: string;
  postType: "post" | "win" | "question" | "reflection" | "system";
  likesCount: number;
  liked: boolean;
  createdAt: string;
  replies: CommunityReply[];
}

export interface CommunityReply {
  id: string;
  clientName: string;
  level: number;
  content: string;
  createdAt: string;
}

export const communityPosts: CommunityPost[] = [
  {
    id: "cp-1",
    clientId: "system",
    clientName: "System",
    level: 0,
    levelName: "",
    points: 0,
    content: "Someone just had a Perfect Month. Every goal. Verified. Done. 🔥",
    postType: "system",
    likesCount: 12,
    liked: false,
    createdAt: "Apr 9, 2026",
    replies: [],
  },
  {
    id: "cp-2",
    clientId: "3",
    clientName: "James",
    level: 5,
    levelName: "Committed",
    points: 2450,
    content: "Just closed my biggest deal ever. 6 months of follow-up, 3 rejections, and one coach note that said 'stop being polite and start being direct.' That note changed everything.",
    postType: "win",
    likesCount: 8,
    liked: true,
    createdAt: "Apr 8, 2026",
    replies: [
      { id: "cr-1", clientName: "Marcus", level: 4, content: "This is the energy. Congrats.", createdAt: "Apr 8, 2026" },
      { id: "cr-2", clientName: "Priya", level: 2, content: "Needed to see this today. Thank you.", createdAt: "Apr 8, 2026" },
    ],
  },
  {
    id: "cp-3",
    clientId: "1",
    clientName: "Marcus",
    level: 4,
    levelName: "Pattern Breaker",
    points: 1245,
    content: "Question for the group: how do you handle weeks where your energy score drops but you still need to hit a deadline? Do you push through or adjust?",
    postType: "question",
    likesCount: 5,
    liked: false,
    createdAt: "Apr 7, 2026",
    replies: [
      { id: "cr-3", clientName: "Alex", level: 3, content: "I used to push through every time. Now I adjust scope, not timeline. Different results.", createdAt: "Apr 7, 2026" },
    ],
  },
  {
    id: "cp-4",
    clientId: "system",
    clientName: "System",
    level: 0,
    levelName: "",
    points: 0,
    content: "Someone just hit a 12-week check-in streak. 🔥",
    postType: "system",
    likesCount: 15,
    liked: false,
    createdAt: "Apr 6, 2026",
    replies: [],
  },
  {
    id: "cp-5",
    clientId: "5",
    clientName: "Alex",
    level: 3,
    levelName: "No Excuses",
    points: 780,
    content: "Reset Session insight: I realized I'm not afraid of failure — I'm afraid of being seen failing. Different problem, different solution. Working on it.",
    postType: "reflection",
    likesCount: 11,
    liked: true,
    createdAt: "Apr 4, 2026",
    replies: [],
  },
  {
    id: "cp-6",
    clientId: "2",
    clientName: "Sarah",
    level: 2,
    levelName: "Getting Honest",
    points: 320,
    content: "Found this podcast on decision fatigue that changed how I structure my mornings. Happy to share if anyone wants the link.",
    postType: "post",
    likesCount: 4,
    liked: false,
    createdAt: "Apr 3, 2026",
    replies: [
      { id: "cr-4", clientName: "James", level: 5, content: "Please share. Always looking for new frameworks.", createdAt: "Apr 3, 2026" },
    ],
  },
];

export interface Team {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  maxMembers: number;
  isOpen: boolean;
  isMember: boolean;
  members: TeamMember[];
  challenge?: TeamChallenge;
}

export interface TeamMember {
  id: string;
  name: string;
  level: number;
  levelName: string;
  points: number;
  streak: number;
  activeGoals: number;
  badges: string[];
}

export interface TeamChallenge {
  id: string;
  description: string;
  targetMetric: string;
  targetValue: number;
  currentValue: number;
  dueDate: string;
  completed: boolean;
}

export const teams: Team[] = [
  {
    id: "t-1",
    name: "Ship It Squad",
    description: "Entrepreneurs building and launching products. We hold each other to shipping deadlines.",
    category: "Entrepreneurs & Founders",
    memberCount: 5,
    maxMembers: 8,
    isOpen: true,
    isMember: true,
    members: [
      { id: "1", name: "Marcus", level: 4, levelName: "Pattern Breaker", points: 1245, streak: 6, activeGoals: 3, badges: ["First Goal Verified", "4 Week Streak", "Reset Rebound"] },
      { id: "3", name: "James", level: 5, levelName: "Committed", points: 2450, streak: 12, activeGoals: 2, badges: ["Perfect Month", "12 Week Streak", "No Mercy"] },
      { id: "5", name: "Alex", level: 3, levelName: "No Excuses", points: 780, streak: 4, activeGoals: 2, badges: ["First Goal Approved", "4 Week Streak"] },
      { id: "6", name: "David", level: 2, levelName: "Getting Honest", points: 310, streak: 3, activeGoals: 3, badges: ["First Goal Approved"] },
      { id: "7", name: "Tom", level: 1, levelName: "In The Mirror", points: 85, streak: 2, activeGoals: 1, badges: [] },
    ],
    challenge: {
      id: "tc-1",
      description: "100% check-in completion this month",
      targetMetric: "check_ins",
      targetValue: 20,
      currentValue: 14,
      dueDate: "Apr 30, 2026",
      completed: false,
    },
  },
  {
    id: "t-2",
    name: "Habit Hackers",
    description: "Focused on building and maintaining daily habits. Health, routines, and discipline.",
    category: "Health & Habits",
    memberCount: 6,
    maxMembers: 8,
    isOpen: true,
    isMember: false,
    members: [
      { id: "2", name: "Sarah", level: 2, levelName: "Getting Honest", points: 320, streak: 3, activeGoals: 2, badges: ["First Goal Approved"] },
      { id: "4", name: "Priya", level: 2, levelName: "Getting Honest", points: 210, streak: 1, activeGoals: 2, badges: [] },
      { id: "8", name: "Jordan", level: 3, levelName: "No Excuses", points: 650, streak: 5, activeGoals: 3, badges: ["4 Week Streak"] },
      { id: "9", name: "Casey", level: 4, levelName: "Pattern Breaker", points: 1100, streak: 8, activeGoals: 2, badges: ["Perfect Month", "8 Week Streak"] },
      { id: "10", name: "Riley", level: 1, levelName: "In The Mirror", points: 120, streak: 2, activeGoals: 1, badges: [] },
      { id: "11", name: "Morgan", level: 3, levelName: "No Excuses", points: 540, streak: 4, activeGoals: 2, badges: ["First Goal Verified"] },
    ],
    challenge: undefined,
  },
  {
    id: "t-3",
    name: "Revenue Runners",
    description: "Sales-focused group. Pipeline, closing, and revenue growth accountability.",
    category: "Sales & Revenue",
    memberCount: 4,
    maxMembers: 8,
    isOpen: true,
    isMember: false,
    members: [],
    challenge: undefined,
  },
  {
    id: "t-4",
    name: "Parent Mode",
    description: "Parents figuring out how to show up for their families and themselves.",
    category: "Parents & Family",
    memberCount: 3,
    maxMembers: 6,
    isOpen: true,
    isMember: false,
    members: [],
    challenge: undefined,
  },
];

export interface LeaderboardEntry {
  rank: number;
  clientName: string;
  level: number;
  levelName: string;
  monthlyPoints: number;
  streak: number;
}

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, clientName: "James", level: 5, levelName: "Committed", monthlyPoints: 285, streak: 12 },
  { rank: 2, clientName: "Casey", level: 4, levelName: "Pattern Breaker", monthlyPoints: 220, streak: 8 },
  { rank: 3, clientName: "Marcus", level: 4, levelName: "Pattern Breaker", monthlyPoints: 185, streak: 6 },
  { rank: 4, clientName: "Jordan", level: 3, levelName: "No Excuses", monthlyPoints: 160, streak: 5 },
  { rank: 5, clientName: "Alex", level: 3, levelName: "No Excuses", monthlyPoints: 145, streak: 4 },
  { rank: 6, clientName: "Morgan", level: 3, levelName: "No Excuses", monthlyPoints: 130, streak: 4 },
  { rank: 7, clientName: "Sarah", level: 2, levelName: "Getting Honest", monthlyPoints: 110, streak: 3 },
  { rank: 8, clientName: "David", level: 2, levelName: "Getting Honest", monthlyPoints: 95, streak: 3 },
  { rank: 9, clientName: "Priya", level: 2, levelName: "Getting Honest", monthlyPoints: 75, streak: 1 },
  { rank: 10, clientName: "Tom", level: 1, levelName: "In The Mirror", monthlyPoints: 45, streak: 2 },
];
