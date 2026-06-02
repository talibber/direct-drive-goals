import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedClientRoute } from "@/components/ProtectedClientRoute";
import { ProtectedCoachRoute } from "@/components/ProtectedCoachRoute";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import PricingPage from "./pages/PricingPage";
import ApplyPage from "./pages/ApplyPage";
import TrackSelectionPage from "./pages/TrackSelectionPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import OnboardingPendingPage from "./pages/OnboardingPendingPage";
import LegalAcceptancePage from "./pages/LegalAcceptancePage";
import AdminDiagnosticsPage from "./pages/AdminDiagnosticsPage";
import ClientDashboard from "./pages/ClientDashboard";
import WeeklyCheckInPage from "./pages/WeeklyCheckInPage";
import GoalsPage from "./pages/GoalsPage";
import BillingPage from "./pages/BillingPage";
import SessionsPage from "./pages/SessionsPage";
import ProfilePage from "./pages/ProfilePage";
import ResetSessionPage from "./pages/ResetSessionPage";
import HelpRadarPage from "./pages/HelpRadarPage";
import CommunityPage from "./pages/CommunityPage";
import CoachDashboard from "./pages/CoachDashboard";
import CoachClientsPage from "./pages/CoachClientsPage";
import CoachApplicationsPage from "./pages/CoachApplicationsPage";
import CoachMetricsPage from "./pages/CoachMetricsPage";
import CoachClientDetailPage from "./pages/CoachClientDetailPage";
import CoachMessagesPage from "./pages/CoachMessagesPage";
import ClientMessagesPage from "./pages/ClientMessagesPage";
import OnboardingAssessmentPage from "./pages/OnboardingAssessmentPage";
import LibraryPage from "./pages/LibraryPage";
import OperatorCallPage from "./pages/OperatorCallPage";
import CoachOperatorCallPage from "./pages/CoachOperatorCallPage";
import DirectAccessPage from "./pages/DirectAccessPage";
import CoachDirectAccessPage from "./pages/CoachDirectAccessPage";
import AchievementGroupPage from "./pages/AchievementGroupPage";
import CoachAchievementGroupPage from "./pages/CoachAchievementGroupPage";
import CoachWeeklyQAPage from "./pages/CoachWeeklyQAPage";
import CoachBreachesPage from "./pages/CoachBreachesPage";
import CoachReviewQueuePage from "./pages/CoachReviewQueuePage";
import CoachActionQueuePage from "./pages/CoachActionQueuePage";
import CoachTeamSettingsPage from "./pages/CoachTeamSettingsPage";
import CoachStyleLearningPage from "./pages/CoachStyleLearningPage";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const client = (el: JSX.Element) => <ProtectedClientRoute>{el}</ProtectedClientRoute>;
const coach = (el: JSX.Element) => <ProtectedCoachRoute>{el}</ProtectedCoachRoute>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/apply/select" element={<TrackSelectionPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/onboarding/pending" element={<OnboardingPendingPage />} />
          <Route path="/onboarding/legal" element={<LegalAcceptancePage />} />
          <Route path="/admin/diagnostics" element={<AdminDiagnosticsPage />} />
          <Route path="/legal/:slug" element={<LegalPage />} />

          {/* Client (gated) */}
          <Route path="/dashboard" element={client(<ClientDashboard />)} />
          <Route path="/dashboard/check-in" element={client(<WeeklyCheckInPage />)} />
          <Route path="/dashboard/goals" element={client(<GoalsPage />)} />
          <Route path="/dashboard/billing" element={client(<BillingPage />)} />
          <Route path="/dashboard/sessions" element={client(<SessionsPage />)} />
          <Route path="/dashboard/profile" element={client(<ProfilePage />)} />
          <Route path="/dashboard/reset-session" element={client(<ResetSessionPage />)} />
          <Route path="/dashboard/help-radar" element={client(<HelpRadarPage />)} />
          <Route path="/dashboard/community" element={client(<CommunityPage />)} />
          <Route path="/dashboard/messages" element={client(<ClientMessagesPage />)} />
          <Route path="/dashboard/library" element={client(<LibraryPage />)} />
          <Route path="/dashboard/operator-call" element={client(<OperatorCallPage />)} />
          <Route path="/dashboard/direct-access" element={client(<DirectAccessPage />)} />
          <Route path="/dashboard/achievement-group" element={client(<AchievementGroupPage />)} />
          <Route path="/onboarding/assessment" element={client(<OnboardingAssessmentPage />)} />

          {/* Coach (gated) */}
          <Route path="/coach" element={coach(<CoachDashboard />)} />
          <Route path="/coach/clients" element={coach(<CoachClientsPage />)} />
          <Route path="/coach/messages" element={coach(<CoachMessagesPage />)} />
          <Route path="/coach/applications" element={coach(<CoachApplicationsPage />)} />
          <Route path="/coach/metrics" element={coach(<CoachMetricsPage />)} />
          <Route path="/coach/operator-call" element={coach(<CoachOperatorCallPage />)} />
          <Route path="/coach/direct-access" element={coach(<CoachDirectAccessPage />)} />
          <Route path="/coach/achievement-group" element={coach(<CoachAchievementGroupPage />)} />
          <Route path="/coach/clients/:clientId" element={coach(<CoachClientDetailPage />)} />
          <Route path="/coach/weekly-qa" element={coach(<CoachWeeklyQAPage />)} />
          <Route path="/coach/breaches" element={coach(<CoachBreachesPage />)} />
          <Route path="/coach/review-queue" element={coach(<CoachReviewQueuePage />)} />
          <Route path="/coach/action-queue" element={coach(<CoachActionQueuePage />)} />
          <Route path="/coach/team-settings" element={coach(<CoachTeamSettingsPage />)} />
          <Route path="/coach/style-learning" element={coach(<CoachStyleLearningPage />)} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
