import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Profile</h1>
      <p className="text-muted-foreground mb-8">Your account settings.</p>

      <div className="max-w-lg rounded-lg border border-border bg-card p-6 shadow-card space-y-5">
        <div>
          <Label>Full Name</Label>
          <Input defaultValue="Marcus Chen" className="mt-1.5" />
        </div>
        <div>
          <Label>Email</Label>
          <Input defaultValue="marcus@example.com" className="mt-1.5" disabled />
        </div>
        <div>
          <Label>Occupation</Label>
          <Input defaultValue="Startup Founder" className="mt-1.5" />
        </div>
        <div>
          <Label>Coaching Type</Label>
          <Input defaultValue="Business Coaching" className="mt-1.5" disabled />
        </div>
        <Button variant="hero">Save Changes</Button>
      </div>
    </DashboardLayout>
  );
}
