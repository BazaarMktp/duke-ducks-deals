
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface PostingFormHeaderProps {
  title: string;
  onClose: () => void;
}

const PostingFormHeader: React.FC<PostingFormHeaderProps> = ({ title, onClose }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>{title}</CardTitle>
      <Button variant="ghost" size="sm" onClick={onClose}>
        <X size={16} />
      </Button>
    </CardHeader>
  );
};

export default PostingFormHeader;
