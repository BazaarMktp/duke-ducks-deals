import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertTriangle, Sparkles, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Semester end dates - these could be fetched from a config or database
const SEMESTER_DATES = {
  spring2025: new Date('2025-05-10T23:59:59'),
  fall2025: new Date('2025-12-15T23:59:59'),
  spring2026: new Date('2026-05-10T23:59:59'),
};

const getNextSemesterEnd = (): { name: string; date: Date } => {
  const now = new Date();
  
  if (now < SEMESTER_DATES.spring2025) {
    return { name: "Spring 2025", date: SEMESTER_DATES.spring2025 };
  } else if (now < SEMESTER_DATES.fall2025) {
    return { name: "Fall 2025", date: SEMESTER_DATES.fall2025 };
  } else {
    return { name: "Spring 2026", date: SEMESTER_DATES.spring2026 };
  }
};

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const SemesterCountdown = () => {
  const [countdown, setCountdown] = useState<CountdownState>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [semester, setSemester] = useState(getNextSemesterEnd());
  const navigate = useNavigate();

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = semester.date.getTime();
      const difference = target - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [semester.date]);

  const isUrgent = countdown.days < 14; // Less than 2 weeks
  const isCritical = countdown.days < 7; // Less than 1 week

  const getUrgencyMessage = () => {
    if (isCritical) {
      return "🚨 Last chance to sell before break!";
    } else if (isUrgent) {
      return "⏰ Time's running out - list your items now!";
    } else if (countdown.days < 30) {
      return "📦 Start decluttering - semester ends soon!";
    }
    return "Get ahead - list items early for best prices!";
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${
      isCritical 
        ? 'border-destructive bg-destructive/5 shadow-lg shadow-destructive/20' 
        : isUrgent 
          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' 
          : 'border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5'
    }`}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Countdown Timer */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              isCritical ? 'bg-destructive/20' : isUrgent ? 'bg-orange-500/20' : 'bg-primary/20'
            }`}>
              {isCritical ? (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              ) : (
                <Calendar className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                {semester.name} ends in
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TimeBlock value={countdown.days} label="days" highlight={isCritical} />
                <span className="text-muted-foreground">:</span>
                <TimeBlock value={countdown.hours} label="hrs" highlight={isCritical} />
                <span className="text-muted-foreground">:</span>
                <TimeBlock value={countdown.minutes} label="min" highlight={isCritical} />
              </div>
            </div>
          </div>

          {/* Message & CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className={`text-sm font-medium text-center sm:text-right ${
              isCritical ? 'text-destructive' : isUrgent ? 'text-orange-600 dark:text-orange-400' : 'text-foreground'
            }`}>
              {getUrgencyMessage()}
            </p>
            <Button 
              size="sm"
              onClick={() => navigate('/my-listings?bulk=true')}
              className={`gap-2 ${
                isCritical 
                  ? 'bg-destructive hover:bg-destructive/90' 
                  : isUrgent 
                    ? 'bg-orange-500 hover:bg-orange-600' 
                    : ''
              }`}
            >
              <Package className="h-4 w-4" />
              Quick List
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TimeBlock = ({ value, label, highlight }: { value: number; label: string; highlight: boolean }) => (
  <div className={`text-center px-2 py-1 rounded ${
    highlight ? 'bg-destructive/20' : 'bg-background'
  }`}>
    <span className={`text-lg font-bold tabular-nums ${
      highlight ? 'text-destructive' : 'text-foreground'
    }`}>
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-[10px] text-muted-foreground block -mt-1">{label}</span>
  </div>
);

export default SemesterCountdown;
