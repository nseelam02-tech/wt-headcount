export type UserRole = "system_admin" | "wt_employee";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  projectAccessIds: string[];
}

export interface Project {
  id: string;
  name: string;
  projectNo: string;
  /** CMIC project code, e.g. 018466 or 018466.100 for sub-sites */
  cmicCode: string;
  /** parent cmicCode — set when this is a sub-site */
  parentCode?: string;
  location: string;
  status: "active" | "inactive";
}

export interface Contractor {
  id: string;
  name: string;
  code?: string;
}

export type HeadcountSource = "QR" | "MANUAL" | "BLE";

export interface HeadcountEvent {
  id: string;
  projectId: string;
  contractorId: string;
  source: HeadcountSource;
  count: number;
  at: string;
}

export interface WorkerOnboardingInput {
  name: string;
  title: string;
  trade: string;
  contractorId: string;
  phone: string;
  email: string;
  photoName: string;
  language: string;
  certifications: string[];
}

export interface WorkerRecord extends WorkerOnboardingInput {
  id: string;
  projectId: string;
  company: string;
  submittedAt: string;
}

export interface NotificationPreferences {
  dailySummaryEmail: boolean;
  workerOnboardingNotifications: boolean;
}

export interface DashboardTotals {
  totalToday: number;
  breakdown: Array<{ contractorId: string; contractorName: string; total: number }>;
}
