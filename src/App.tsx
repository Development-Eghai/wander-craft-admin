import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { AddTripForm } from "@/components/trips/AddTripForm";
import TripDetails from "@/pages/TripDetails";
import LeadsManagement from "@/pages/LeadsManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/trip/:id" element={<TripDetails />} />
          <Route path="/*" element={
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/trips/add" element={<AddTripForm />} />
                <Route path="/leads" element={<LeadsManagement />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DashboardLayout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
