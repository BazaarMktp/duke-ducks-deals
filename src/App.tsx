
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useState, lazy, Suspense } from "react";

import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { AuthRedirectHandler } from "@/components/auth/AuthRedirectHandler";
import { SharedLinkWrapper } from "@/components/shared/SharedLinkWrapper";
import { PerformanceTracker } from "@/components/PerformanceTracker";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import Navbar from "@/components/Navbar";
import BottomNavBar from "@/components/BottomNavBar";
import { useCapacitorInit } from "@/hooks/useCapacitor";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useBackButton } from "@/hooks/useBackButton";
import Footer from "@/components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Critical routes – loaded eagerly
import Index from "./pages/Index";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Marketplace from "./pages/Marketplace";

// Lazy-loaded routes – split into separate chunks
const EmailValidation = lazy(() => import("./pages/EmailValidation"));
const AccountDeleted = lazy(() => import("./pages/AccountDeleted"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const About = lazy(() => import("./pages/About"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const MarketplaceItemDetail = lazy(() => import("./pages/MarketplaceItemDetail"));
const Housing = lazy(() => import("./pages/Housing"));
const HousingDetail = lazy(() => import("./pages/HousingDetail"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Messages = lazy(() => import("./pages/Messages"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const MyListings = lazy(() => import("./pages/MyListings"));
const CreateListing = lazy(() => import("./pages/CreateListing"));
const SmartCreateListing = lazy(() => import("./pages/SmartCreateListing"));
const EditListing = lazy(() => import("./pages/EditListing"));
const Favorites = lazy(() => import("./pages/Favorites"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const SharedLinks = lazy(() => import("./pages/SharedLinks"));
const DevilsDeals = lazy(() => import("./pages/DevilsDeals"));
const DealDetail = lazy(() => import("./pages/DealDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes – reduce refetches under heavy traffic
      gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
      retry: 1, // Single retry to avoid hammering backend
      refetchOnWindowFocus: false, // Prevent refetch storms when users alt-tab
    },
  },
});

const RouteSpinner = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <img
      src="/devils-marketplace-logo.png"
      alt="Devil's Marketplace"
      className="h-12 w-12 animate-pulse logo-blue"
    />
    <Loader2 className="h-5 w-5 animate-spin text-primary" />
  </div>
);

function AppContent() {
  const [isAuthProcessing, setIsAuthProcessing] = useState(false);
  const location = useLocation();

  useCapacitorInit();
  usePushNotifications();
  useBackButton();
  
  const hideFooterOnMobile = location.pathname === '/messages';

  return (
    <>
      <AuthRedirectHandler onAuthProcessing={setIsAuthProcessing} />
      <SharedLinkWrapper>
        <div className="min-h-screen bg-background flex flex-col">
          {isAuthProcessing && (
            <div className="fixed inset-0 bg-background/90 flex items-center justify-center z-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Confirming your email...</p>
              </div>
            </div>
          )}
          <Navbar />
          <main className="flex-1 main-content-pb md:pb-0">
            <Suspense fallback={<RouteSpinner />}>
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
                  path="/smart-create-listing"
                  element={
                    <ProtectedRoute>
                      <SmartCreateListing />
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
            </Suspense>
          </main>
          <div className={hideFooterOnMobile ? 'hidden md:block' : ''}>
            <Footer />
          </div>
          <BottomNavBar />
        </div>
      </SharedLinkWrapper>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <div>
          <TooltipProvider>
            <AuthProvider>
              <AdminProvider>
                <PerformanceTracker />
                <PWAInstallPrompt />
                <OfflineIndicator />
                <Toaster />
                <Sonner />
                <HashRouter>
                  <AppContent />
                </HashRouter>
              </AdminProvider>
            </AuthProvider>
          </TooltipProvider>
        </div>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
