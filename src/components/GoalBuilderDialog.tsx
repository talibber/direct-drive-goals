import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface GoalBuilderDialogProps {
  onSubmit: (goal: GoalFormData) => void;
  editGoal?: GoalFormData & { id: string };
}

export interface GoalFormData {
  title: string;
  description: string;
  category: string;
  metricType: string;
  targetValue: string;
  target: string;
  proofRequirement: string;
  dueDate: string;
}

export function GoalBuilderDialog({ onSubmit, editGoal }: GoalBuilderDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<GoalFormData>({
    title: editGoal?.title ?? "",
    description: editGoal?.description ?? "",
    category: editGoal?.category ?? "Business",
    metricType: editGoal?.metricType ?? "count",
    targetValue: editGoal?.targetValue ?? "",
    target: editGoal?.target ?? "",
    proofRequirement: editGoal?.proofRequirement ?? "",
    dueDate: editGoal?.dueDate ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.target || !form.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSubmit(form);
    setOpen(false);
    toast.success(editGoal ? "Goal resubmitted for review" : "Goal submitted for coach approval");
    if (!editGoal) {
      setForm({ title: "", description: "", category: "Business", metricType: "count", targetValue: "", target: "", proofRequirement: "", dueDate: "" });
    }
  };

  const update = (field: keyof GoalFormData, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editGoal ? (
          <button className="mt-3 w-full text-sm font-medium text-primary hover:text-primary/80 border border-primary/30 rounded-md py-1.5 transition-colors">
            Revise & Resubmit
          </button>
        ) : (
          <Button variant="hero" size="sm"><Plus size={16} /> New Goal</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{editGoal ? "Revise Goal" : "New Goal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label>Goal Title *</Label>
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Close 3 enterprise deals" className="mt-1.5" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe what this goal means to you..." className="mt-1.5" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Life">Life</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Metric Type</Label>
              <Select value={form.metricType} onValueChange={(v) => update("metricType", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">Count</SelectItem>
                  <SelectItem value="yes/no">Yes / No</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Target Value</Label>
              <Input type="number" value={form.targetValue} onChange={(e) => update("targetValue", e.target.value)} placeholder="e.g. 3" className="mt-1.5" />
            </div>
            <div>
              <Label>Due Date *</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => update("dueDate", e.target.value)} className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>Target Description *</Label>
            <Input value={form.target} onChange={(e) => update("target", e.target.value)} placeholder="e.g. 3 signed contracts" className="mt-1.5" />
          </div>
          <div>
            <Label>Proof Requirement</Label>
            <Input value={form.proofRequirement} onChange={(e) => update("proofRequirement", e.target.value)} placeholder="e.g. Screenshot of signed contracts" className="mt-1.5" />
          </div>

          <div className="rounded-md bg-secondary p-3">
            <p className="text-sm font-medium text-foreground mb-1">Commitment Breach Fee: $75</p>
            <p className="text-xs text-muted-foreground">Stake activates only after your coach approves this goal.</p>
          </div>

          <Button type="submit" variant="hero" className="w-full">
            {editGoal ? "Resubmit for Review" : "Submit Goal for Approval"}
          </Button>

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Your goal will be reviewed by your coach before the commitment breach fee becomes active. Goals must be specific, measurable, and genuinely challenging to be approved.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
