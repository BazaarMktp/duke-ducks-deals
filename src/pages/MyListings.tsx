
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Play, Pause, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  housing_type: string;
  location: string;
  images: string[];
  status: "active" | "sold" | "inactive";
  created_at: string;
}

const MyListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchListings();
    }
  }, [user]);

  const fetchListings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error("Failed to load listings.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setListings(prev => prev.filter(listing => listing.id !== listingId));
      toast.success("Listing deleted successfully!");
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error("Failed to delete listing.");
    }
  };

  const handleStatusToggle = async (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await supabase
        .from('listings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', listingId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setListings(prev => 
        prev.map(listing => 
          listing.id === listingId 
            ? { ...listing, status: newStatus as "active" | "sold" | "inactive" }
            : listing
        )
      );

      toast.success(`Listing ${newStatus === 'active' ? 'activated' : 'paused'} successfully!`);
    } catch (error) {
      console.error('Error updating listing status:', error);
      toast.error("Failed to update listing status.");
    }
  };

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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Please sign in to view your listings.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your listings...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/create-listing')} size="sm">
            <Plus size={16} className="mr-1" />
            Create Listing
          </Button>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't created any listings yet.</p>
          <Button onClick={() => navigate('/create-listing')}>
            <Plus size={16} className="mr-1" />
            Create Your First Listing
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
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
                    onClick={() => handleStatusToggle(listing.id, listing.status)}
                    className={listing.status === 'active' ? 'text-orange-600' : 'text-green-600'}
                  >
                    {listing.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{listing.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(listing.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
