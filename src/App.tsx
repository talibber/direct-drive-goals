import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import PricingPage from "./pages/PricingPage";
import ApplyPage from "./pages/ApplyPage";
import LoginPage from "./pages/LoginPage";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
          <Route path="/login" element={<LoginPage />} />

          {/* Client */}
          <Route path="/dashboard" element={<ClientDashboard />} />
          <Route path="/dashboard/check-in" element={<WeeklyCheckInPage />} />
          <Route path="/dashboard/goals" element={<GoalsPage />} />
          <Route path="/dashboard/billing" element={<BillingPage />} />
          <Route path="/dashboard/sessions" element={<SessionsPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/dashboard/reset-session" element={<ResetSessionPage />} />
          <Route path="/dashboard/help-radar" element={<HelpRadarPage />} />
          <Route path="/dashboard/community" element={<CommunityPage />} />
          <Route path="/dashboard/messages" element={<ClientMessagesPage />} />
          <Route path="/dashboard/library" element={<LibraryPage />} />
          <Route path="/onboarding/assessment" element={<OnboardingAssessmentPage />} />

          {/* Coach */}
          <Route path="/coach" element={<CoachDashboard />} />
          <Route path="/coach/clients" element={<CoachClientsPage />} />
          <Route path="/coach/messages" element={<CoachMessagesPage />} />
          <Route path="/coach/applications" element={<CoachApplicationsPage />} />
          <Route path="/coach/metrics" element={<CoachMetricsPage />} />
          <Route path="/coach/clients/:clientId" element={<CoachClientDetailPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
