import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ListingOptimizerProps {
  title: string;
  description: string;
  category: string;
  onTitleSuggestion: (title: string) => void;
  onDescriptionSuggestion: (description: string) => void;
}

export const ListingOptimizer = ({
  title,
  description,
  category,
  onTitleSuggestion,
  onDescriptionSuggestion
}: ListingOptimizerProps) => {
  const [titleSuggestions, setTitleSuggestions] = useState<any>(null);
  const [descriptionResult, setDescriptionResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getListingAssistance = async (type: string, data: any) => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase.functions.invoke('listing-assistant', {
        body: { type, data }
      });

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Listing assistant error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const improveTitles = async () => {
    const result = await getListingAssistance('improve_title', { title, category });
    if (result) {
      setTitleSuggestions(result);
    }
  };

  const enhanceDescription = async () => {
    const result = await getListingAssistance('enhance_description', {
      title,
      category,
      description
    });
    if (result) {
      setDescriptionResult(result);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={improveTitles}
          disabled={loading || !title}
          size="sm"
        >
          <Sparkles className="h-3 w-3 mr-2" />
          Improve Title
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={enhanceDescription}
          disabled={loading || !title}
          size="sm"
        >
          <Sparkles className="h-3 w-3 mr-2" />
          Enhance Description
        </Button>
      </div>

      {titleSuggestions && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Title Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {titleSuggestions.suggestions?.map((suggestion: string, i: number) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  onTitleSuggestion(suggestion);
                  setTitleSuggestions(null);
                }}
                className="w-full text-left p-3 rounded-lg border bg-background hover:bg-accent transition-colors"
              >
                <p className="text-sm">{suggestion}</p>
              </button>
            ))}
            <p className="text-xs text-muted-foreground mt-2">
              {titleSuggestions.reason}
            </p>
          </CardContent>
        </Card>
      )}

      {descriptionResult && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Enhanced Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg border bg-background">
              <p className="text-sm whitespace-pre-wrap">{descriptionResult.description}</p>
            </div>
            <Button
              type="button"
              onClick={() => {
                onDescriptionSuggestion(descriptionResult.description);
                setDescriptionResult(null);
              }}
              size="sm"
              className="w-full"
            >
              Use This Description
            </Button>
            {descriptionResult.tips && (
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-semibold">Tips:</p>
                <ul className="list-disc list-inside space-y-1">
                  {descriptionResult.tips.map((tip: string, i: number) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
