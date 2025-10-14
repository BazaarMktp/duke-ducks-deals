import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Sparkles, X } from "lucide-react";

interface ListingCreationChoiceProps {
  onChoiceSelect: (choice: 'manual' | 'ai') => void;
  onClose: () => void;
}

export const ListingCreationChoice: React.FC<ListingCreationChoiceProps> = ({
  onChoiceSelect,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl">
        <div className="relative p-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <h2 className="text-2xl font-bold mb-2">Create Your Listing</h2>
          <p className="text-muted-foreground mb-8">Choose how you'd like to create your listing</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Manual Flow Option */}
            <Card className="border-2 hover:border-primary transition-colors cursor-pointer group" onClick={() => onChoiceSelect('manual')}>
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Pencil className="h-6 w-6 text-primary" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Fill Manually</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Traditional form with optional AI suggestions to enhance your listing
                  </p>
                </div>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Full control over every field</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Optional AI title & description suggestions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Perfect for detailed custom listings</span>
                  </li>
                </ul>

                <Button className="w-full" onClick={() => onChoiceSelect('manual')}>
                  Start Manual Creation
                </Button>
              </CardContent>
            </Card>

            {/* AI Flow Option */}
            <Card className="border-2 hover:border-primary transition-colors cursor-pointer group" onClick={() => onChoiceSelect('ai')}>
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center group-hover:shadow-lg transition-all">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Use AI Assistant</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload photos and let AI generate your title and description
                  </p>
                </div>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>AI analyzes your images automatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Smart title & description generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Fast and effortless listing creation</span>
                  </li>
                </ul>

                <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" onClick={() => onChoiceSelect('ai')}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start AI Creation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};
