import { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { wtTheme } from "./theme";
import { useStore } from "./hooks/useStore";
import { LoginPage }    from "./pages/LoginPage";
import { WorkerFormPage, SuccessPage } from "./pages/WorkerPages";
import { DashboardPage } from "./pages/DashboardPage";
import { BLEPage }       from "./pages/BLEPage";
import { QRManagerPage, ScanQRPage, HeadcountPage, LogPage } from "./pages/AdminPages";
import { AdminLayout }  from "./layouts/AdminLayout";
import type { Site, WorkerSubmission, AdminTab } from "./types";

type Screen = "login"|"admin"|"landing"|"workerForm"|"success";

// Simple auth — one admin login (no role system as per transcript)
function checkCredentials(u: string, p: string) {
  return u === "admin" && p === "admin123";
}

export default function App() {
  const store = useStore();
  const [screen,     setScreen]     = useState<Screen>("login");
  const [activeSite, setActiveSite] = useState<Site | null>(null);
  const [lastWorker, setLastWorker] = useState<WorkerSubmission | null>(null);

  const handleLogin = (u: string, p: string) => {
    if (checkCredentials(u, p)) { setScreen("admin"); return true; }
    return false;
  };

  const goPreview = (site: Site) => {
  setActiveSite(site);
  setScreen("workerForm"); 
};

  const handleWorkerSubmit = (data: Omit<WorkerSubmission,"id"|"workerId"|"submittedAt"|"checkIn"|"site">) => {
    if (!activeSite) return;
    const w = store.submitWorker(data, activeSite);
    setLastWorker(w);
    setScreen("success");
  };

  const renderPage = (tab: AdminTab) => {
    switch (tab) {
      case "dashboard": return <DashboardPage sites={store.sites} workers={store.workers} />;
      case "scan":      return <ScanQRPage    sites={store.sites} onSiteSelected={goPreview} />;
      case "headcount": return <HeadcountPage sites={store.sites} hcRows={store.hcRows} onDelete={store.deleteHcRow} onAdd={store.addHcRow} />;
      case "qrManager": return <QRManagerPage sites={store.sites} onAddSite={store.addSite} onUpdateSite={store.updateSite} onDeleteSite={store.deleteSite} onUpdateFormConfig={store.updateFormConfig} onPreview={goPreview} />;
      case "log":       return <LogPage       workers={store.workers} />;
      case "ble":       return <BLEPage       bleEmployees={store.bleEmployees} sites={store.sites} />;
      default:          return null;
    }
  };

  if (screen === "login") return (
    <ThemeProvider theme={wtTheme}>
      <CssBaseline />
      <LoginPage onLogin={handleLogin} />
    </ThemeProvider>
  );

  if (screen === "admin") return (
    <ThemeProvider theme={wtTheme}>
      <CssBaseline />
      <AdminLayout
        sites={store.sites} workers={store.workers} hcRows={store.hcRows}
        onAddSite={store.addSite} onUpdateSite={store.updateSite} onDeleteSite={store.deleteSite}
        onUpdateFormConfig={store.updateFormConfig}
        onAddHcRow={store.addHcRow} onDeleteHcRow={store.deleteHcRow}
        bleEmployees={store.bleEmployees}
        onPreview={goPreview}
        onLogout={() => setScreen("login")}
        renderPage={renderPage}
      />
    </ThemeProvider>
  );

 
  if (screen === "workerForm" && activeSite) return (
    <ThemeProvider theme={wtTheme}>
      <CssBaseline />
      <WorkerFormPage site={activeSite} onSubmit={handleWorkerSubmit} />
    </ThemeProvider>
  );

  if (screen === "success" && lastWorker && activeSite) return (
    <ThemeProvider theme={wtTheme}>
      <CssBaseline />
      <SuccessPage worker={lastWorker} site={activeSite} onDone={() => setScreen("admin")} />
    </ThemeProvider>
  );

  return <ThemeProvider theme={wtTheme}><CssBaseline /><LoginPage onLogin={handleLogin} /></ThemeProvider>;
}
