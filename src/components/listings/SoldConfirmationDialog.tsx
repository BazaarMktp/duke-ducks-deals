import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2 } from "lucide-react";

interface SoldConfirmationDialogProps {
  listingTitle: string;
  onConfirm: (soldOnBazaar: boolean, soldElsewhereLocation?: string) => void;
  children: React.ReactNode;
}

export const SoldConfirmationDialog = ({ 
  listingTitle, 
  onConfirm, 
  children 
}: SoldConfirmationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [soldLocation, setSoldLocation] = useState<"bazaar" | "elsewhere">("bazaar");
  const [elsewhereLocation, setElsewhereLocation] = useState("");

  const handleConfirm = () => {
    const soldOnBazaar = soldLocation === "bazaar";
    const location = soldOnBazaar ? undefined : elsewhereLocation.trim();
    
    if (soldLocation === "elsewhere" && !location) {
      return; // Don't proceed if elsewhere is selected but no location provided
    }

    onConfirm(soldOnBazaar, location);
    setOpen(false);
    
    // Reset form
    setSoldLocation("bazaar");
    setElsewhereLocation("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Mark as Sold
          </DialogTitle>
          <DialogDescription>
            Great! Where was "{listingTitle}" sold?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <RadioGroup 
            value={soldLocation} 
            onValueChange={(value) => setSoldLocation(value as "bazaar" | "elsewhere")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bazaar" id="bazaar" />
              <Label htmlFor="bazaar" className="text-sm font-medium">
                On Bazaar (through this platform)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="elsewhere" id="elsewhere" />
              <Label htmlFor="elsewhere" className="text-sm font-medium">
                Sold elsewhere
              </Label>
            </div>
          </RadioGroup>

          {soldLocation === "elsewhere" && (
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Where was it sold? <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                placeholder="e.g., Facebook Marketplace, Instagram, in person, etc."
                value={elsewhereLocation}
                onChange={(e) => setElsewhereLocation(e.target.value)}
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            size="sm"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={soldLocation === "elsewhere" && !elsewhereLocation.trim()}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            Mark as Sold
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};