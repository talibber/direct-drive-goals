export const weeklyCheckIns = [
  { week: "W1", energy: 7, stress: 5, focus: 8, confidence: 7, sleep: 6, habits: 80, score: 74 },
  { week: "W2", energy: 6, stress: 6, focus: 7, confidence: 6, sleep: 7, habits: 75, score: 69 },
  { week: "W3", energy: 8, stress: 4, focus: 8, confidence: 8, sleep: 7, habits: 90, score: 82 },
  { week: "W4", energy: 7, stress: 5, focus: 9, confidence: 8, sleep: 8, habits: 85, score: 79 },
  { week: "W5", energy: 8, stress: 3, focus: 9, confidence: 9, sleep: 8, habits: 92, score: 86 },
  { week: "W6", energy: 9, stress: 3, focus: 9, confidence: 9, sleep: 9, habits: 95, score: 91 },
];

export const goals = [
  {
    id: "1",
    title: "Close 3 enterprise deals",
    category: "Business",
    target: "3 signed contracts",
    progress: 66,
    status: "on-track" as const,
    dueDate: "Apr 30",
    stake: 75,
    metricType: "count",
    targetValue: 3,
    currentValue: 2,
  },
  {
    id: "2",
    title: "Morning routine 6 days/week",
    category: "Life",
    target: "6 days per week",
    progress: 83,
    status: "on-track" as const,
    dueDate: "Apr 30",
    stake: 75,
    metricType: "count",
    targetValue: 24,
    currentValue: 20,
  },
  {
    id: "3",
    title: "Ship MVP by end of month",
    category: "Business",
    target: "Deployed product",
    progress: 40,
    status: "at-risk" as const,
    dueDate: "Apr 30",
    stake: 75,
    metricType: "yes/no",
    targetValue: 1,
    currentValue: 0,
  },
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
  { id: "1", name: "Marcus Chen", email: "marcus@example.com", type: "Business", status: "active", score: 86, missedGoals: 1, lastCheckIn: "2 days ago", risk: false },
  { id: "2", name: "Sarah Kim", email: "sarah@example.com", type: "Life", status: "active", score: 72, missedGoals: 0, lastCheckIn: "5 days ago", risk: true },
  { id: "3", name: "James Wright", email: "james@example.com", type: "Business", status: "active", score: 91, missedGoals: 0, lastCheckIn: "1 day ago", risk: false },
  { id: "4", name: "Priya Patel", email: "priya@example.com", type: "Life", status: "active", score: 65, missedGoals: 2, lastCheckIn: "8 days ago", risk: true },
  { id: "5", name: "Alex Rivera", email: "alex@example.com", type: "Business", status: "active", score: 78, missedGoals: 1, lastCheckIn: "3 days ago", risk: false },
];

export const applications = [
  { id: "1", name: "David Park", email: "david@example.com", type: "Business", occupation: "Startup Founder", challenge: "Scaling from $1M to $5M ARR", submitted: "Apr 8", status: "pending" },
  { id: "2", name: "Emily Foster", email: "emily@example.com", type: "Life", occupation: "VP of Engineering", challenge: "Work-life balance and burnout", submitted: "Apr 7", status: "pending" },
  { id: "3", name: "Tom Nguyen", email: "tom@example.com", type: "Business", occupation: "Solo Founder", challenge: "Decision paralysis on product direction", submitted: "Apr 5", status: "approved" },
];
