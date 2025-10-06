import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, TrendingUp } from 'lucide-react';
import { useGeminiAI } from '@/hooks/useGeminiAI';

interface PriceSuggestionProps {
  title: string;
  category: string;
  condition: string;
  description: string;
  onPriceSelect: (price: number) => void;
}

export const PriceSuggestion = ({
  title,
  category,
  condition,
  description,
  onPriceSelect
}: PriceSuggestionProps) => {
  const [suggestion, setSuggestion] = useState<any>(null);
  const { getPriceSuggestion, loading } = useGeminiAI();

  const handleGetSuggestion = async () => {
    const result = await getPriceSuggestion(title, category, condition, description);
    if (result) {
      setSuggestion(result);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        onClick={handleGetSuggestion}
        disabled={loading || !title}
        className="w-full"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {loading ? 'Analyzing...' : 'Get AI Price Suggestion'}
      </Button>

      {suggestion && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold mb-2">AI Price Analysis</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {suggestion.justification}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => onPriceSelect(suggestion.quick)}
                className="p-3 rounded-lg border bg-background hover:bg-accent transition-colors text-left"
              >
                <div className="text-xs text-muted-foreground mb-1">Quick Sale</div>
                <div className="font-semibold text-lg">${suggestion.quick}</div>
              </button>
              <button
                type="button"
                onClick={() => onPriceSelect(suggestion.fair)}
                className="p-3 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors text-left"
              >
                <div className="text-xs text-muted-foreground mb-1">Recommended</div>
                <div className="font-semibold text-lg text-primary">${suggestion.fair}</div>
              </button>
              <button
                type="button"
                onClick={() => onPriceSelect(suggestion.premium)}
                className="p-3 rounded-lg border bg-background hover:bg-accent transition-colors text-left"
              >
                <div className="text-xs text-muted-foreground mb-1">Premium</div>
                <div className="font-semibold text-lg">${suggestion.premium}</div>
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
