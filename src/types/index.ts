export type SiteType = "Commercial"|"Healthcare"|"Industrial"|"Education"|"Government"|"Mixed-Use"|"Data Center"|"Other";

export interface FormConfig {
  enabledFields:      string[];
  customTradeOptions: string[];
  extraCerts:         string[];
  requireCertUpload:  boolean;
}

export interface FieldDef {
  id:      string;
  label:   string;
  section: "basic"|"safety"|"ppe";
  type:    "text"|"tel"|"email"|"select"|"radio"|"checkbox"|"signature"|"file";
  locked?: boolean;
}

export interface WorkerCertification {
  id:              string;
  name:            string;
  evidenceName:    string;
  evidenceDataUrl: string;
}

export interface Site {
  id:         string;
  name:       string;
  location:   string;
  address:    string;
  type:       SiteType;
  manager:    string;
  projectNo:  string;
  // Legacy CMIC fields used by existing pages.
  cmicStatus?: "qr_enabled"|"synced"|"inactive";
  cmicProjectId?: string;
  assignedPartnerIds?: string[];
  active:     boolean;
  created:    string;
  formConfig: FormConfig;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  role?: string;
}

export interface BusinessPartner {
  id: string;
  name: string;
  type: "Subcontractor"|"Vendor"|"Supplier"|"Consultant"|"Other"|string;
  trade: string;
  contact: string;
  phone: string;
  cmicId: string;
  assignedSiteIds: string[];
  status: "active"|"inactive";
}

export interface WorkerSubmission {
  id:             string;
  workerId:       string;
  siteId:         string;
  site:           string;
  submittedAt:    string;
  checkIn:        string;
  firstName:      string;
  lastName:       string;
  employeeTitle:  string;
  phone:          string;
  email:          string;
  photoName:      string;
  photoDataUrl:   string;
  primaryLanguage:string;
  emergencyName:  string;
  emergencyPhone: string;
  trade:          string;
  employer:       string;
  supervisor:     string;
  yearsExp:       string;
  oshaCard:       string;
  firstAid:       boolean;
  siteSafety:     boolean;
  forklift:       boolean;
  scaffold:       boolean;
  confined:       boolean;
  fallProt:       boolean;
  extraCerts:     Record<string, boolean>;
  certifications: WorkerCertification[];
  ppeConfirm:     boolean;
  safetyAck:      boolean;
  drugAck:        boolean;
  signature:      string;
}

export interface HeadcountRow {
  id:                 string;
  siteId:             string;
  site:               string;
  date:               string;
  contractorName:     string;   // Company Name
  contractorRep:      string;   // Contractor Representative
  noOfWorkers:        number;   // Manpower Count
  hoursWorked:        string;   // e.g. "8-Hour Day", "6-2"
  descriptionOfWork:  string;
  didAnyAccidents:    string;   // "No" | "Yes"
  deliveriesReceived: string;
  equipmentOnSite:    string;
  openIssues:         string;
}

export interface DetailedHCRow {
  id:          string;
  siteId:      string;
  site:        string;
  date:        string;
  workerId:    string;    // links to WorkerSubmission.id (or "manual")
  workerName:  string;   // firstName + lastName from enrollment
  employerName:string;   // from enrollment
  trade:       string;
  hoursWorked: string;
}

export type AppScreen = "login"|"admin"|"landing"|"workerForm"|"success";
export type AdminTab  = "dashboard"|"headcount"|"qrManager"|"cmic"|"access";

// ─── BLE ──────────────────────────────────────────────────────────────────────
export type BLEStatus        = "active"|"absent"|"offsite";
export type AttendanceMethod = "ble_hardware"|"ble_manual"|"qr_scan";

export interface BLEEmployee {
  id:       string;
  name:     string;
  role:     string;
  dept:     string;
  site:     string;
  siteId:   string;
  badgeId:  string;
  status:   BLEStatus;
  checkIn:  string|null;
  checkOut: string|null;
  method:   AttendanceMethod;
}

export type UserRole = "system_admin"|"wt_employee";

export interface AuthUser {
  username:        string;
  displayName:     string;
  role:            UserRole;
  accessibleSiteIds: "all" | string[];
}

export interface AccessNotification {
  id:        string;
  to:        string;
  subject:   string;
  message:   string;
  createdAt: string;
}

export interface AccessRequest {
  id:         string;
  username:   string;
  siteId:     string;
  note:       string;
  status:     "pending"|"approved"|"rejected";
  createdAt:  string;
  resolvedAt?: string;
}
