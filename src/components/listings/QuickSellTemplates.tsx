import { useState } from "react";
import { Zap, BookOpen, Monitor, Sofa, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export interface ListingTemplate {
  name: string;
  icon: React.ReactNode;
  category: string;
  fields: {
    title?: string;
    description?: string;
    price?: string;
  };
}

const TEMPLATES: ListingTemplate[] = [
  {
    name: "Textbook",
    icon: <BookOpen size={20} />,
    category: "marketplace",
    fields: {
      title: "",
      description: "Course: \nCondition: \nEdition: \nISBN: ",
      price: "",
    },
  },
  {
    name: "Electronics",
    icon: <Monitor size={20} />,
    category: "marketplace",
    fields: {
      title: "",
      description: "Brand: \nModel: \nCondition: \nIncludes: ",
      price: "",
    },
  },
  {
    name: "Furniture",
    icon: <Sofa size={20} />,
    category: "marketplace",
    fields: {
      title: "",
      description: "Dimensions: \nColor: \nCondition: \nPurchased from: ",
      price: "",
    },
  },
  {
    name: "Clothing",
    icon: <Shirt size={20} />,
    category: "marketplace",
    fields: {
      title: "",
      description: "Brand: \nSize: \nCondition: \nColor: ",
      price: "",
    },
  },
];

interface QuickSellTemplatesProps {
  onSelectTemplate: (template: ListingTemplate) => void;
}

const QuickSellTemplates = ({ onSelectTemplate }: QuickSellTemplatesProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (template: ListingTemplate) => {
    onSelectTemplate(template);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Zap size={14} />
          Quick Sell
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-2">
          {TEMPLATES.map(template => (
            <button
              key={template.name}
              onClick={() => handleSelect(template)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {template.icon}
              </div>
              <span className="text-sm font-medium">{template.name}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { TEMPLATES };
export default QuickSellTemplates;
