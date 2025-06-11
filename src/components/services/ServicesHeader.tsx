
import { Button } from "@/components/ui/button";
import { Plus, Search, Package } from "lucide-react";

interface ServicesHeaderProps {
  user: any;
  onPostService: () => void;
  activeListingType?: 'offer' | 'wanted';
}

const ServicesHeader = ({ user, onPostService, activeListingType = 'offer' }: ServicesHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {activeListingType === 'offer' ? 'Services' : 'Service Requests'}
        </h1>
        <p className="text-gray-600 mt-2">
          {activeListingType === 'offer' 
            ? 'Find services offered by Duke students'
            : 'See what services Duke students are looking for'
          }
        </p>
      </div>
      
      {user && (
        <Button onClick={onPostService} className="flex items-center gap-2">
          {activeListingType === 'offer' ? (
            <>
              <Package size={16} />
              Post Service
            </>
          ) : (
            <>
              <Search size={16} />
              Post Request
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default ServicesHeader;
