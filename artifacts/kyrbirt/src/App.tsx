import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import DropsPage from "@/pages/drops-page";
import Admin from "@/pages/admin";
import ToggleMaintenance from "@/pages/toggle-maintenance";
import { MaintenancePage } from "@/components/maintenance-page";

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();

  const { data } = useQuery({
    queryKey: ["maintenance"],
    queryFn: () => fetch("/api/maintenance").then((r) => r.json()),
    refetchInterval: 30000,
  });

  const isMaintenanceRoute =
    location === "/mantenimiento" || location === "/umantenimiento";
  const isAdminRoute = location === "/admin";

  if (data?.enabled && !isMaintenanceRoute && !isAdminRoute) {
    return <MaintenancePage />;
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/drops" component={DropsPage} />
      <Route path="/admin" component={Admin} />
      <Route path="/mantenimiento">
        <ToggleMaintenance action="enable" />
      </Route>
      <Route path="/umantenimiento">
        <ToggleMaintenance action="disable" />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
