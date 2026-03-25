import type { FieldDef, Site, WorkerSubmission, HeadcountRow, FormConfig } from "../types";

// ─── Brand ────────────────────────────────────────────────────────────────────
export const ORANGE = "#E8590C";
export const DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// ─── Field definitions ────────────────────────────────────────────────────────
export const BASE_FIELDS: FieldDef[] = [
  { id:"firstName",      label:"First Name",             section:"basic",  type:"text",      locked:true },
  { id:"lastName",       label:"Last Name",              section:"basic",  type:"text",      locked:true },
  { id:"employeeTitle",  label:"Employee Title",         section:"basic",  type:"text"  },
  { id:"phone",          label:"Mobile Phone",           section:"basic",  type:"tel"   },
  { id:"email",          label:"Employee Email",         section:"basic",  type:"email" },
  { id:"photo",          label:"Employee Photo",         section:"basic",  type:"file"  },
  { id:"primaryLanguage",label:"Primary Language",       section:"basic",  type:"text"  },
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
  "firstName","lastName","employeeTitle","phone","email","photo","primaryLanguage","trade","employer",
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

export const GENERIC_FORM_CONFIG: FormConfig = mkCfg({
  enabledFields: BASE_FIELDS.map(field => field.id),
  customTradeOptions: [],
  extraCerts: [],
  requireCertUpload: false,
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
  { id:"w1", workerId:"JS412-101", siteId:"s1", site:"One Light Street",  submittedAt:new Date().toISOString(), checkIn:"06:52", firstName:"Marcus",  lastName:"Williams",  employeeTitle:"Journeyman", phone:"4105550192", email:"marcus.williams@example.com", photoName:"", photoDataUrl:"", primaryLanguage:"English", trade:"Ironworker",  employer:"Chesapeake Steel LLC",   supervisor:"Tim Boyle",   emergencyName:"",emergencyPhone:"",yearsExp:"",oshaCard:"30",firstAid:false,siteSafety:false,forklift:false,scaffold:false,confined:false,fallProt:false,extraCerts:{},certifications:[],ppeConfirm:true,safetyAck:true,drugAck:true,signature:"Marcus Williams" },
  { id:"w2", workerId:"JS412-102", siteId:"s1", site:"One Light Street",  submittedAt:new Date().toISOString(), checkIn:"07:14", firstName:"Darnell", lastName:"Thompson",  employeeTitle:"Foreman", phone:"4435550884", email:"darnell.thompson@example.com", photoName:"", photoDataUrl:"", primaryLanguage:"English", trade:"Carpenter",   employer:"Mid-Atlantic Carpentry", supervisor:"Frank Russo", emergencyName:"",emergencyPhone:"",yearsExp:"",oshaCard:"10",firstAid:false,siteSafety:false,forklift:false,scaffold:false,confined:false,fallProt:false,extraCerts:{},certifications:[],ppeConfirm:true,safetyAck:true,drugAck:true,signature:"Darnell Thompson" },
  { id:"w3", workerId:"JS102-101", siteId:"s2", site:"MedStar Pavilion",  submittedAt:new Date().toISOString(), checkIn:"07:05", firstName:"Rosa",    lastName:"Gutierrez", employeeTitle:"Electrician", phone:"4105551234", email:"rosa.gutierrez@example.com", photoName:"", photoDataUrl:"", primaryLanguage:"Spanish", trade:"Electrician", employer:"Bay Electric Co.",        supervisor:"Steve Larkin",emergencyName:"",emergencyPhone:"",yearsExp:"",oshaCard:"30",firstAid:false,siteSafety:false,forklift:false,scaffold:false,confined:false,fallProt:false,extraCerts:{},certifications:[],ppeConfirm:true,safetyAck:true,drugAck:true,signature:"Rosa Gutierrez" },
  { id:"w4", workerId:"JS581-101", siteId:"s3", site:"Harbor East Tower", submittedAt:new Date().toISOString(), checkIn:"07:38", firstName:"Kevin",   lastName:"Hart",      employeeTitle:"Apprentice", phone:"3015559021", email:"kevin.hart@example.com", photoName:"", photoDataUrl:"", primaryLanguage:"English", trade:"Plumber",     employer:"Capitol Plumbing",        supervisor:"Dana Mills",  emergencyName:"",emergencyPhone:"",yearsExp:"",oshaCard:"10",firstAid:false,siteSafety:false,forklift:false,scaffold:false,confined:false,fallProt:false,extraCerts:{},certifications:[],ppeConfirm:true,safetyAck:true,drugAck:true,signature:"Kevin Hart" },
];

export const SEED_HC: HeadcountRow[] = [
  // ── One Light Street ─────────────────────────────────────────────────────────
  { id:"h1",  siteId:"s1", site:"One Light Street",  date:"2026-03-24", contractorName:"Maryland Mechanical Systems", contractorRep:"Phil Hoffman",    noOfWorkers:6, hoursWorked:"6-2",        descriptionOfWork:"Temporary chiller water make-up connection",             didAnyAccidents:"No", deliveriesReceived:"Temporary chiller material",      equipmentOnSite:"Tools",             openIssues:"Waiting on materials to start" },
  { id:"h2",  siteId:"s1", site:"One Light Street",  date:"2026-03-24", contractorName:"Maryland Mechanical Systems", contractorRep:"Phil Hoffman",    noOfWorkers:6, hoursWorked:"6-2",        descriptionOfWork:"Temporary chiller connection to building AHU",           didAnyAccidents:"No", deliveriesReceived:"Temp chiller material",           equipmentOnSite:"Forklift",          openIssues:"None" },
  { id:"h3",  siteId:"s1", site:"One Light Street",  date:"2026-03-24", contractorName:"Maryland Mechanical Systems", contractorRep:"Phil Hoffman",    noOfWorkers:5, hoursWorked:"6-2",        descriptionOfWork:"Filled, load tested, drain ice water, remove pipe",      didAnyAccidents:"No", deliveriesReceived:"6\" victaulic caps, 8\" tee",     equipmentOnSite:"Forklift",          openIssues:"None" },
  { id:"h4",  siteId:"s1", site:"One Light Street",  date:"2026-03-24", contractorName:"Windsor Electric",           contractorRep:"Brian Miller",    noOfWorkers:3, hoursWorked:"8",           descriptionOfWork:"Conduit for DP panel and branch circuit",                didAnyAccidents:"No", deliveriesReceived:"No",                              equipmentOnSite:"None",              openIssues:"None" },
  { id:"h5",  siteId:"s1", site:"One Light Street",  date:"2026-03-24", contractorName:"Windsor Electric",           contractorRep:"Brian Miller",    noOfWorkers:3, hoursWorked:"8",           descriptionOfWork:"Pipe for DP panel",                                      didAnyAccidents:"No", deliveriesReceived:"No",                              equipmentOnSite:"None",              openIssues:"None" },
  { id:"h6",  siteId:"s1", site:"One Light Street",  date:"2026-03-24", contractorName:"Bfpe",                       contractorRep:"Mark Rzepkowski", noOfWorkers:1, hoursWorked:"7",           descriptionOfWork:"Re run new 4\" main for No. 3 fire pump",                didAnyAccidents:"No", deliveriesReceived:"None",                            equipmentOnSite:"Threading machine", openIssues:"None" },
  // ── MedStar Pavilion ─────────────────────────────────────────────────────────
  { id:"h7",  siteId:"s2", site:"MedStar Pavilion",  date:"2026-03-24", contractorName:"Maryland Mechanical Systems", contractorRep:"Phil Hoffman",    noOfWorkers:6, hoursWorked:"6-2",        descriptionOfWork:"Drain glycol, demo pipe, hang new tee",                  didAnyAccidents:"No", deliveriesReceived:"Pre fab tie-in piping",           equipmentOnSite:"Forklift",          openIssues:"Sprinkler pipe removal" },
  { id:"h8",  siteId:"s2", site:"MedStar Pavilion",  date:"2026-03-24", contractorName:"Windsor Electric",           contractorRep:"Brian Miller",    noOfWorkers:6, hoursWorked:"8-Hour Day", descriptionOfWork:"Set-up and pull 1 LE primary feeder wire",               didAnyAccidents:"No", deliveriesReceived:"None",                            equipmentOnSite:"None",              openIssues:"None" },
  { id:"h9",  siteId:"s2", site:"MedStar Pavilion",  date:"2026-03-24", contractorName:"Windsor Electric",           contractorRep:"Brian Miller",    noOfWorkers:6, hoursWorked:"8-Hour Day", descriptionOfWork:"Prepping SWGR for feeder terminations",                  didAnyAccidents:"No", deliveriesReceived:"None",                            equipmentOnSite:"None",              openIssues:"None" },
  { id:"h10", siteId:"s2", site:"MedStar Pavilion",  date:"2026-03-24", contractorName:"Maryland Mechanical Systems", contractorRep:"Phil Hoffman",    noOfWorkers:6, hoursWorked:"6-2",        descriptionOfWork:"Butterfly valve installs, tacked fabricated pipe in 4a, 4b", didAnyAccidents:"No", deliveriesReceived:"Butterfly valves",             equipmentOnSite:"Forklift",          openIssues:"Sprinkler pipe removal" },
  // ── Harbor East Tower ────────────────────────────────────────────────────────
  { id:"h11", siteId:"s3", site:"Harbor East Tower", date:"2026-03-24", contractorName:"Maryland Mechanical Systems", contractorRep:"Phil Hoffman",    noOfWorkers:6, hoursWorked:"6-2",        descriptionOfWork:"Panel DP-CMP-100 integration, tacked fabricated pipe",   didAnyAccidents:"No", deliveriesReceived:"None",                            equipmentOnSite:"Forklift",          openIssues:"None" },
  { id:"h12", siteId:"s3", site:"Harbor East Tower", date:"2026-03-24", contractorName:"Windsor Electric",           contractorRep:"Brian Miller",    noOfWorkers:6, hoursWorked:"8-Hour Day", descriptionOfWork:"Start terminating Panel No. 4 feeders",                  didAnyAccidents:"No", deliveriesReceived:"None",                            equipmentOnSite:"None",              openIssues:"None" },
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
