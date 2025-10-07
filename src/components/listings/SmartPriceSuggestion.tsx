import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SmartPriceSuggestionProps {
  title: string;
  category: string;
  condition: string;
  description: string;
  onPriceSelect: (price: number, indicator: 'low' | 'fair' | 'high') => void;
}

interface PriceData {
  min: number;
  max: number;
  recommended: number;
  justification: string;
}

export const SmartPriceSuggestion = ({
  title,
  category,
  condition,
  description,
  onPriceSelect
}: SmartPriceSuggestionProps) => {
  const [suggestion, setSuggestion] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetSuggestion = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('price-intelligence', {
        body: { title, category, condition, description }
      });

      if (error) throw error;
      if (data) {
        setSuggestion(data);
      }
    } catch (error) {
      console.error('Price intelligence error:', error);
      toast.error('Failed to get price suggestion');
    } finally {
      setLoading(false);
    }
  };

  const getPriceIndicator = (price: number): 'low' | 'fair' | 'high' => {
    if (!suggestion) return 'fair';
    const avgPrice = (suggestion.min + suggestion.max) / 2;
    if (price < avgPrice * 0.85) return 'low';
    if (price > avgPrice * 1.15) return 'high';
    return 'fair';
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
        {loading ? 'Analyzing prices...' : 'Get Smart Price Suggestion'}
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
                onClick={() => onPriceSelect(suggestion.min, 'low')}
                className="p-3 rounded-lg border-2 border-green-500 bg-green-50 hover:bg-green-100 transition-colors text-left"
              >
                <div className="flex items-center gap-1 text-xs text-green-700 mb-1">
                  <TrendingDown className="h-3 w-3" />
                  Quick Sale
                </div>
                <div className="font-semibold text-lg text-green-700">${suggestion.min}</div>
                <div className="text-xs text-green-600 mt-1">Great price!</div>
              </button>

              <button
                type="button"
                onClick={() => onPriceSelect(suggestion.recommended, 'fair')}
                className="p-3 rounded-lg border-2 border-yellow-500 bg-yellow-50 hover:bg-yellow-100 transition-colors text-left"
              >
                <div className="flex items-center gap-1 text-xs text-yellow-700 mb-1">
                  <Minus className="h-3 w-3" />
                  Recommended
                </div>
                <div className="font-semibold text-lg text-yellow-700">${suggestion.recommended}</div>
                <div className="text-xs text-yellow-600 mt-1">Fair price</div>
              </button>

              <button
                type="button"
                onClick={() => onPriceSelect(suggestion.max, 'high')}
                className="p-3 rounded-lg border-2 border-red-500 bg-red-50 hover:bg-red-100 transition-colors text-left"
              >
                <div className="flex items-center gap-1 text-xs text-red-700 mb-1">
                  <TrendingUp className="h-3 w-3" />
                  Premium
                </div>
                <div className="font-semibold text-lg text-red-700">${suggestion.max}</div>
                <div className="text-xs text-red-600 mt-1">Too high?</div>
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
