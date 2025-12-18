import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Package, Plus, Trash2, Upload, DollarSign, 
  CheckCircle, ArrowRight, ArrowLeft, Sparkles, X 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import { Progress } from "@/components/ui/progress";

interface BulkItem {
  id: string;
  title: string;
  description: string;
  price: string;
  images: string[];
  category: 'dorm' | 'textbooks' | 'electronics' | 'clothing' | 'other';
}

const QUICK_CATEGORIES = [
  { id: 'dorm', label: '🛏️ Dorm Essentials', examples: 'Bedding, lamps, storage' },
  { id: 'textbooks', label: '📚 Textbooks', examples: 'Course books, study materials' },
  { id: 'electronics', label: '💻 Electronics', examples: 'Cables, accessories, gadgets' },
  { id: 'clothing', label: '👕 Clothing', examples: 'School gear, formal wear' },
  { id: 'other', label: '📦 Other', examples: 'Kitchen, decor, misc' },
] as const;

interface BulkListingWizardProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const BulkListingWizard = ({ onClose, onSuccess }: BulkListingWizardProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [items, setItems] = useState<BulkItem[]>([]);
  const [currentItem, setCurrentItem] = useState<Partial<BulkItem>>({
    title: '',
    description: '',
    price: '',
    images: [],
    category: 'other'
  });
  const [publishing, setPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);

  const addItem = () => {
    if (!currentItem.title?.trim()) {
      toast.error("Please enter an item title");
      return;
    }
    if (!currentItem.price?.trim()) {
      toast.error("Please enter a price");
      return;
    }

    const newItem: BulkItem = {
      id: crypto.randomUUID(),
      title: currentItem.title || '',
      description: currentItem.description || '',
      price: currentItem.price || '0',
      images: currentItem.images || [],
      category: currentItem.category || 'other'
    };

    setItems(prev => [...prev, newItem]);
    setCurrentItem({
      title: '',
      description: '',
      price: '',
      images: [],
      category: 'other'
    });
    toast.success(`Added "${newItem.title}" to your batch`);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const publishAll = async () => {
    if (!user) {
      toast.error("Please sign in to create listings");
      return;
    }

    if (items.length === 0) {
      toast.error("Add at least one item to publish");
      return;
    }

    setPublishing(true);
    setPublishProgress(0);

    try {
      // Get user's college_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('college_id')
        .eq('id', user.id)
        .single();

      if (!profile?.college_id) {
        throw new Error("Could not find your college association");
      }

      let successCount = 0;
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        const { error } = await supabase
          .from('listings')
          .insert({
            user_id: user.id,
            college_id: profile.college_id,
            title: item.title,
            description: item.description || `${item.title} - End of semester sale!`,
            price: parseFloat(item.price),
            category: 'marketplace',
            listing_type: 'offer',
            images: item.images.length > 0 ? item.images : null,
            allow_pickup: true,
            allow_meet_on_campus: true,
            item_tag: item.category,
          });

        if (!error) {
          successCount++;
        }
        
        setPublishProgress(((i + 1) / items.length) * 100);
      }

      if (successCount === items.length) {
        toast.success(`🎉 All ${successCount} items published successfully!`);
        onSuccess?.();
        onClose();
      } else {
        toast.warning(`Published ${successCount} of ${items.length} items`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to publish listings");
    } finally {
      setPublishing(false);
    }
  };

  const totalValue = items.reduce((sum, item) => sum + parseFloat(item.price || '0'), 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Dorm Cleanout Mode</CardTitle>
                <CardDescription>
                  Quickly list multiple items for end of semester
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mt-4">
            <Badge variant={step === 1 ? "default" : "secondary"} className="gap-1">
              1. Add Items
            </Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <Badge variant={step === 2 ? "default" : "secondary"} className="gap-1">
              2. Review & Publish
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4">
          {step === 1 && (
            <div className="space-y-6">
              {/* Quick Category Selection */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Category</Label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_CATEGORIES.map(cat => (
                    <Button
                      key={cat.id}
                      type="button"
                      variant={currentItem.category === cat.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentItem(prev => ({ ...prev, category: cat.id }))}
                      className="text-xs"
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Item Form */}
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Item Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Desk Lamp - Great Condition"
                    value={currentItem.title || ''}
                    onChange={(e) => setCurrentItem(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        placeholder="15"
                        className="pl-9"
                        value={currentItem.price || ''}
                        onChange={(e) => setCurrentItem(prev => ({ ...prev, price: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Photos (optional)</Label>
                    <ImageUpload
                      images={currentItem.images || []}
                      onImagesChange={(images) => setCurrentItem(prev => ({ ...prev, images }))}
                      maxImages={3}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of condition, size, etc."
                    rows={2}
                    value={currentItem.description || ''}
                    onChange={(e) => setCurrentItem(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <Button onClick={addItem} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add to Batch ({items.length} items)
                </Button>
              </div>

              {/* Items List */}
              {items.length > 0 && (
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Items to List</h4>
                    <Badge variant="secondary">${totalValue.toFixed(2)} total</Badge>
                  </div>
                  <ScrollArea className="max-h-40">
                    <div className="space-y-2">
                      {items.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-background rounded border">
                          <div className="flex items-center gap-2">
                            {item.images[0] ? (
                              <img src={item.images[0]} alt="" className="w-8 h-8 rounded object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                                <Package className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <span className="text-sm font-medium">{item.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">${item.price}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <Sparkles className="h-12 w-12 mx-auto text-primary mb-3" />
                <h3 className="text-lg font-semibold">Ready to Publish!</h3>
                <p className="text-muted-foreground">
                  You're about to list {items.length} items for a total of ${totalValue.toFixed(2)}
                </p>
              </div>

              {/* Final Review */}
              <div className="border rounded-lg divide-y">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3">
                    {item.images[0] ? (
                      <img src={item.images[0]} alt="" className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {QUICK_CATEGORIES.find(c => c.id === item.category)?.label}
                      </p>
                    </div>
                    <Badge>${item.price}</Badge>
                  </div>
                ))}
              </div>

              {publishing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Publishing listings...</span>
                    <span>{Math.round(publishProgress)}%</span>
                  </div>
                  <Progress value={publishProgress} />
                </div>
              )}
            </div>
          )}
        </CardContent>

        {/* Footer Actions */}
        <div className="border-t p-4 bg-muted/30 flex items-center justify-between">
          {step === 1 ? (
            <>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button 
                onClick={() => setStep(2)} 
                disabled={items.length === 0}
                className="gap-2"
              >
                Review {items.length} Items
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setStep(1)} disabled={publishing}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={publishAll}
                disabled={publishing}
                className="gap-2"
              >
                {publishing ? (
                  <>Publishing...</>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Publish All ({items.length})
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BulkListingWizard;
