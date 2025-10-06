
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { AuthRedirectHandler } from "@/components/auth/AuthRedirectHandler";
import { SharedLinkWrapper } from "@/components/shared/SharedLinkWrapper";
import { PerformanceTracker } from "@/components/PerformanceTracker";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { CampusChatbot } from "@/components/ai/CampusChatbot";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import EmailValidation from "./pages/EmailValidation";
import AccountDeleted from "./pages/AccountDeleted";
import PasswordReset from "./pages/PasswordReset";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Marketplace from "./pages/Marketplace";
import MarketplaceItemDetail from "./pages/MarketplaceItemDetail";
import Housing from "./pages/Housing";
import HousingDetail from "./pages/HousingDetail";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import MyListings from "./pages/MyListings";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import SharedLinks from "./pages/SharedLinks";
import DevilsDeals from "./pages/DevilsDeals";
import DealDetail from "./pages/DealDetail";
import NativeFeatures from "./pages/NativeFeatures";
import CampusLife from "./pages/CampusLife";
import RoommateFinder from "./pages/RoommateFinder";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "@/components/Footer";

const queryClient = new QueryClient();

function App() {
  const [isAuthProcessing, setIsAuthProcessing] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <AuthProvider>
          <AdminProvider>
            <PerformanceTracker />
            <PWAInstallPrompt />
            <OfflineIndicator />
            <Toaster />
            <Sonner />
            <HashRouter>
              <AuthRedirectHandler onAuthProcessing={setIsAuthProcessing} />
              <SharedLinkWrapper>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                  {isAuthProcessing && (
                    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Confirming your email...</p>
                      </div>
                    </div>
                  )}
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/verify" element={<Index />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/reset-password" element={<PasswordReset />} />
                      <Route path="/email-validation" element={<EmailValidation />} />
                      <Route path="/account-deleted" element={<AccountDeleted />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/terms" element={<TermsAndConditions />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="/marketplace/:id" element={<MarketplaceItemDetail />} />
                      <Route path="/housing" element={<Housing />} />
                      <Route path="/housing/:id" element={<HousingDetail />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/services/:id" element={<ServiceDetail />} />
                      <Route path="/devils-deals" element={<DevilsDeals />} />
                      <Route path="/devils-deals/:id" element={<DealDetail />} />
                      <Route path="/campus-life" element={<CampusLife />} />
                      <Route path="/roommate-finder" element={<RoommateFinder />} />
                      <Route path="/native-features" element={<NativeFeatures />} />
                      <Route
                        path="/messages"
                        element={
                          <ProtectedRoute>
                            <Messages />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/my-listings"
                        element={
                          <ProtectedRoute>
                            <MyListings />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/create-listing"
                        element={
                          <ProtectedRoute>
                            <CreateListing />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/edit-listing/:id"
                        element={
                          <ProtectedRoute>
                            <EditListing />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/favorites"
                        element={
                          <ProtectedRoute>
                            <Favorites />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/cart"
                        element={
                          <ProtectedRoute>
                            <Cart />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/shared-links"
                        element={
                          <ProtectedRoute>
                            <SharedLinks />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                  <CampusChatbot />
                </div>
              </SharedLinkWrapper>
            </HashRouter>
          </AdminProvider>
        </AuthProvider>
      </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
