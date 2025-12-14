import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/hooks/useWallet";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./layouts/AppLayout";
import { UserDashboardLayout } from "./layouts/UserDashboardLayout";
import { MerchantDashboardLayout } from "./layouts/MerchantDashboardLayout";
import { UserOverview } from "./pages/user/UserOverview";
import { UserVaults } from "./pages/user/UserVaults";
import { VaultDetail } from "./pages/user/VaultDetail";
import { UserAgents } from "./pages/user/UserAgents";
import { UserTransactions } from "./pages/user/UserTransactions";
import { UserSettings } from "./pages/user/UserSettings";
import { MerchantOverview } from "./pages/merchant/MerchantOverview";
import { MerchantAPIs } from "./pages/merchant/MerchantAPIs";
import { MerchantTransactions } from "./pages/merchant/MerchantTransactions";
import { MerchantPayouts } from "./pages/merchant/MerchantPayouts";
import { MerchantSettings } from "./pages/merchant/MerchantSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<AppLayout />} />
            </Route>
            <Route path="/app/user" element={<UserDashboardLayout />}>
              <Route index element={<UserOverview />} />
              <Route path="vaults" element={<UserVaults />} />
              <Route path="vaults/:id" element={<VaultDetail />} />
              <Route path="agents" element={<UserAgents />} />
              <Route path="transactions" element={<UserTransactions />} />
              <Route path="settings" element={<UserSettings />} />
            </Route>
            <Route path="/app/merchant" element={<MerchantDashboardLayout />}>
              <Route index element={<MerchantOverview />} />
              <Route path="apis" element={<MerchantAPIs />} />
              <Route path="transactions" element={<MerchantTransactions />} />
              <Route path="payouts" element={<MerchantPayouts />} />
              <Route path="settings" element={<MerchantSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;

