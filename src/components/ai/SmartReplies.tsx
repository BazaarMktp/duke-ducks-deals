import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useGeminiAI } from '@/hooks/useGeminiAI';

interface SmartRepliesProps {
  lastMessage: string;
  listingTitle: string;
  onSelectReply: (reply: string) => void;
}

export const SmartReplies = ({ lastMessage, listingTitle, onSelectReply }: SmartRepliesProps) => {
  const [replies, setReplies] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { getSmartReplies } = useGeminiAI();

  useEffect(() => {
    if (lastMessage && listingTitle) {
      loadReplies();
    }
  }, [lastMessage]);

  const loadReplies = async () => {
    const suggestions = await getSmartReplies(lastMessage, listingTitle);
    if (suggestions && suggestions.length > 0) {
      setReplies(suggestions);
      setIsVisible(true);
    }
  };

  if (!isVisible || replies.length === 0) return null;

  return (
    <div className="space-y-2 mb-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3 w-3" />
        <span>AI suggested replies:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {replies.map((reply, i) => (
          <Button
            key={i}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onSelectReply(reply);
              setIsVisible(false);
            }}
            className="text-xs h-auto py-2"
          >
            {reply}
          </Button>
        ))}
      </div>
    </div>
  );
};
