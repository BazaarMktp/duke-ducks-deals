
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Listing } from "./types";
import ListingActions from "./ListingActions";

interface ListingsTableProps {
  listings: Listing[];
  onToggleStatus: (listingId: string, currentStatus: string) => void;
  onDelete: (listingId: string) => void;
}

const ListingsTable = ({ listings, onToggleStatus, onDelete }: ListingsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {listings.map((listing) => (
          <TableRow key={listing.id}>
            <TableCell className="font-medium">{listing.title}</TableCell>
            <TableCell>
              <Badge variant="outline">{listing.category}</Badge>
            </TableCell>
            <TableCell>
              <Badge 
                variant={listing.listing_type === 'wanted' ? 'secondary' : 'outline'}
                className={listing.listing_type === 'wanted' ? 'text-blue-600' : ''}
              >
                {listing.listing_type === 'wanted' ? 'Looking For' : 'Offering'}
              </Badge>
            </TableCell>
            <TableCell>${listing.price || 'N/A'}</TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{listing.profiles?.profile_name}</div>
                <div className="text-sm text-gray-500">{listing.profiles?.email}</div>
              </div>
            </TableCell>
            <TableCell>
              <Badge 
                variant={listing.status === 'active' ? 'default' : 'secondary'}
              >
                {listing.status}
              </Badge>
            </TableCell>
            <TableCell>
              <ListingActions
                listingId={listing.id}
                status={listing.status}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ListingsTable;
