import { useState, useCallback } from "react";
import type { Site, WorkerSubmission, HeadcountRow, FormConfig } from "../types";
import { SEED_SITES, SEED_WORKERS, SEED_HC, SEED_BLE, DAYS } from "../utils/constants";
import type { BLEEmployee } from "../types";

function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save<T>(key: string, val: T) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export function useStore() {
  const [sites,   _setSites]   = useState<Site[]>(()             => load("wt_sites",   SEED_SITES));
  const [bleEmployees]             = useState<BLEEmployee[]>(SEED_BLE);
  const [workers, _setWorkers] = useState<WorkerSubmission[]>(()  => load("wt_workers", SEED_WORKERS));
  const [hcRows,  _setHcRows]  = useState<HeadcountRow[]>(()     => load("wt_hc",      SEED_HC));

  const setSites = useCallback((fn: Site[] | ((p: Site[]) => Site[])) => {
    _setSites(p => { const n = typeof fn === "function" ? fn(p) : fn; save("wt_sites", n); return n; });
  }, []);
  const setWorkers = useCallback((fn: WorkerSubmission[] | ((p: WorkerSubmission[]) => WorkerSubmission[])) => {
    _setWorkers(p => { const n = typeof fn === "function" ? fn(p) : fn; save("wt_workers", n); return n; });
  }, []);
  const setHcRows = useCallback((fn: HeadcountRow[] | ((p: HeadcountRow[]) => HeadcountRow[])) => {
    _setHcRows(p => { const n = typeof fn === "function" ? fn(p) : fn; save("wt_hc", n); return n; });
  }, []);

  const addSite          = (s: Site)                      => setSites(p  => [...p, s]);
  const updateSite       = (id: string, patch: Partial<Site>) => setSites(p => p.map(s => s.id === id ? { ...s, ...patch } : s));
  const deleteSite       = (id: string)                   => setSites(p  => p.filter(s => s.id !== id));
  const updateFormConfig = (siteId: string, cfg: FormConfig) => updateSite(siteId, { formConfig: cfg });
  const addHcRow         = (r: HeadcountRow)              => setHcRows(p => [...p, r]);
  const deleteHcRow      = (id: string)                   => setHcRows(p => p.filter(r => r.id !== id));

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
      id:             "h" + Date.now(),
      siteId:         site.id,
      site:           site.name,
      contractorName: data.employer || "—",
      workerName:     `${data.firstName} ${data.lastName}`,
      date:           now.toISOString().split("T")[0],
      day:            DAYS[now.getDay()],
      checkIn:        w.checkIn,
      checkOut:       "",
    }]);
    return w;
  }, [setWorkers, setHcRows]);

  return {
    sites, workers, hcRows,
    addSite, updateSite, deleteSite, updateFormConfig,
    addHcRow, deleteHcRow,
    submitWorker,
    bleEmployees,
  };
}
