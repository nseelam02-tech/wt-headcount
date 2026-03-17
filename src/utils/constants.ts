import type { FieldDef, Site, WorkerSubmission, HeadcountRow, FormConfig } from "../types";

// ─── Brand ────────────────────────────────────────────────────────────────────
export const ORANGE = "#E8590C";
export const DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// ─── Field definitions ────────────────────────────────────────────────────────
export const BASE_FIELDS: FieldDef[] = [
  { id:"firstName",      label:"First Name",             section:"basic",  type:"text",      locked:true },
  { id:"lastName",       label:"Last Name",              section:"basic",  type:"text",      locked:true },
  { id:"phone",          label:"Mobile Phone",           section:"basic",  type:"tel"   },
  { id:"emergencyName",  label:"Emergency Contact Name", section:"basic",  type:"text"  },
  { id:"emergencyPhone", label:"Emergency Contact Phone",section:"basic",  type:"tel"   },
  { id:"trade",          label:"Trade / Craft",          section:"basic",  type:"select"},
  { id:"employer",       label:"Employer / Company",     section:"basic",  type:"text"  },
  { id:"supervisor",     label:"Supervisor on Site",     section:"basic",  type:"text"  },
  { id:"yearsExp",       label:"Years of Experience",    section:"basic",  type:"select"},
  { id:"oshaCard",       label:"OSHA Card",              section:"safety", type:"radio" },
  { id:"firstAid",       label:"First Aid / CPR",        section:"safety", type:"checkbox"},
  { id:"siteSafety",     label:"Safety Orientation",     section:"safety", type:"checkbox"},
  { id:"forklift",       label:"Forklift Cert",          section:"safety", type:"checkbox"},
  { id:"scaffold",       label:"Scaffold Training",      section:"safety", type:"checkbox"},
  { id:"confined",       label:"Confined Space",         section:"safety", type:"checkbox"},
  { id:"fallProt",       label:"Fall Protection",        section:"safety", type:"checkbox"},
  { id:"ppeConfirm",     label:"PPE Confirmation",       section:"ppe",    type:"checkbox"},
  { id:"safetyAck",      label:"Safety Acknowledgment",  section:"ppe",    type:"checkbox"},
  { id:"drugAck",        label:"Drug/Alcohol Policy",    section:"ppe",    type:"checkbox"},
  { id:"signature",      label:"Digital Signature",      section:"ppe",    type:"signature"},
];

export const DEFAULT_FIELDS = [
  "firstName","lastName","phone","trade","employer",
  "supervisor","oshaCard","ppeConfirm","safetyAck","drugAck","signature",
];

export const TRADES = [
  "Boilermaker","Bricklayer/Mason","Carpenter","Cement Mason","Electrician",
  "Equipment Operator","Glazier","Ironworker","Laborer","Millwright",
  "Painter","Pipefitter","Plumber","Roofer","Sheet Metal Worker",
  "Sprinkler Fitter","Welder","Other",
];

export const YEARS_EXP = ["< 1 year","1–3 years","3–5 years","5–10 years","10+ years"];

export const SITE_TYPES = [
  "Commercial","Healthcare","Industrial","Education",
  "Government","Mixed-Use","Data Center","Other",
];

// ─── Seed data ────────────────────────────────────────────────────────────────
const mkCfg = (p: Partial<FormConfig> = {}): FormConfig => ({
  enabledFields: [...DEFAULT_FIELDS],
  customTradeOptions: [],
  extraCerts: [],
  requireCertUpload: false,
  ...p,
});

