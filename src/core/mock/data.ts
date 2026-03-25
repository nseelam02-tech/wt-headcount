import type { AppUser, Project, Contractor, HeadcountEvent } from "../types";

const now = new Date();
const iso = now.toISOString();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

export const mockUser: AppUser = {
  id: "u-001",
  name: "Alexa Morris",
  email: "alexa.morris@wt.local",
  role: "wt_employee",
  projectAccessIds: [
    "p-100", "p-100-1", "p-100-2", "p-100-3",
    "p-200", "p-200-1", "p-200-2",
  ],
};

export const mockProjects: Project[] = [
  // ── Harbor Point Tower (parent + 3 sub-sites) ─────────────────────
  { id: "p-100",     name: "Harbor Point Tower",                   projectNo: "WT-100",     cmicCode: "018466",     location: "Baltimore, MD",     status: "active" },
  { id: "p-100-1",  name: "Harbor Point Tower — Structural",       projectNo: "WT-100.100", cmicCode: "018466.100", parentCode: "018466", location: "Baltimore, MD",     status: "active" },
  { id: "p-100-2",  name: "Harbor Point Tower — MEP",              projectNo: "WT-100.200", cmicCode: "018466.200", parentCode: "018466", location: "Baltimore, MD",     status: "active" },
  { id: "p-100-3",  name: "Harbor Point Tower — Fit-Out",          projectNo: "WT-100.300", cmicCode: "018466.300", parentCode: "018466", location: "Baltimore, MD",     status: "inactive" },

  // ── Northbridge Medical (parent + 2 sub-sites) ────────────────────
  { id: "p-200",    name: "Northbridge Medical Center",            projectNo: "WT-200",     cmicCode: "019120",     location: "Annapolis, MD",    status: "active" },
  { id: "p-200-1",  name: "Northbridge Medical — Core & Shell",    projectNo: "WT-200.100", cmicCode: "019120.100", parentCode: "019120", location: "Annapolis, MD",    status: "active" },
  { id: "p-200-2",  name: "Northbridge Medical — Laboratory",     projectNo: "WT-200.200", cmicCode: "019120.200", parentCode: "019120", location: "Annapolis, MD",    status: "active" },

  // ── Riverside Labs (inactive, no sub-sites) ───────────────────────
  { id: "p-300",    name: "Riverside Labs",                        projectNo: "WT-300",     cmicCode: "019875",     location: "Silver Spring, MD", status: "inactive" },

  // ── Chesapeake Bridge Rehab (parent + 2 sub-sites) ────────────────
  { id: "p-400",    name: "Chesapeake Bridge Rehabilitation",      projectNo: "WT-400",     cmicCode: "020341",     location: "Annapolis, MD",    status: "active" },
  { id: "p-400-1",  name: "Chesapeake Bridge — Northbound",        projectNo: "WT-400.100", cmicCode: "020341.100", parentCode: "020341", location: "Annapolis, MD",    status: "active" },
  { id: "p-400-2",  name: "Chesapeake Bridge — Southbound",        projectNo: "WT-400.200", cmicCode: "020341.200", parentCode: "020341", location: "Annapolis, MD",    status: "inactive" },
];

/** Projects accessible by the mock user (parent + all its sub-sites) */
export const mockUserProjectIds = [
  "p-100", "p-100-1", "p-100-2", "p-100-3",
  "p-200", "p-200-1", "p-200-2",
];

export const mockContractors: Contractor[] = [
  { id: "c-01", name: "Apex Concrete",        code: "AC-101" },
  { id: "c-02", name: "BlueSteel Framing",     code: "BS-204" },
  { id: "c-03", name: "Delta Electrical",      code: "DE-312" },
  { id: "c-04", name: "Prime Mechanical",      code: "PM-445" },
  { id: "c-05", name: "Summit Roofing",        code: "SR-501" },
  { id: "c-06", name: "Keystone Masonry",      code: "KM-618" },
  { id: "c-07", name: "Redwood Carpentry",     code: "RC-703" },
  { id: "c-08", name: "Horizon Plumbing",      code: "HP-822" },
  { id: "c-09", name: "Ironclad Steel",        code: "IS-915" },
  { id: "c-10", name: "Clearview Glazing",     code: "CG-1002" },
  { id: "c-11", name: "Terracota Flooring",    code: "TF-1103" },
  { id: "c-12", name: "NovaTech HVAC",         code: "NH-1201" },
];

export const projectContractors: Record<string, string[]> = {
  "p-100":   ["c-01", "c-02", "c-03"],
  "p-100-1": ["c-01", "c-09"],
  "p-100-2": ["c-03", "c-08", "c-12"],
  "p-100-3": ["c-07", "c-10", "c-11"],
  "p-200":   ["c-02", "c-04"],
  "p-200-1": ["c-02", "c-06"],
  "p-200-2": ["c-04", "c-08"],
};

export const mockHeadcountEvents: HeadcountEvent[] = [
  { id: "e-1", projectId: "p-100", contractorId: "c-01", source: "MANUAL", count: 26, at: iso },
  { id: "e-2", projectId: "p-100", contractorId: "c-02", source: "QR", count: 14, at: iso },
  { id: "e-3", projectId: "p-100", contractorId: "c-03", source: "BLE", count: 8, at: iso },
  { id: "e-4", projectId: "p-100", contractorId: "c-01", source: "QR", count: 3, at: yesterday },
  { id: "e-5", projectId: "p-200", contractorId: "c-02", source: "MANUAL", count: 12, at: iso },
  { id: "e-6", projectId: "p-200", contractorId: "c-04", source: "BLE", count: 10, at: iso },
];
