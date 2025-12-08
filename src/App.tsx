import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { Layout } from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import RegisterPage from "@/pages/RegisterPage";
import TrainingPage from "@/pages/TrainingPage";
import GamePage from "@/pages/GamePage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <AccessibilityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/training" element={<TrainingPage />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </AccessibilityProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
