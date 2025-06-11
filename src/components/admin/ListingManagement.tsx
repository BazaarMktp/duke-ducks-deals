
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Listing {
  id: string;
  title: string;
  category: string;
  listing_type: string;
  price: number;
  location: string;
  status: string;
  created_at: string;
  profiles: {
    profile_name: string;
    email: string;
  };
}

const ListingManagement = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          category,
          listing_type,
          price,
          location,
          status,
          created_at,
          profiles!listings_user_id_fkey(profile_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (listingId: string) => {
    try {
      // First delete related records that might reference this listing
      await supabase.from('favorites').delete().eq('listing_id', listingId);
      await supabase.from('cart_items').delete().eq('listing_id', listingId);
      await supabase.from('conversations').delete().eq('listing_id', listingId);
      
      // Then delete the listing itself
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;

      toast.success('Listing deleted successfully');
      fetchListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    }
  };

  const toggleListingStatus = async (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: newStatus })
        .eq('id', listingId);

      if (error) throw error;

      toast.success(`Listing ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      fetchListings();
    } catch (error) {
      console.error('Error updating listing status:', error);
      toast.error('Failed to update listing status');
    }
  };

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.listing_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.profiles?.profile_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading listings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listing Management</CardTitle>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
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
            {filteredListings.map((listing) => (
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
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleListingStatus(listing.id, listing.status)}
                    >
                      {listing.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
                          deleteListing(listing.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ListingManagement;
