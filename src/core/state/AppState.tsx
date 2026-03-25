import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { mockUser, mockProjects, mockContractors, projectContractors, mockHeadcountEvents } from "../mock/data";
import type {
  AppUser,
  Contractor,
  DashboardTotals,
  HeadcountEvent,
  NotificationPreferences,
  Project,
  WorkerOnboardingInput,
  WorkerRecord,
} from "../types";

const LAST_PROJECT_KEY = "wt_last_project";
const PREFS_KEY = "wt_notification_prefs";
const RECENT_PROJECTS_KEY = "wt_recent_projects";

type Screen =
  | "login"
  | "project-selection"
  | "flow-overview"
  | "dashboard"
  | "contractor-management"
  | "qr-page"
  | "worker-form"
  | "manual-headcount"
  | "notifications";

type NotificationKey = keyof NotificationPreferences;

interface ReceiverConfig {
  configured: boolean;
  autoBadgeOutMinutes: number;
  primaryReceiverId: string;
  mappedReceiverIds: string[];
}

interface AppStateValue {
  screen: Screen;
  user: AppUser | null;
  projects: Project[];
  selectedProject: Project | null;
  assignedContractors: Contractor[];
  availableContractors: Contractor[];
  headcountEvents: HeadcountEvent[];
  workers: WorkerRecord[];
  dashboardTotals: DashboardTotals;
  notificationPrefs: NotificationPreferences;
  receiverConfig: ReceiverConfig;
  publicFormUrl: string;
  recentProjectIds: string[];
  login: () => void;
  logout: () => void;
  goToProjectSelection: () => void;
  goToScreen: (screen: Exclude<Screen, "login">) => void;
  selectProject: (projectId: string) => void;
  assignContractor: (contractorId: string) => void;
  removeContractor: (contractorId: string) => void;
  submitWorkerOnboarding: (payload: WorkerOnboardingInput) => void;
  addManualHeadcount: (contractorId: string, count: number) => void;
  configureReceiver: (autoBadgeOutMinutes: number, receiverId: string) => void;
  setNotificationPreference: (key: NotificationKey, value: boolean) => void;
}

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

