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
  { id: "2", goalTitle: "Daily journaling for 30 days", dueDate: "Mar 31", selfAssessment: "not_completed" as const, coachDecision: "missed" as const, coachNote: "Only 12 of 30 days completed. Pattern Call scheduled.", decidedAt: "Apr 1, 2026", stakeCharged: true, clientName: "Marcus Chen" },
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
