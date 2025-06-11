
// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "@/pages/Index";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Marketplace from "@/pages/Marketplace";
import MarketplaceItemDetail from "@/pages/MarketplaceItemDetail";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Housing from "@/pages/Housing";
import HousingDetail from "@/pages/HousingDetail";
import Donations from "@/pages/Donations";
import Messages from "@/pages/Messages";
import Cart from "@/pages/Cart";
import Favorites from "@/pages/Favorites";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import Profile from "@/pages/Profile";
import MyListings from "@/pages/MyListings";
import Settings from "@/pages/Settings";

import Navbar from "@/components/Navbar";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/auth" element={<Auth />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:id" element={<MarketplaceItemDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/housing" element={<Housing />} />
          <Route path="/housing/:id" element={<HousingDetail />} />
          <Route path="/donations" element={<Donations />} />
          
          {/* Protected routes */}
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="bottom-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
