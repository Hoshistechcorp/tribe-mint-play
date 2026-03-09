import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import BusinessDetail from "./pages/BusinessDetail";
import Payouts from "./pages/Payouts";
import BusinessOwnerDashboard from "./pages/BusinessOwnerDashboard";
import CreatorProfile from "./pages/CreatorProfile";
import Leaderboard from "./pages/Leaderboard";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/business/:id" element={<BusinessDetail />} />
        <Route path="/payouts" element={<Payouts />} />
        <Route path="/business-dashboard" element={<BusinessOwnerDashboard />} />
        <Route path="/profile" element={<CreatorProfile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
