
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReportListing from "@/components/common/ReportListing";
import FeedbackButton from "@/components/feedback/FeedbackButton";

interface MarketplaceItemHeaderProps {
  productId: string;
}

const MarketplaceItemHeader = ({ productId }: MarketplaceItemHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Link to="/marketplace" className="inline-flex items-center text-blue-600 hover:text-blue-800">
        <ArrowLeft size={20} className="mr-2" />
        Back to Marketplace
      </Link>
      <div className="flex gap-2">
        <FeedbackButton />
        <ReportListing listingId={productId} listingType="marketplace" />
      </div>
    </div>
  );
};

export default MarketplaceItemHeader;