export const SEED_SITES: Site[] = [
  {
    id:"s1", name:"One Light Street", location:"Baltimore, MD",
    address:"1 Light St, Baltimore MD 21202", type:"Commercial",
    manager:"John Callahan", projectNo:"WT-2024-0412", active:true, created:"2024-09-15",
    formConfig: mkCfg({
      enabledFields: [...DEFAULT_FIELDS,"emergencyName","emergencyPhone","yearsExp","firstAid","siteSafety","fallProt"],
      extraCerts: ["Powder Actuated Tools","Aerial Lift"],
    }),
  },
  {
    id:"s2", name:"MedStar Pavilion", location:"Washington, DC",
    address:"3800 Reservoir Rd NW, DC 20007", type:"Healthcare",
    manager:"Maria Santos", projectNo:"WT-2025-0102", active:true, created:"2025-01-10",
    formConfig: mkCfg({
      enabledFields: [...DEFAULT_FIELDS,"emergencyName","emergencyPhone","forklift","confined"],
      customTradeOptions: ["Medical Gas Tech","Clean Room Specialist"],
      requireCertUpload: true,
    }),
  },
  {
    id:"s3", name:"Harbor East Tower", location:"Baltimore, MD",
    address:"1001 Aliceanna St, Baltimore MD 21202", type:"Mixed-Use",
    manager:"Robert Chen", projectNo:"WT-2024-0581", active:true, created:"2024-11-01",
    formConfig: mkCfg(),
  },
  {
    id:"s4", name:"AWS Data Center", location:"Ashburn, VA",
    address:"21055 Ashburn Crossing Dr, VA 20147", type:"Data Center",
    manager:"Diane Patel", projectNo:"WT-2024-0218", active:false, created:"2024-07-22",
    formConfig: mkCfg({
      enabledFields: [...DEFAULT_FIELDS,"confined","siteSafety"],
      customTradeOptions: ["Data Center Tech","Cable Installer"],
      extraCerts: ["Security Clearance","Clean Room Cert"],
      requireCertUpload: true,
    }),
  },
];

export const SEED_WORKERS: WorkerSubmission[] = [
  { id:"w1", workerId:"JS412-101", siteId:"s1", site:"One Light Street",  submittedAt:new Date().toISOString(), checkIn:"06:52", firstName:"Marcus",  lastName:"Williams",  phone:"4105550192", trade:"Ironworker",  employer:"Chesapeake Steel LLC",   supervisor:"Tim Boyle",   emergencyName:"",emergencyPhone:"",yearsExp:"",oshaCard:"30",firstAid:false,siteSafety:false,forklift:false,scaffold:false,confined:false,fallProt:false,extraCerts:{},ppeConfirm:true,safetyAck:true,drugAck:true,signature:"Marcus Williams" },
  { id:"w2", workerId:"JS412-102", siteId:"s1", site:"One Light Street",  submittedAt:new Date().toISOString(), checkIn:"07:14", firstName:"Darnell", lastName:"Thompson",  phone:"4435550884", trade:"Carpenter",   employer:"Mid-Atlantic Carpentry", supervisor:"Frank Russo", emergencyName:"",emergencyPhone:"",yearsExp:"",oshaCard:"10",firstAid:false,siteSafety:false,forklift:false,scaffold:false,confined:false,fallProt:false,extraCerts:{},ppeConfirm:true,safetyAck:true,drugAck:true,signature:"Darnell Thompson" },
  { id:"w3", workerId:"JS102-101", siteId:"s2", site:"MedStar Pavilion",  submittedAt:new Date().toISOString(), checkIn:"07:05", firstName:"Rosa",    lastName:"Gutierrez", phone:"4105551234", trade:"Electrician", employer:"Bay Electric Co.",        supervisor:"Steve Larkin",emergencyName:"",emergencyPhone:"",yearsExp:"",oshaCard:"30",firstAid:false,siteSafety:false,forklift:false,scaffold:false,confined:false,fallProt:false,extraCerts:{},ppeConfirm:true,safetyAck:true,drugAck:true,signature:"Rosa Gutierrez" },
  { id:"w4", workerId:"JS581-101", siteId:"s3", site:"Harbor East Tower", submittedAt:new Date().toISOString(), checkIn:"07:38", firstName:"Kevin",   lastName:"Hart",      phone:"3015559021", trade:"Plumber",     employer:"Capitol Plumbing",        supervisor:"Dana Mills",  emergencyName:"",emergencyPhone:"",yearsExp:"",oshaCard:"10",firstAid:false,siteSafety:false,forklift:false,scaffold:false,confined:false,fallProt:false,extraCerts:{},ppeConfirm:true,safetyAck:true,drugAck:true,signature:"Kevin Hart" },
];

