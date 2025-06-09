
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Donations from "./pages/Donations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/donations" element={<Donations />} />
            {/* Housing, Services, Messages pages will be added next */}
            <Route path="/housing" element={<div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold">Housing - Coming Soon</h1></div>} />
            <Route path="/services" element={<div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold">Services - Coming Soon</h1></div>} />
            <Route path="/messages" element={<div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold">Messages - Coming Soon</h1></div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
