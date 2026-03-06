import { Shield, X } from 'lucide-react';
import { useState } from 'react';

const SafetyBanner = () => {
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('chat-safety-dismissed') === 'true';
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('chat-safety-dismissed', 'true');
  };

  return (
    <div className="mx-4 mt-3 mb-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
      <Shield size={14} className="text-primary flex-shrink-0" />
      <p className="flex-1">
        <span className="font-medium text-foreground">Stay safe:</span> Meet in a public place on campus. Never share personal financial info.
      </p>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-0.5 rounded hover:bg-muted transition-colors"
        aria-label="Dismiss safety tip"
      >
        <X size={12} />
      </button>
    </div>
  );
};

export default SafetyBanner;