export const SEED_HC: HeadcountRow[] = [
  { id:"h1", siteId:"s1", site:"One Light Street",  contractorName:"Chesapeake Steel LLC",   workerName:"Marcus Williams",  date:"2026-03-12", day:"Wednesday", checkIn:"06:52", checkOut:"16:10" },
  { id:"h2", siteId:"s1", site:"One Light Street",  contractorName:"Mid-Atlantic Carpentry", workerName:"Darnell Thompson", date:"2026-03-12", day:"Wednesday", checkIn:"07:14", checkOut:"16:30" },
  { id:"h3", siteId:"s2", site:"MedStar Pavilion",  contractorName:"Bay Electric Co.",       workerName:"Rosa Gutierrez",   date:"2026-03-12", day:"Wednesday", checkIn:"07:05", checkOut:"15:55" },
  { id:"h4", siteId:"s3", site:"Harbor East Tower", contractorName:"Capitol Plumbing",       workerName:"Kevin Hart",       date:"2026-03-12", day:"Wednesday", checkIn:"07:38", checkOut:"" },
];

// ─── BLE Employee seed data ───────────────────────────────────────────────────
export type BLEStatus = "active" | "absent" | "offsite";

export type AttendanceMethod = "ble_hardware" | "ble_manual" | "qr_scan";

export interface BLEEmployee {
  id:        string;
  name:      string;
  role:      string;
  dept:      string;
  site:      string;
  siteId:    string;
  badgeId:   string;
  status:    BLEStatus;
  checkIn:   string | null;
  checkOut:  string | null;
  method:    AttendanceMethod;  // how they checked in
}

// The 3 check-in methods used by WT:
// 1. ble_hardware  — badge automatically detected by BLE hardware reader at site entrance
// 2. ble_manual    — employee manually taps badge to a tablet/kiosk
// 3. qr_scan       — supervisor manually scans worker's QR on phone (fallback)

export const SEED_BLE: BLEEmployee[] = [
  { id:"e1", name:"Kevin O'Brien",   role:"Project Superintendent", dept:"Field Operations", site:"One Light Street",  siteId:"s1", badgeId:"BLE-4412", status:"active",  checkIn:"06:48", checkOut:null,  method:"ble_hardware" },
  { id:"e2", name:"Lisa Huang",      role:"Safety Manager",         dept:"Safety",           site:"One Light Street",  siteId:"s1", badgeId:"BLE-4413", status:"active",  checkIn:"07:02", checkOut:null,  method:"ble_hardware" },
  { id:"e3", name:"Derek Mason",     role:"Project Engineer",       dept:"Engineering",      site:"One Light Street",  siteId:"s1", badgeId:"BLE-4490", status:"active",  checkIn:"07:30", checkOut:null,  method:"ble_manual"   },
  { id:"e4", name:"Angela Foster",   role:"Field Engineer",         dept:"Engineering",      site:"MedStar Pavilion",  siteId:"s2", badgeId:"BLE-4491", status:"absent",  checkIn:null,    checkOut:null,  method:"ble_hardware" },
  { id:"e5", name:"James Whitfield", role:"MEP Coordinator",        dept:"MEP",              site:"MedStar Pavilion",  siteId:"s2", badgeId:"BLE-4560", status:"active",  checkIn:"07:15", checkOut:null,  method:"ble_hardware" },
  { id:"e6", name:"Sandra Lee",      role:"QC Manager",             dept:"Quality Control",  site:"MedStar Pavilion",  siteId:"s2", badgeId:"BLE-4561", status:"offsite", checkIn:"06:55", checkOut:"10:30", method:"ble_manual" },
  { id:"e7", name:"Tom Rodriguez",   role:"Site Superintendent",    dept:"Field Operations", site:"Harbor East Tower", siteId:"s3", badgeId:"BLE-4601", status:"active",  checkIn:"06:40", checkOut:null,  method:"ble_hardware" },
  { id:"e8", name:"Maria Chen",      role:"Project Manager",        dept:"Management",       site:"Harbor East Tower", siteId:"s3", badgeId:"BLE-4602", status:"active",  checkIn:"08:05", checkOut:null,  method:"qr_scan"      },
  { id:"e9", name:"David Park",      role:"Safety Coordinator",     dept:"Safety",           site:"Harbor East Tower", siteId:"s3", badgeId:"BLE-4603", status:"absent",  checkIn:null,    checkOut:null,  method:"ble_hardware" },
];