function isToday(value: string): boolean {
  const d = new Date(value);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [screen, setScreen] = useState<Screen>("login");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => localStorage.getItem(LAST_PROJECT_KEY) ?? "");
  const [projectAssignments, setProjectAssignments] = useState<Record<string, string[]>>(projectContractors);
  const [headcountEvents, setHeadcountEvents] = useState<HeadcountEvent[]>(mockHeadcountEvents);
  const [workers, setWorkers] = useState<WorkerRecord[]>([]);
  const [recentProjectIds, setRecentProjectIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_PROJECTS_KEY) ?? "[]") as string[]; }
    catch { return []; }
  });
  const [receiverSettings, setReceiverSettings] = useState<Record<string, ReceiverConfig>>({});
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(() => {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) {
      return { dailySummaryEmail: true, workerOnboardingNotifications: true };
    }
    try {
      return JSON.parse(raw) as NotificationPreferences;
    } catch {
      return { dailySummaryEmail: true, workerOnboardingNotifications: true };
    }
  });

  const projects = useMemo(
    () => (user ? mockProjects.filter(p => user.projectAccessIds.includes(p.id)) : []),
    [user],
  );

  const selectedProject = useMemo(
    () => projects.find(p => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const assignedContractors = useMemo(() => {
    if (!selectedProject) return [];
    const assignedIds = projectAssignments[selectedProject.id] ?? [];
    return mockContractors.filter(c => assignedIds.includes(c.id));
  }, [projectAssignments, selectedProject]);

  const availableContractors = useMemo(() => {
    const assigned = new Set(assignedContractors.map(c => c.id));
    return mockContractors.filter(c => !assigned.has(c.id));
  }, [assignedContractors]);

  const receiverConfig = useMemo<ReceiverConfig>(() => {
    if (!selectedProject) {
      return { configured: false, autoBadgeOutMinutes: 0, primaryReceiverId: "", mappedReceiverIds: [] };
    }
    return receiverSettings[selectedProject.id] ?? {
      configured: false,
      autoBadgeOutMinutes: 0,
      primaryReceiverId: "",
      mappedReceiverIds: [],
    };
  }, [receiverSettings, selectedProject]);

  const publicFormUrl = useMemo(() => {
    if (!selectedProject) return "";
    return `https://wtledgerapp.com/workerorientation?jobsite=${selectedProject.id}`;
  }, [selectedProject]);

  const dashboardTotals = useMemo<DashboardTotals>(() => {
    if (!selectedProject) {
      return { totalToday: 0, breakdown: [] };
    }

    const todayEvents = headcountEvents.filter(
      e => e.projectId === selectedProject.id && isToday(e.at),
    );

    const byContractor = new Map<string, number>();
    todayEvents.forEach(e => {
      byContractor.set(e.contractorId, (byContractor.get(e.contractorId) ?? 0) + e.count);
    });

    const breakdown = Array.from(byContractor.entries())
      .map(([contractorId, total]) => ({
        contractorId,
        contractorName: assignedContractors.find(c => c.id === contractorId)?.name ?? "Unknown Contractor",
        total,
      }))
      .sort((a, b) => b.total - a.total);

    return {
      totalToday: todayEvents.reduce((sum, e) => sum + e.count, 0),
      breakdown,
    };
  }, [assignedContractors, headcountEvents, selectedProject]);

  const login = () => {
    setUser(mockUser);
    // Always route to jobsite selection after login.
    setScreen("project-selection");
  };

  const logout = () => {
    setUser(null);
    setScreen("login");
  };

  const goToProjectSelection = () => setScreen("project-selection");
  const goToScreen = (nextScreen: Exclude<Screen, "login">) => setScreen(nextScreen);

  const selectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    localStorage.setItem(LAST_PROJECT_KEY, projectId);
    // Keep last 10 unique recents
    setRecentProjectIds(prev => {
      const next = [projectId, ...prev.filter(id => id !== projectId)].slice(0, 10);
      localStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify(next));
      return next;
    });
    setScreen("flow-overview");
  };

  const assignContractor = (contractorId: string) => {
    if (!selectedProject) return;
    setProjectAssignments(prev => {
      const current = prev[selectedProject.id] ?? [];
      if (current.includes(contractorId)) return prev;
      return { ...prev, [selectedProject.id]: [...current, contractorId] };
    });
  };

  const removeContractor = (contractorId: string) => {
    if (!selectedProject) return;
    setProjectAssignments(prev => {
      const current = prev[selectedProject.id] ?? [];
      return { ...prev, [selectedProject.id]: current.filter(id => id !== contractorId) };
    });
  };

  const submitWorkerOnboarding = (payload: WorkerOnboardingInput) => {
    if (!selectedProject) return;
    const contractor = assignedContractors.find(c => c.id === payload.contractorId);
    if (!contractor) return;

    const nowIso = new Date().toISOString();
    const workerId = `w-${Date.now()}`;
    const worker: WorkerRecord = {
      id: workerId,
      projectId: selectedProject.id,
      contractorId: payload.contractorId,
      name: payload.name,
      title: payload.title,
      trade: payload.trade,
      company: contractor.name,
      phone: payload.phone,
      email: payload.email,
      photoName: payload.photoName,
      language: payload.language,
      certifications: payload.certifications,
      submittedAt: nowIso,
    };

    setWorkers(prev => [worker, ...prev]);
    setHeadcountEvents(prev => [
      {
        id: `e-${Date.now()}`,
        projectId: selectedProject.id,
        contractorId: payload.contractorId,
        source: "QR",
        count: 1,
        at: nowIso,
      },
      ...prev,
    ]);
  };

  const addManualHeadcount = (contractorId: string, count: number) => {
    if (!selectedProject || count <= 0) return;
    setHeadcountEvents(prev => [
      {
        id: `e-${Date.now()}`,
        projectId: selectedProject.id,
        contractorId,
        source: "MANUAL",
        count,
        at: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const configureReceiver = (autoBadgeOutMinutes: number, receiverId: string) => {
    if (!selectedProject) return;
    const trimmedId = receiverId.trim();
    if (!trimmedId) return;
    setReceiverSettings(prev => ({
      ...prev,
      [selectedProject.id]: {
        configured: true,
        autoBadgeOutMinutes,
        primaryReceiverId: trimmedId,
        mappedReceiverIds: Array.from(new Set([trimmedId, ...(prev[selectedProject.id]?.mappedReceiverIds ?? [])])),
      },
    }));
  };

  const setNotificationPreference = (key: NotificationKey, value: boolean) => {
    setNotificationPrefs(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value: AppStateValue = {
    screen,
    user,
    projects,
    selectedProject,
    assignedContractors,
    availableContractors,
    headcountEvents,
    workers,
    dashboardTotals,
    notificationPrefs,
    receiverConfig,
    publicFormUrl,
    recentProjectIds,
    login,
    logout,
    goToProjectSelection,
    goToScreen,
    selectProject,
    assignContractor,
    removeContractor,
    submitWorkerOnboarding,
    addManualHeadcount,
    configureReceiver,
    setNotificationPreference,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return ctx;
}
