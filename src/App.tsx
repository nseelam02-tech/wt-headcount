import { AppStateProvider, useAppState } from "./core/state/AppState";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LoginScreen } from "./features/auth/LoginScreen";
import { ProjectSelectionScreen } from "./features/projects/ProjectSelectionScreen";
import { DashboardScreen } from "./features/dashboard/DashboardScreen";
import { FlowOverviewScreen } from "./features/flow/FlowOverviewScreen";
import { ContractorManagementScreen } from "./features/contractors/ContractorManagementScreen";
import { QRPageScreen } from "./features/qr/QRPageScreen";
import { PublicWorkerFormScreen } from "./features/workers/PublicWorkerFormScreen";
import { ManualHeadcountScreen } from "./features/headcount/ManualHeadcountScreen";
import { NotificationPreferencesScreen } from "./features/settings/NotificationPreferencesScreen";
import { AppShell } from "./layouts/AppShell";
import { wtTheme } from "./theme";

function AppRouter() {
  const { screen } = useAppState();

  if (screen === "login") {
    return <LoginScreen />;
  }
  if (screen === "project-selection") {
    return <ProjectSelectionScreen />;
  }
  if (screen === "flow-overview") {
    return <FlowOverviewScreen />;
  }
  if (screen === "contractor-management") {
    return <ContractorManagementScreen />;
  }
  if (screen === "qr-page") {
    return <QRPageScreen />;
  }
  if (screen === "worker-form") {
    return <PublicWorkerFormScreen />;
  }
  if (screen === "manual-headcount") {
    return <ManualHeadcountScreen />;
  }
  if (screen === "notifications") {
    return <NotificationPreferencesScreen />;
  }
  return <DashboardScreen />;
}

export default function App() {
  return (
    <ThemeProvider theme={wtTheme}>
      <CssBaseline />
      <AppStateProvider>
        <AppShell>
          <AppRouter />
        </AppShell>
      </AppStateProvider>
    </ThemeProvider>
  );
}
