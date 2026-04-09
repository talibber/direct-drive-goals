import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Trophy, Calendar, Send } from "lucide-react";
import { toast } from "sonner";
import type { PerfectMonthAlert } from "@/lib/mockData";

interface PerfectMonthSchedulePanelProps {
  alert: PerfectMonthAlert | null;
  open: boolean;
  onClose: () => void;
  onSchedule: (alertId: string, data: { scheduledAt: string; title: string; notes: string }) => void;
}

export function PerfectMonthSchedulePanel({ alert, open, onClose, onSchedule }: PerfectMonthSchedulePanelProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [notes, setNotes] = useState("");

  if (!alert) return null;

  const defaultTitle = `Next Level Call — ${alert.clientName} — ${alert.month}`;

  const handleSchedule = () => {
    if (!date) {
      toast.error("Please select a date for the call");
      return;
    }
    onSchedule(alert.id, {
      scheduledAt: `${date}T${time}`,
      title: defaultTitle,
      notes,
    });
    toast.success(`Next Level Call scheduled with ${alert.clientName}. Client notified.`);
    resetAndClose();
  };

  const resetAndClose = () => {
    setDate("");
    setTime("10:00");
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetAndClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Trophy size={20} className="text-primary" /> Schedule Next Level Call
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="rounded-lg bg-gradient-gold p-4">
            <p className="text-sm font-semibold text-primary-foreground">
              {alert.clientName} completed all goals in {alert.month}
            </p>
            <p className="text-xs text-primary-foreground/80 mt-1">
              Time to discuss bigger targets and next-level challenges.
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">Call Title</Label>
            <Input value={defaultTitle} readOnly className="mt-1.5 bg-secondary/30" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium">Date *</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1.5"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Talking Points (optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Context or topics to cover during the Next Level Call..."
              className="mt-1.5"
              rows={3}
            />
          </div>

          <Button onClick={handleSchedule} variant="hero" className="w-full">
            <Send size={16} /> Schedule & Notify Client
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
