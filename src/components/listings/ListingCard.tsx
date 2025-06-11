
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Play, Pause, MapPin } from "lucide-react";
import { DeleteListingDialog } from "./DeleteListingDialog";
import { Listing } from "@/hooks/useMyListings";

interface ListingCardProps {
  listing: Listing;
  onDelete: (listingId: string) => void;
  onStatusToggle: (listingId: string, currentStatus: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    case 'sold':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const ListingCard = ({ listing, onDelete, onStatusToggle }: ListingCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <img 
          src={listing.images?.[0] || "/placeholder.svg"} 
          alt={listing.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{listing.title}</CardTitle>
          <div className="flex gap-1">
            <Badge variant="secondary" className="text-xs">
              {listing.category}
            </Badge>
            <Badge className={`text-xs ${getStatusColor(listing.status)}`}>
              {listing.status}
            </Badge>
          </div>
        </div>
        
        {listing.location && (
          <p className="text-sm text-muted-foreground mb-2 flex items-center">
            <MapPin size={14} className="mr-1" />
            {listing.location}
          </p>
        )}
        
        <p className="text-sm mb-3 line-clamp-2">{listing.description}</p>
        
        {listing.price && (
          <p className="text-xl font-bold text-green-600 mb-3">
            ${listing.price}
            {listing.category === 'housing' ? '/month' : listing.category === 'services' ? '/hour' : ''}
          </p>
        )}
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/edit-listing/${listing.id}`)}
          >
            <Edit size={16} />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusToggle(listing.id, listing.status)}
            className={listing.status === 'active' ? 'text-orange-600' : 'text-green-600'}
          >
            {listing.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          
          <DeleteListingDialog
            listingTitle={listing.title}
            onDelete={() => onDelete(listing.id)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
