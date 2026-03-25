import { useState, useCallback } from "react";
import type { Site, WorkerSubmission, HeadcountRow, DetailedHCRow, FormConfig } from "../types";
import { SEED_SITES, SEED_WORKERS, SEED_HC, SEED_BLE } from "../utils/constants";
import type { BLEEmployee } from "../types";

function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save<T>(key: string, val: T) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function localIsoDate(d: Date): string {
  const tzOffsetMs = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - tzOffsetMs).toISOString().split("T")[0];
}

export function useStore() {
  const [sites,   _setSites]   = useState<Site[]>(()             => load("wt_sites",   SEED_SITES));
  const [bleEmployees]             = useState<BLEEmployee[]>(SEED_BLE);
  const [workers, _setWorkers] = useState<WorkerSubmission[]>(()  => load("wt_workers", SEED_WORKERS));
  const [hcRows,  _setHcRows]  = useState<HeadcountRow[]>(()     => load("wt_hc",      SEED_HC));
  const [detailedRows, _setDetailedRows] = useState<DetailedHCRow[]>(() => load("wt_dhc", []));

  const setSites = useCallback((fn: Site[] | ((p: Site[]) => Site[])) => {
    _setSites(p => { const n = typeof fn === "function" ? fn(p) : fn; save("wt_sites", n); return n; });
  }, []);
  const setWorkers = useCallback((fn: WorkerSubmission[] | ((p: WorkerSubmission[]) => WorkerSubmission[])) => {
    _setWorkers(p => { const n = typeof fn === "function" ? fn(p) : fn; save("wt_workers", n); return n; });
  }, []);
  const setHcRows = useCallback((fn: HeadcountRow[] | ((p: HeadcountRow[]) => HeadcountRow[])) => {
    _setHcRows(p => { const n = typeof fn === "function" ? fn(p) : fn; save("wt_hc", n); return n; });
  }, []);
  const setDetailedRows = useCallback((fn: DetailedHCRow[] | ((p: DetailedHCRow[]) => DetailedHCRow[])) => {
    _setDetailedRows(p => { const n = typeof fn === "function" ? fn(p) : fn; save("wt_dhc", n); return n; });
  }, []);

  const addSite          = (s: Site)                          => setSites(p => [...p, s]);
  const updateSite       = (id: string, patch: Partial<Site>) => setSites(p => p.map(s => s.id === id ? { ...s, ...patch } : s));
  const deleteSite       = (id: string)                       => setSites(p => p.filter(s => s.id !== id));
  const updateFormConfig = (siteId: string, cfg: FormConfig)  => updateSite(siteId, { formConfig: cfg });
  const addHcRow         = (r: HeadcountRow)                  => setHcRows(p => [...p, r]);
  const deleteHcRow      = (id: string)                       => setHcRows(p => p.filter(r => r.id !== id));
  const addDetailedRow   = (r: DetailedHCRow)                 => setDetailedRows(p => [...p, r]);
  const deleteDetailedRow = (id: string)                      => setDetailedRows(p => p.filter(r => r.id !== id));

  // Duplicate check — match by email or by phone (>=7 digits) ignoring formatting.
  const findDuplicate = useCallback((email: string, phone: string): WorkerSubmission | null => {
    const clean = (p: string) => p.replace(/\D/g, "");
    const emailLow = email.toLowerCase().trim();
    const phoneDig = clean(phone);
    return workers.find(w =>
      (emailLow && w.email.toLowerCase().trim() === emailLow) ||
      (phoneDig.length >= 7 && clean(w.phone).length >= 7 && clean(w.phone) === phoneDig),
    ) ?? null;
  }, [workers]);
  const updateHcRow      = useCallback((id: string, patch: Partial<HeadcountRow>) => {
    setHcRows(p => p.map(r => r.id === id ? { ...r, ...patch } : r));
  }, [setHcRows]);

  // Import rows that came from Google Sheet / CSV; skips already-seen syncKeys.
  const importWorkers = useCallback((
    rows: Array<Partial<WorkerSubmission> & { syncKey: string; site?: string }>,
    currentSites: Site[],
    defaultSiteId: string,
  ): number => {
    let existingKeys: string[] = [];
    try { existingKeys = JSON.parse(localStorage.getItem("wt_sync_keys") ?? "[]"); } catch { /* */ }
    const seen = new Set(existingKeys);
    const now  = new Date();
    const newW: WorkerSubmission[] = [];
    const newH: HeadcountRow[]     = [];
    const newK: string[]           = [];

    rows.forEach((row, idx) => {
      if (seen.has(row.syncKey)) return;
      const site =
        currentSites.find(s => s.id === row.siteId) ||
        (row.site ? currentSites.find(s => s.name.toLowerCase().includes(row.site!.toLowerCase().slice(0, 6))) : undefined) ||
        currentSites.find(s => s.id === defaultSiteId) ||
        currentSites[0];
      if (!site) return;

      const submittedAt = row.submittedAt || now.toISOString();
      const num = site.projectNo.replace(/\D/g, "").slice(-3);
      const w: WorkerSubmission = {
        id: `gf${Date.now()}i${idx}`,
        workerId: `GF${num}-${Math.floor(100 + Math.random() * 900)}`,
        siteId: site.id, site: site.name,
        submittedAt,
        checkIn: row.checkIn || new Date(submittedAt).toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" }),
        firstName: row.firstName || "", lastName: row.lastName || "",
        employeeTitle: row.employeeTitle || "", phone: row.phone || "", email: row.email || "",
        photoName: "", photoDataUrl: "", primaryLanguage: row.primaryLanguage || "English",
        emergencyName: row.emergencyName || "", emergencyPhone: row.emergencyPhone || "",
        trade: row.trade || "Other", employer: row.employer || "",
        supervisor: row.supervisor || "", yearsExp: row.yearsExp || "",
        oshaCard: row.oshaCard || "none",
        firstAid:false, siteSafety:false, forklift:false, scaffold:false, confined:false, fallProt:false,
        extraCerts:{}, certifications:[],
        ppeConfirm:false, safetyAck:false, drugAck:false, signature: row.signature || "",
      };
      newW.push(w);
      newH.push({
        id: `gh${Date.now()}i${idx}`, siteId: site.id, site: site.name,
        date: localIsoDate(new Date(submittedAt)),
        contractorName: w.employer || "—",
        contractorRep: `${w.firstName} ${w.lastName}`.trim(),
        noOfWorkers: 1, hoursWorked: "8", descriptionOfWork: "",
        didAnyAccidents: "No", deliveriesReceived: "", equipmentOnSite: "", openIssues: "",
      });
      newK.push(row.syncKey);
    });

    if (newW.length > 0) {
      setWorkers(p => [...p, ...newW]);
      setHcRows(p => [...p, ...newH]);
      try { localStorage.setItem("wt_sync_keys", JSON.stringify([...existingKeys, ...newK])); } catch { /* */ }
    }
    return newW.length;
  }, [setWorkers, setHcRows]);

  const submitWorker = useCallback((
    data: Omit<WorkerSubmission, "id"|"workerId"|"submittedAt"|"checkIn"|"site">,
    site: Site,
  ): WorkerSubmission => {
    const now = new Date();
    const num = site.projectNo.replace(/\D/g, "").slice(-3);
    const w: WorkerSubmission = {
      ...data,
      id:          "w" + Date.now(),
      workerId:    `JS${num}-${Math.floor(100 + Math.random() * 900)}`,
      siteId:      site.id,
      site:        site.name,
      submittedAt: now.toISOString(),
      checkIn:     now.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" }),
    };
    setWorkers(p => [...p, w]);
    setHcRows(p => [...p, {
      id:                 "h" + Date.now(),
      siteId:             site.id,
      site:               site.name,
      date:               localIsoDate(now),
      contractorName:     data.employer || "—",
      contractorRep:      `${data.firstName} ${data.lastName}`,
      noOfWorkers:        1,
      hoursWorked:        "8",
      descriptionOfWork:  "",
      didAnyAccidents:    "No",
      deliveriesReceived: "",
      equipmentOnSite:    "",
      openIssues:         "",
    }]);
    return w;
  }, [setWorkers, setHcRows]);

  return {
    sites, workers, hcRows, detailedRows,
    addSite, updateSite, deleteSite, updateFormConfig,
    addHcRow, updateHcRow, deleteHcRow,
    addDetailedRow, deleteDetailedRow,
    submitWorker, importWorkers,
    findDuplicate,
    bleEmployees,
  };
}
