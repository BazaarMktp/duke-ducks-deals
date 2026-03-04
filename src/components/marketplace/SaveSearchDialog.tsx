import { useState } from "react";
import { Bookmark, Bell, BellOff, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useSavedSearches } from "@/hooks/useSavedSearches";
import { useAuth } from "@/contexts/AuthContext";

interface SaveSearchDialogProps {
  searchQuery: string;
  categoryFilter?: string | null;
  priceRange?: { min: number | null; max: number | null };
  listingType?: string;
  onApplySearch?: (query: string) => void;
}

const SaveSearchDialog = ({ searchQuery, categoryFilter, priceRange, listingType, onApplySearch }: SaveSearchDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { savedSearches, saveSearch, deleteSearch, toggleNotify } = useSavedSearches();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    const success = await saveSearch({
      name: name.trim(),
      search_query: searchQuery || undefined,
      category: categoryFilter || undefined,
      min_price: priceRange?.min,
      max_price: priceRange?.max,
      listing_type: listingType,
    });
    setSubmitting(false);
    if (success) {
      setName("");
    }
  };

  const handleApply = (search: { search_query: string | null }) => {
    if (onApplySearch && search.search_query) {
      onApplySearch(search.search_query);
      setOpen(false);
    }
  };

  if (!user) return null;

  const hasActiveSearch = searchQuery || categoryFilter || priceRange?.min || priceRange?.max;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Bookmark size={14} />
          <span className="hidden sm:inline">Saved</span>
          {savedSearches.length > 0 && (
            <span className="bg-primary/10 text-primary text-xs font-semibold px-1.5 py-0.5 rounded-full">
              {savedSearches.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Saved Searches</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Save current search */}
          {hasActiveSearch && (
            <div className="space-y-2 pb-4 border-b">
              <p className="text-sm text-muted-foreground">Save current search filters:</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Name this search..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSave} disabled={!name.trim() || submitting} size="sm">
                  Save
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                {searchQuery && <span className="bg-muted px-2 py-0.5 rounded">"{searchQuery}"</span>}
                {priceRange?.min && <span className="bg-muted px-2 py-0.5 rounded">Min: ${priceRange.min}</span>}
                {priceRange?.max && <span className="bg-muted px-2 py-0.5 rounded">Max: ${priceRange.max}</span>}
              </div>
            </div>
          )}

          {/* Saved searches list */}
          {savedSearches.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              <Search size={24} className="mx-auto mb-2 opacity-50" />
              <p>No saved searches yet</p>
              <p className="text-xs mt-1">Search for something and save it here</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {savedSearches.map(search => (
                <Card key={search.id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleApply(search)}
                        className="flex-1 text-left min-w-0"
                      >
                        <p className="font-medium text-sm truncate">{search.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {search.search_query && (
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">"{search.search_query}"</span>
                          )}
                          {search.min_price && (
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">${search.min_price}+</span>
                          )}
                          {search.max_price && (
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">Under ${search.max_price}</span>
                          )}
                        </div>
                      </button>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Switch
                          checked={search.notify_enabled}
                          onCheckedChange={checked => toggleNotify(search.id, checked)}
                        />
                        {search.notify_enabled ? <Bell size={12} className="text-primary" /> : <BellOff size={12} className="text-muted-foreground" />}
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteSearch(search.id)}>
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveSearchDialog;
