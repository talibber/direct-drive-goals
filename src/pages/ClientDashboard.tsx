import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRealClient } from "@/hooks/useRealClient";
import { RealClientDashboard } from "@/components/RealClientDashboard";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function ClientDashboard() {
  const { profile, loading, isReal } = useRealClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !profile) navigate("/login", { replace: true });
  }, [loading, profile, navigate]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-sm text-muted-foreground">Loading your dashboard…</div>
      </DashboardLayout>
    );
  }

  if (isReal && profile) {
    return <RealClientDashboard profile={profile} />;
  }

  // Authenticated but profile not yet provisioned as a real client.
  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto p-10 text-center">
        <h1 className="font-display text-2xl font-bold mb-3">Almost there</h1>
        <p className="text-muted-foreground">
          Your account is being set up. A coach will activate your dashboard once your onboarding is complete.
        </p>
      </div>
    </DashboardLayout>
  );
}
