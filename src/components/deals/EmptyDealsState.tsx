import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Percent } from 'lucide-react';

interface EmptyDealsStateProps {
  isAdmin: boolean;
  onCreateDeal: () => void;
}

export const EmptyDealsState: React.FC<EmptyDealsStateProps> = ({
  isAdmin,
  onCreateDeal,
}) => {
  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-6">
          <Percent className="w-12 h-12 text-muted-foreground" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">No deals available yet</h3>
        
        {isAdmin ? (
          <>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start creating amazing deals and discounts for college students. Be the first to offer exclusive savings!
            </p>
            <Button onClick={onCreateDeal} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Deal
            </Button>
          </>
        ) : (
          <p className="text-muted-foreground max-w-md">
            Check back soon for exclusive deals and discounts from local businesses and online stores!
          </p>
        )}
      </CardContent>
    </Card>
  );
};