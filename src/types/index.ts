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
  type:    "text"|"tel"|"select"|"radio"|"checkbox"|"signature";
  locked?: boolean;
}

export interface Site {
  id:         string;
  name:       string;
  location:   string;
  address:    string;
  type:       SiteType;
  manager:    string;
  projectNo:  string;
  active:     boolean;
  created:    string;
  formConfig: FormConfig;
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
  phone:          string;
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
  ppeConfirm:     boolean;
  safetyAck:      boolean;
  drugAck:        boolean;
  signature:      string;
}

export interface HeadcountRow {
  id:             string;
  siteId:         string;
  site:           string;
  contractorName: string;
  workerName:     string;
  date:           string;
  day:            string;
  checkIn:        string;
  checkOut:       string;
}

export type AppScreen = "login"|"admin"|"landing"|"workerForm"|"success";
export type AdminTab  = "dashboard"|"scan"|"headcount"|"qrManager"|"log"|"ble";

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
