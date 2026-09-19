import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ComplianceDashboardPage } from "./pages/ComplianceDashboardPage";
import { DriverPortalPage } from "./pages/DriverPortalPage";
import { FleetManagerDashboardPage } from "./pages/FleetManagerDashboardPage";
import { GlobalDashboardPage } from "./pages/GlobalDashboardPage";
import { PartsManagerDashboardPage } from "./pages/PartsManagerDashboardPage";
import { SilentMasterKeyDashboardPage } from "./pages/SilentMasterKeyDashboardPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/global-dashboard" replace={true} />} />
        <Route path="/global-dashboard" element={<GlobalDashboardPage />} />
        <Route path="/fleet-manager-dashboard" element={<FleetManagerDashboardPage />} />
        <Route path="/driver-portal" element={<DriverPortalPage />} />
        <Route path="/parts-manager-dashboard" element={<PartsManagerDashboardPage />} />
        <Route path="/compliance-dashboard" element={<ComplianceDashboardPage />} />
        <Route path="/silent-master-key-dashboard" element={<SilentMasterKeyDashboardPage />} />
      </Route>
    </Routes>
  );
}
