
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UnifiedListingCreation } from "@/components/listings/UnifiedListingCreation";
import ServicesHeader from "@/components/services/ServicesHeader";
import ServicesSearch from "@/components/services/ServicesSearch";
import ServicesCategories from "@/components/services/ServicesCategories";
import ServicesList from "@/components/services/ServicesList";
import ListingTypeToggle from "@/components/services/ListingTypeToggle";
import { useServices } from "@/hooks/useServices";

const Services = () => {
  const { user } = useAuth();
  const [showPostingForm, setShowPostingForm] = useState(false);
  
  const {
    listings,
    loading,
    favorites,
    toggleFavorite,
    startConversation,
    searchTerm,
    setSearchTerm,
    activeListingType,
    setActiveListingType,
    fetchServiceListings,
  } = useServices(user);

  const serviceCategories = ["Academic", "Music", "Tutoring", "Tech", "Design", "Other"];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ServicesHeader 
        user={user} 
        onPostService={() => setShowPostingForm(true)} 
        activeListingType={activeListingType}
      />

      <ListingTypeToggle 
        activeType={activeListingType}
        onTypeChange={setActiveListingType}
      />

      <ServicesSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <ServicesCategories categories={serviceCategories} />

      <ServicesList
        listings={listings}
        user={user}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onStartConversation={startConversation}
      />

      {showPostingForm && (
        <UnifiedListingCreation
          category="services"
          listingType={activeListingType}
          onClose={() => setShowPostingForm(false)}
          onSuccess={() => {
            fetchServiceListings();
            setShowPostingForm(false);
          }}
        />
      )}
    </div>
  );
};

export default Services;
