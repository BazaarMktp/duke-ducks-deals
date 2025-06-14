
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

interface College {
  id: string;
  name: string;
}

interface ListingsTableProps {
  listings: Listing[];
  colleges: College[];
  onToggleStatus: (listingId: string, currentStatus: string) => void;
  onDelete: (listingId: string) => void;
}

const ListingsTable = ({ listings, colleges, onToggleStatus, onDelete }: ListingsTableProps) => {
  const getCollegeName = (collegeId: string) => {
    return colleges.find(c => c.id === collegeId)?.name || 'N/A';
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>College</TableHead>
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
              <div>
                <div className="font-medium">{listing.profiles?.profile_name}</div>
                <div className="text-sm text-gray-500">{listing.profiles?.email}</div>
              </div>
            </TableCell>
            <TableCell>{getCollegeName((listing as any).college_id)}</TableCell>
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
