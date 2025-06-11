
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Pencil, 
  Trash2, 
  Plus,
  ShoppingCart,
  MapPin,
  Users,
  Loader2,
  Pause,
  Play
} from "lucide-react";
import { toast } from "sonner";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Listing = {
  id: string;
  title: string;
  description?: string;
  price?: number;
  category: 'marketplace' | 'housing' | 'services';
  status: string;
  created_at: string;
  images?: string[];
};

const MyListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchListings();
    }
  }, [user]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load your listings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setListings(listings.filter(listing => listing.id !== id));
      toast.success("Listing deleted successfully");
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      
      const { error } = await supabase
        .from("listings")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      
      setListings(listings.map(listing => 
        listing.id === id ? { ...listing, status: newStatus } : listing
      ));
      
      toast.success(`Listing ${newStatus === 'active' ? 'activated' : 'paused'} successfully`);
    } catch (error) {
      console.error("Error updating listing status:", error);
      toast.error("Failed to update listing status");
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'marketplace':
        return <ShoppingCart size={16} className="mr-1" />;
      case 'housing':
        return <MapPin size={16} className="mr-1" />;
      case 'services':
        return <Users size={16} className="mr-1" />;
      default:
        return null;
    }
  };

  const getEditUrl = (listing: Listing) => {
    switch(listing.category) {
      case 'marketplace':
        return `/marketplace/edit/${listing.id}`;
      case 'housing':
        return `/housing/edit/${listing.id}`;
      case 'services':
        return `/services/edit/${listing.id}`;
      default:
        return '/';
    }
  };

  const getViewUrl = (listing: Listing) => {
    switch(listing.category) {
      case 'marketplace':
        return `/marketplace/${listing.id}`;
      case 'housing':
        return `/housing/${listing.id}`;
      case 'services':
        return `/services/${listing.id}`;
      default:
        return '/';
    }
  };

  const getCreateUrl = (category: string) => {
    return `/${category}/create`;
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p>Please log in to view your listings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <div className="flex space-x-2">
          <Button asChild>
            <Link to="/marketplace/create" className="flex items-center">
              <Plus size={16} className="mr-1" /> New Marketplace
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/housing/create" className="flex items-center">
              <Plus size={16} className="mr-1" /> New Housing
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/services/create" className="flex items-center">
              <Plus size={16} className="mr-1" /> New Service
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : listings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">You haven't created any listings yet.</p>
            <div className="space-x-2">
              <Button asChild>
                <Link to="/marketplace/create">Create Marketplace Listing</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/housing/create">Create Housing Listing</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/services/create">Create Service Listing</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden flex flex-col">
              <div className="h-48 bg-gray-100 relative">
                {listing.images && listing.images.length > 0 ? (
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                    {listing.status}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  {getCategoryIcon(listing.category)}
                  <span className="capitalize">{listing.category}</span>
                </div>
                <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="pb-2 pt-0">
                <p className="text-gray-600 line-clamp-2 text-sm">
                  {listing.description || 'No description available.'}
                </p>
                {listing.price !== undefined && (
                  <p className="font-bold text-blue-600 mt-2">${listing.price.toFixed(2)}</p>
                )}
              </CardContent>
              
              <CardFooter className="pt-2 mt-auto">
                <div className="flex justify-between w-full">
                  <Button variant="outline" asChild>
                    <Link to={getViewUrl(listing)}>View</Link>
                  </Button>
                  <div className="flex space-x-2">
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={() => handleStatusToggle(listing.id, listing.status)}
                      title={listing.status === 'active' ? 'Pause listing' : 'Activate listing'}
                    >
                      {listing.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                    </Button>
                    
                    <Button size="icon" variant="outline" asChild>
                      <Link to={getEditUrl(listing)}>
                        <Pencil size={16} />
                      </Link>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="destructive">
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this listing? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(listing.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
