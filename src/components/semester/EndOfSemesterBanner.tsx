import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Package, Sparkles, TrendingUp } from "lucide-react";
import { BulkListingWizard } from "./BulkListingWizard";

interface EndOfSemesterBannerProps {
  onDismiss?: () => void;
}

export const EndOfSemesterBanner = ({ onDismiss }: EndOfSemesterBannerProps) => {
  const [dismissed, setDismissed] = useState(false);
  const [showBulkWizard, setShowBulkWizard] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary/90 to-accent p-4 sm:p-6 text-primary-foreground">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white" />
          <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-white" />
        </div>

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                  End of Semester Sale
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-1">
                Dorm Cleanout Mode is Here! 🎓
              </h3>
              <p className="text-sm opacity-90 max-w-md">
                List multiple items at once and sell everything before you leave campus. 
                Students are actively buying right now!
              </p>
              
              {/* Stats */}
              <div className="flex items-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>3x more buyers this week</span>
                </div>
                <div className="hidden sm:block">•</div>
                <div className="hidden sm:block">Avg. sell time: 2 days</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              onClick={() => setShowBulkWizard(true)}
              variant="secondary"
              className="flex-1 sm:flex-none gap-2 bg-white text-primary hover:bg-white/90"
            >
              <Package className="h-4 w-4" />
              Start Bulk Listing
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="shrink-0 hover:bg-white/20 text-primary-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {showBulkWizard && (
        <BulkListingWizard 
          onClose={() => setShowBulkWizard(false)}
          onSuccess={() => setShowBulkWizard(false)}
        />
      )}
    </>
  );
};

export default EndOfSemesterBanner;
