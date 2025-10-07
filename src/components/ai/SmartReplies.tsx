import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SmartRepliesProps {
  lastMessage: string;
  listingTitle: string;
  onSelectReply: (reply: string) => void;
}

export const SmartReplies = ({ lastMessage, listingTitle, onSelectReply }: SmartRepliesProps) => {
  const [replies, setReplies] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  
  const getSmartReplies = async (lastMessage: string, listingTitle: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('smart-messaging', {
        body: { type: 'suggest_reply', context: { lastMessage, listingTitle } }
      });

      if (error) throw error;
      return JSON.parse(data.result);
    } catch (error) {
      console.error('Smart replies error:', error);
      return [];
    }
  };

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
