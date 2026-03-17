import { useState } from "react";
import {
  Box, Card, CardContent, Typography, Button, TextField,
  Select, MenuItem, FormControl, InputLabel, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, Alert,
  IconButton, Tooltip, FormControlLabel, Switch,
  Checkbox, FormGroup,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import AddIcon           from "@mui/icons-material/Add";
import SettingsIcon      from "@mui/icons-material/Settings";
import VisibilityIcon    from "@mui/icons-material/Visibility";
import QrCodeIcon        from "@mui/icons-material/QrCode";
import DownloadIcon      from "@mui/icons-material/Download";
import DeleteIcon        from "@mui/icons-material/Delete";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import type { Site, FormConfig, HeadcountRow, WorkerSubmission } from "../types";
import { SITE_TYPES, DEFAULT_FIELDS, BASE_FIELDS, ORANGE } from "../utils/constants";

// ─── QR Visual ───────────────────────────────────────────────────────────────
function QRVisual({ data, size = 100 }: { data: string; size?: number }) {
  const C = 21; let h = 0;
  for (let i = 0; i < data.length; i++) h = ((h << 5) - h + data.charCodeAt(i)) | 0;
  const m = Array.from({ length: C }, (_, r) =>
    Array.from({ length: C }, (_, c) => {
      if ((r < 7 && c < 7)||(r < 7 && c >= 14)||(r >= 14 && c < 7)) {
        const fr=r<7?r:r-14, fc=c<7?c:c>=14?c-14:c;
        if(fr===0||fr===6||fc===0||fc===6) return 1;
        if(fr>=2&&fr<=4&&fc>=2&&fc<=4) return 1;
        return 0;
      }
      if(r===6||c===6) return (r+c)%2===0?1:0;
      return ((h>>((r*C+c)%32))^((r*C+c)*0x9e3779b9))&1;
    })
  );
  const s = size / C;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:"block" }}>
      <rect width={size} height={size} fill="#fff"/>
      {m.map((row,r)=>row.map((v,c)=>v?<rect key={`${r}-${c}`} x={c*s} y={r*s} width={s} height={s} fill="#1A1A1A"/>:null))}
    </svg>
  );
}

// ─── QR Manager ──────────────────────────────────────────────────────────────
interface QRProps {
  sites: Site[];
  onAddSite: (s: Site) => void;
  onUpdateSite: (id: string, p: Partial<Site>) => void;
  onDeleteSite: (id: string) => void;
  onUpdateFormConfig: (siteId: string, cfg: FormConfig) => void;
  onPreview: (site: Site) => void;
}

export function QRManagerPage({ sites, onAddSite, onUpdateSite, onDeleteSite, onUpdateFormConfig, onPreview }: QRProps) {
  const [selectedId, setSelectedId] = useState(sites[0]?.id ?? "");
  const [addOpen,    setAddOpen]    = useState(false);
  const [fbOpen,     setFbOpen]     = useState(false);
  const [form, setForm] = useState({ name:"", location:"", address:"", type:"Commercial", manager:"", projectNo:"" });
  const [fErr, setFErr] = useState(false);

  const selected = sites.find(s => s.id === selectedId) ?? null;
  const qrUrl    = selected ? `wtledgerapp.com/workerorientation?jobsite=${selected.id}` : "";

  const addSite = () => {
    if (!form.name || !form.location || !form.projectNo) { setFErr(true); return; }
    const s: Site = { ...form as any, id:"s"+Date.now(), active:true, created:new Date().toISOString().split("T")[0], formConfig:{ enabledFields:[...DEFAULT_FIELDS], customTradeOptions:[], extraCerts:[], requireCertUpload:false } };
    onAddSite(s); setSelectedId(s.id);
    setForm({ name:"",location:"",address:"",type:"Commercial",manager:"",projectNo:"" });
    setFErr(false); setAddOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", mb:3, flexWrap:"wrap", gap:1 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>QR Manager</Typography>
          <Typography variant="body2" color="text.secondary">Configure QR codes and forms per site</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon/>} onClick={() => setAddOpen(true)}>Add Site</Button>
      </Box>

      {/* Site selector */}
      <Card sx={{ mb:2 }}>
        <CardContent sx={{ pb:"16px !important" }}>
          <FormControl fullWidth size="small">
            <InputLabel>Select Job Site</InputLabel>
            <Select value={selectedId} onChange={e => setSelectedId(e.target.value)} label="Select Job Site">
              {sites.map(s => <MenuItem key={s.id} value={s.id}>{s.name} — {s.location}{!s.active?" (Paused)":""}</MenuItem>)}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {selected ? (
        <Card>
          <CardContent>
            {/* Name + badges */}
            <Box sx={{ display:"flex", alignItems:"center", gap:1, flexWrap:"wrap", mb:2 }}>
              <Typography variant="h6" fontWeight={700}>{selected.name}</Typography>
              <Chip label={selected.active?"Active":"Paused"} size="small" color={selected.active?"success":"default"} />
              <Chip label={selected.type} size="small" variant="outlined" color="primary" />
            </Box>

            {/* Info + QR — stacks on mobile */}
            <Box sx={{ display:"grid", gridTemplateColumns:{ xs:"1fr", md:"1fr auto" }, gap:3, mb:2 }}>
              <Box>
                {[["Location",selected.location],["Address",selected.address],["Project #",selected.projectNo],["Manager",selected.manager||"—"],["Created",selected.created]].map(([l,v]) => (
                  <Box key={l} sx={{ display:"flex", gap:1, mb:0.75 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth:80 }}>{l}:</Typography>
                    <Typography variant="body2" fontWeight={500}>{v}</Typography>
                  </Box>
                ))}
                <Box sx={{ mt:1.5, p:1.5, bgcolor:"rgba(232,89,12,0.05)", border:"1px solid rgba(232,89,12,0.2)", borderRadius:1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform:"uppercase", letterSpacing:1, display:"block", mb:0.5 }}>Registration URL</Typography>
                  <Typography variant="caption" sx={{ fontFamily:"monospace", color:ORANGE, wordBreak:"break-all" }}>{qrUrl}</Typography>
                </Box>
              </Box>
              <Box sx={{ display:"flex", flexDirection:"column", alignItems:"center", gap:1.5 }}>
                <Box sx={{ p:1.5, border:"1px solid #E8E8E8", borderRadius:2 }}>
                  <QRVisual data={qrUrl} size={160} />
                </Box>
                <Button variant="outlined" size="small" startIcon={<DownloadIcon/>} onClick={() => {
                  const svg = document.querySelector("svg") as SVGElement;
                  if (svg) { const b=new Blob([svg.outerHTML],{type:"image/svg+xml"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=`qr-${selected.id}.svg`; a.click(); }
                }}>Download QR</Button>
              </Box>
            </Box>

            {/* Form config */}
            <Box sx={{ p:2, bgcolor:"#FAFAFA", borderRadius:2, mb:2 }}>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform:"uppercase", letterSpacing:1, display:"block", mb:1 }}>Form Configuration</Typography>
              <Box sx={{ display:"flex", gap:2, flexWrap:"wrap", mb:1 }}>
                <Typography variant="body2"><strong>{selected.formConfig.enabledFields.length}</strong> fields</Typography>
                <Typography variant="body2"><strong>{selected.formConfig.customTradeOptions.length}</strong> custom trades</Typography>
                <Typography variant="body2"><strong>{selected.formConfig.extraCerts.length}</strong> extra certs</Typography>
                {selected.formConfig.requireCertUpload && <Chip label="Cert Upload Required" size="small" color="warning" sx={{ height:20, fontSize:10 }} />}
              </Box>
              <Box sx={{ display:"flex", flexWrap:"wrap", gap:0.5 }}>
                {selected.formConfig.customTradeOptions.map(t=><Chip key={t} label={t} size="small" variant="outlined" color="primary" sx={{ fontSize:11 }} />)}
                {selected.formConfig.extraCerts.map(c=><Chip key={c} label={c} size="small" variant="outlined" color="success" sx={{ fontSize:11 }} />)}
              </Box>
            </Box>

            {/* Actions — 2x2 grid */}
            <Box sx={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1 }}>
              <Button variant="outlined" startIcon={<SettingsIcon/>} onClick={() => setFbOpen(true)}>Configure Form</Button>
              <Button variant="contained" startIcon={<VisibilityIcon/>} onClick={() => onPreview(selected)}>Preview Form</Button>
              <Button variant="outlined" color={selected.active?"warning":"success"} onClick={() => onUpdateSite(selected.id, { active:!selected.active })}>
                {selected.active?"Pause Site":"Enable Site"}
              </Button>
              <Button variant="outlined" color="error" startIcon={<DeleteIcon/>}
                onClick={() => { if(confirm(`Delete "${selected.name}"?`)) { onDeleteSite(selected.id); setSelectedId(sites.find(s=>s.id!==selected.id)?.id??""); } }}>
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card><CardContent sx={{ textAlign:"center", py:5 }}>
          <QrCodeIcon sx={{ fontSize:48, color:"text.disabled", mb:1 }} />
          <Typography color="text.secondary">Select a site or add a new one</Typography>
        </CardContent></Card>
      )}

      {/* Add Site Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Job Site</DialogTitle>
        <DialogContent sx={{ pt:"8px !important" }}>
          {fErr && <Alert severity="error" sx={{ mb:2 }}>Name, City/State, and Project # are required.</Alert>}
          <Box sx={{ display:"grid", gridTemplateColumns:{ xs:"1fr", sm:"1fr 1fr" }, gap:2, mt:0.5 }}>
            <TextField label="Site / Project Name *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} />
            <TextField label="Project Number *" value={form.projectNo} onChange={e=>setForm(p=>({...p,projectNo:e.target.value}))} placeholder="WT-2025-0412" />
            <TextField label="City, State *" value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))} placeholder="Baltimore, MD" />
            <TextField label="Site Manager" value={form.manager} onChange={e=>setForm(p=>({...p,manager:e.target.value}))} />
            <Box sx={{ gridColumn:"span 2" }}>
              <TextField label="Full Address" value={form.address} onChange={e=>setForm(p=>({...p,address:e.target.value}))} fullWidth />
            </Box>
            <FormControl size="small" fullWidth>
              <InputLabel>Site Type</InputLabel>
              <Select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} label="Site Type">
                {SITE_TYPES.map(t=><MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:2.5 }}>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={addSite}>Create Site</Button>
        </DialogActions>
      </Dialog>

      {selected && fbOpen && (
        <FormBuilderDialog site={selected} onSave={cfg => { onUpdateFormConfig(selected.id,cfg); setFbOpen(false); }} onClose={() => setFbOpen(false)} />
      )}
    </Box>
  );
}

// ─── Form Builder Dialog ──────────────────────────────────────────────────────
function FormBuilderDialog({ site, onSave, onClose }: { site: Site; onSave:(cfg:FormConfig)=>void; onClose:()=>void }) {
  const [cfg, setCfg] = useState<FormConfig>(JSON.parse(JSON.stringify(site.formConfig)));
  const [newTrade, setNewTrade] = useState("");
  const [newCert,  setNewCert]  = useState("");

  const toggle = (id: string) => {
    if (BASE_FIELDS.find(f=>f.id===id)?.locked) return;
    setCfg(c=>({ ...c, enabledFields: c.enabledFields.includes(id) ? c.enabledFields.filter(x=>x!==id) : [...c.enabledFields,id] }));
  };

  const addTrade = () => { if(!newTrade.trim()) return; setCfg(c=>({...c,customTradeOptions:[...c.customTradeOptions,newTrade.trim()]})); setNewTrade(""); };
  const addCert  = () => { if(!newCert.trim())  return; setCfg(c=>({...c,extraCerts:[...c.extraCerts,newCert.trim()]})); setNewCert(""); };

  const sections = [
    { label:"Basic Info",     fields:BASE_FIELDS.filter(f=>f.section==="basic")  },
    { label:"Safety Certs",   fields:BASE_FIELDS.filter(f=>f.section==="safety") },
    { label:"PPE & Sign-off", fields:BASE_FIELDS.filter(f=>f.section==="ppe")    },
  ];

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Configure Form — {site.name}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display:"grid", gridTemplateColumns:{ xs:"1fr", md:"1fr 1fr" }, gap:3 }}>
          {/* Left — field toggles */}
          <Box>
            {sections.map(sec => (
              <Box key={sec.label} sx={{ mb:2.5 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform:"uppercase", letterSpacing:1, display:"block", mb:1 }}>{sec.label}</Typography>
                <FormGroup>
                  {sec.fields.map(field => (
                    <FormControlLabel key={field.id}
                      control={<Checkbox checked={cfg.enabledFields.includes(field.id)} onChange={()=>toggle(field.id)} disabled={field.locked} size="small" />}
                      label={
                        <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
                          <Typography variant="body2">{field.label}</Typography>
                          {field.locked && <Chip label="Always on" size="small" sx={{ height:16, fontSize:9 }} />}
                        </Box>
                      }
                    />
                  ))}
                </FormGroup>
              </Box>
            ))}
          </Box>

          {/* Right — custom options */}
          <Box>
            <Box sx={{ mb:3 }}>
              <Typography variant="subtitle2" mb={1}>Site-Specific Trades</Typography>
              <Box sx={{ display:"flex", gap:1, mb:1 }}>
                <TextField size="small" value={newTrade} onChange={e=>setNewTrade(e.target.value)} placeholder="e.g. Clean Room Specialist" onKeyDown={e=>e.key==="Enter"&&addTrade()} sx={{ flex:1 }} />
                <Button variant="outlined" size="small" onClick={addTrade}>Add</Button>
              </Box>
              <Box sx={{ display:"flex", flexWrap:"wrap", gap:0.5 }}>
                {cfg.customTradeOptions.map(t=><Chip key={t} label={t} size="small" onDelete={()=>setCfg(c=>({...c,customTradeOptions:c.customTradeOptions.filter(x=>x!==t)}))} color="primary" variant="outlined" />)}
                {cfg.customTradeOptions.length===0 && <Typography variant="caption" color="text.disabled">None added</Typography>}
              </Box>
            </Box>

            <Box sx={{ mb:3 }}>
              <Typography variant="subtitle2" mb={1}>Site-Specific Certifications</Typography>
              <Box sx={{ display:"flex", gap:1, mb:1 }}>
                <TextField size="small" value={newCert} onChange={e=>setNewCert(e.target.value)} placeholder="e.g. Security Clearance" onKeyDown={e=>e.key==="Enter"&&addCert()} sx={{ flex:1 }} />
                <Button variant="outlined" size="small" onClick={addCert}>Add</Button>
              </Box>
              <Box sx={{ display:"flex", flexWrap:"wrap", gap:0.5 }}>
                {cfg.extraCerts.map(c=><Chip key={c} label={c} size="small" onDelete={()=>setCfg(x=>({...x,extraCerts:x.extraCerts.filter(y=>y!==c)}))} color="success" variant="outlined" />)}
                {cfg.extraCerts.length===0 && <Typography variant="caption" color="text.disabled">None added</Typography>}
              </Box>
            </Box>

            <FormControlLabel
              control={<Switch checked={cfg.requireCertUpload} onChange={e=>setCfg(c=>({...c,requireCertUpload:e.target.checked}))} color="primary" />}
              label={<Typography variant="body2">Require certificate submission notice</Typography>}
            />

            <Box sx={{ mt:2.5, p:2, bgcolor:"#1A1A1A", borderRadius:2 }}>
              <Typography variant="caption" fontWeight={700} sx={{ color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:1, display:"block", mb:1 }}>Summary</Typography>
              <Typography variant="body2" sx={{ color:"#fff" }}>
                {cfg.enabledFields.length} fields · {cfg.customTradeOptions.length} trades · {cfg.extraCerts.length} certs
              </Typography>
              {cfg.requireCertUpload && <Typography variant="caption" color="warning.light" sx={{ display:"block", mt:0.5 }}>⚠ Cert upload notice enabled</Typography>}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px:3, pb:2.5 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(cfg)}>Save Configuration</Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Scan QR Page ─────────────────────────────────────────────────────────────
interface ScanProps { sites: Site[]; onSiteSelected: (site: Site) => void }

export function ScanQRPage({ sites, onSiteSelected }: ScanProps) {
  const [scanned,  setScanned]  = useState<Site|null>(null);
  const [scanning, setScanning] = useState(false);

  const simulate = (site: Site) => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setScanned(site); }, 800);
  };

  return (
    <Box sx={{ maxWidth:560, mx:"auto" }}>
      <Box sx={{ mb:3 }}>
        <Typography variant="h5" fontWeight={700}>Scan QR Code</Typography>
        <Typography variant="body2" color="text.secondary">Tap a site below to simulate scanning</Typography>
      </Box>

      {/* Viewfinder */}
      <Card sx={{ mb:2, borderLeft:`4px solid ${ORANGE}` }}>
        <CardContent sx={{ display:"flex", alignItems:"center", gap:2.5 }}>
          <Box sx={{ width:72, height:72, border:`2px solid ${ORANGE}`, borderRadius:1, display:"flex", alignItems:"center", justifyContent:"center", bgcolor:"#FAFAFA", flexShrink:0 }}>
            {scanning
              ? <Box sx={{ width:28, height:28, borderRadius:"50%", border:`3px solid ${ORANGE}`, borderTopColor:"transparent", animation:"spin .7s linear infinite" }} />
              : <QrCodeScannerIcon sx={{ fontSize:32, color:ORANGE }} />
            }
          </Box>
          <Box sx={{ flex:1 }}>
            <Typography variant="subtitle2" fontWeight={600}>{scanning?"Scanning…":"Camera Scanner"}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize:12 }}>
              In production this opens your device camera. Select a site below to simulate.
            </Typography>
          </Box>
          {scanning && <Chip label="Scanning" size="small" color="primary" />}
        </CardContent>
      </Card>

      {/* Scanned result */}
      {scanned && (
        <Card sx={{ mb:2, borderLeft:"4px solid #2E7D32" }}>
          <CardContent sx={{ display:"flex", alignItems:"center", gap:2 }}>
            <Box sx={{ fontSize:22 }}>✅</Box>
            <Box sx={{ flex:1 }}>
              <Typography variant="subtitle2" fontWeight={600} color="success.main">Scanned — {scanned.name}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily:"monospace" }}>?jobsite={scanned.id}</Typography>
            </Box>
            <Button variant="contained" size="small" onClick={() => onSiteSelected(scanned)}>Open Form</Button>
          </CardContent>
        </Card>
      )}

      {/* Active sites list */}
      <Card>
        <Box sx={{ px:2.5, py:1.5, bgcolor:ORANGE, borderRadius:"12px 12px 0 0", display:"flex", justifyContent:"space-between" }}>
          <Typography variant="caption" fontWeight={700} sx={{ color:"#fff", textTransform:"uppercase", letterSpacing:1 }}>Active Sites</Typography>
          <Typography variant="caption" sx={{ color:"rgba(255,255,255,0.7)" }}>{sites.filter(s=>s.active).length} sites</Typography>
        </Box>
        {sites.filter(s=>s.active).map((site,i) => (
          <Box key={site.id} sx={{ px:2, py:1.5, borderBottom:i<sites.filter(s=>s.active).length-1?"1px solid #F0F0F0":"none", display:"flex", alignItems:"center", gap:1.5, bgcolor:scanned?.id===site.id?"rgba(232,89,12,0.04)":"#fff" }}>
            <Box sx={{ border:"1px solid #F0F0F0", p:0.5, borderRadius:1, flexShrink:0 }}>
              <QRVisual data={`wtledgerapp.com/workerorientation?jobsite=${site.id}`} size={42} />
            </Box>
            <Box sx={{ flex:1, minWidth:0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>{site.name}</Typography>
              <Typography variant="caption" color="text.secondary">{site.location} · {site.projectNo}</Typography>
            </Box>
            <Button variant="contained" size="small" color={scanned?.id===site.id?"success":"primary"} onClick={() => simulate(site)} sx={{ flexShrink:0, minWidth:60 }}>
              {scanned?.id===site.id?"✓":"Scan"}
            </Button>
          </Box>
        ))}
        {sites.filter(s=>s.active).length===0 && (
          <Box sx={{ py:4, textAlign:"center" }}><Typography color="text.disabled">No active sites</Typography></Box>
        )}
      </Card>
    </Box>
  );
}

// ─── Headcount Page ───────────────────────────────────────────────────────────
interface HeadcountProps { sites:Site[]; hcRows:HeadcountRow[]; onDelete:(id:string)=>void; onAdd:(r:HeadcountRow)=>void }
const DAYS_LIST = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export function HeadcountPage({ sites, hcRows, onDelete, onAdd }: HeadcountProps) {
  const [filterSite, setFilterSite] = useState("");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [addOpen,    setAddOpen]    = useState(false);
  const [row, setRow] = useState({ siteId:"", contractorName:"", workerName:"", date:new Date().toISOString().split("T")[0], checkIn:"", checkOut:"" });

  const rows = hcRows.filter(r => (!filterSite||r.siteId===filterSite)&&(!filterDate||r.date===filterDate));

  const addRow = () => {
    if(!row.siteId||!row.workerName||!row.contractorName) return;
    const s = sites.find(x=>x.id===row.siteId);
    const d = new Date(row.date+"T12:00");
    onAdd({ ...row, id:"h"+Date.now(), site:s?.name||"", day:DAYS_LIST[d.getDay()] });
    setRow({ siteId:"", contractorName:"", workerName:"", date:new Date().toISOString().split("T")[0], checkIn:"", checkOut:"" });
    setAddOpen(false);
  };

  const columns: GridColDef[] = [
    { field:"site",           headerName:"Job Site",   flex:1.5, minWidth:120 },
    { field:"contractorName", headerName:"Contractor", flex:1.5, minWidth:120 },
    { field:"workerName",     headerName:"Worker",     flex:1.5, minWidth:120 },
    { field:"date",           headerName:"Date",       flex:1,   minWidth:95  },
    { field:"day",            headerName:"Day",        flex:0.8, minWidth:75  },
    { field:"checkIn",  headerName:"In",  flex:0.7, minWidth:70, renderCell: p => <Typography sx={{ fontFamily:"monospace", fontSize:13, color:"#2E7D32", fontWeight:600 }}>{p.value||"—"}</Typography> },
    { field:"checkOut", headerName:"Out", flex:0.7, minWidth:70, renderCell: p => <Typography sx={{ fontFamily:"monospace", fontSize:13, color:p.value?ORANGE:"#CCC", fontWeight:600 }}>{p.value||"—"}</Typography> },
    { field:"id", headerName:"", width:48, sortable:false, renderCell: p => (
      <Tooltip title="Remove">
        <IconButton size="small" onClick={()=>onDelete(p.row.id)} sx={{ color:"#DDD","&:hover":{color:"#C62828"} }}>
          <DeleteIcon fontSize="small"/>
        </IconButton>
      </Tooltip>
    )},
  ];

  return (
    <Box>
      <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", mb:3, flexWrap:"wrap", gap:1 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Capture Headcount</Typography>
          <Typography variant="body2" color="text.secondary">Auto-populated from QR registrations</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon/>} onClick={()=>setAddOpen(true)}>Add Row</Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb:2 }}>
        <CardContent sx={{ pb:"16px !important" }}>
          <Box sx={{ display:"grid", gridTemplateColumns:{ xs:"1fr", sm:"1fr 1fr 1fr auto" }, gap:2, alignItems:"center" }}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Site</InputLabel>
              <Select value={filterSite} onChange={e=>setFilterSite(e.target.value)} label="Filter by Site">
                <MenuItem value="">All Sites</MenuItem>
                {sites.map(s=><MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField type="date" label="Filter by Date" value={filterDate} onChange={e=>setFilterDate(e.target.value)} size="small" InputLabelProps={{ shrink:true }} />
            <Button variant="outlined" onClick={()=>{setFilterSite("");setFilterDate("");}}>Clear</Button>
            <Typography variant="h6" fontWeight={700} color="primary" sx={{ whiteSpace:"nowrap" }}>{rows.length} workers</Typography>
          </Box>
        </CardContent>
      </Card>

      <DataGrid
        rows={rows} columns={columns} autoHeight
        pageSizeOptions={[25,50,100]}
        initialState={{ pagination:{ paginationModel:{ pageSize:25 } } }}
        sx={{ bgcolor:"#fff", border:"1px solid #E8E8E8", borderRadius:3 }}
        slots={{ noRowsOverlay: () => (
          <Box sx={{ py:6, textAlign:"center" }}>
            <Typography color="text.disabled">No entries. QR registrations auto-appear here.</Typography>
          </Box>
        )}}
      />

      <Box sx={{ mt:1.5, display:"flex", gap:1 }}>
        <Button variant="outlined" size="small">Export CSV</Button>
        <Button variant="outlined" size="small">Export Excel</Button>
      </Box>

      <Dialog open={addOpen} onClose={()=>setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Headcount Entry</DialogTitle>
        <DialogContent sx={{ pt:"8px !important" }}>
          <Box sx={{ display:"grid", gridTemplateColumns:{ xs:"1fr", sm:"1fr 1fr" }, gap:2, mt:0.5 }}>
            <Box sx={{ gridColumn:"span 2" }}>
              <FormControl fullWidth size="small">
                <InputLabel>Job Site *</InputLabel>
                <Select value={row.siteId} onChange={e=>setRow(p=>({...p,siteId:e.target.value}))} label="Job Site *">
                  {sites.map(s=><MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <TextField label="Contractor *" value={row.contractorName} onChange={e=>setRow(p=>({...p,contractorName:e.target.value}))} />
            <TextField label="Worker Name *" value={row.workerName} onChange={e=>setRow(p=>({...p,workerName:e.target.value}))} />
            <TextField type="date" label="Date" value={row.date} onChange={e=>setRow(p=>({...p,date:e.target.value}))} InputLabelProps={{shrink:true}} />
            <Box /> {/* spacer */}
            <TextField type="time" label="Check-In" value={row.checkIn} onChange={e=>setRow(p=>({...p,checkIn:e.target.value}))} InputLabelProps={{shrink:true}} />
            <TextField type="time" label="Check-Out" value={row.checkOut} onChange={e=>setRow(p=>({...p,checkOut:e.target.value}))} InputLabelProps={{shrink:true}} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:2.5 }}>
          <Button onClick={()=>setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={addRow}>Add Entry</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ─── Log Page ─────────────────────────────────────────────────────────────────
export function LogPage({ workers }: { workers: WorkerSubmission[] }) {
  const [q, setQ] = useState("");
  const filtered = workers.filter(w => {
    const s = q.toLowerCase();
    return !s || `${w.firstName} ${w.lastName} ${w.trade} ${w.employer} ${w.site}`.toLowerCase().includes(s);
  });

  const columns: GridColDef[] = [
    { field:"fullName", headerName:"Worker", flex:1.5, minWidth:140,
      valueGetter: (_val: unknown, row: WorkerSubmission) => `${row.firstName} ${row.lastName}`,
      renderCell: p => (
        <Box>
          <Typography variant="body2" fontWeight={600}>{p.value}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily:"monospace" }}>{p.row.workerId}</Typography>
        </Box>
      )
    },
    { field:"trade",    headerName:"Trade",    flex:1,   minWidth:110, renderCell: p=><Chip label={p.value} size="small" color="primary" variant="outlined" sx={{ fontSize:11 }} /> },
    { field:"employer", headerName:"Employer", flex:1.5, minWidth:130 },
    { field:"site",     headerName:"Site",     flex:1.5, minWidth:130 },
    { field:"oshaCard", headerName:"OSHA",     flex:0.8, minWidth:75,  renderCell: p=><Chip label={`OSHA ${p.value}`} size="small" color={p.value==="none"?"default":"success"} sx={{ fontSize:10 }} /> },
    { field:"checkIn",  headerName:"In",       flex:0.7, minWidth:70,  renderCell: p=><Typography sx={{ fontFamily:"monospace", fontSize:13 }}>{p.value}</Typography> },
  ];

  return (
    <Box>
      <Box sx={{ mb:3 }}>
        <Typography variant="h5" fontWeight={700}>Submissions Log</Typography>
        <Typography variant="body2" color="text.secondary">All QR-registered workers</Typography>
      </Box>
      <Card sx={{ mb:2 }}>
        <CardContent sx={{ pb:"16px !important", display:"flex", alignItems:"center", gap:2 }}>
          <TextField placeholder="Search name, trade, employer, site…" value={q} onChange={e=>setQ(e.target.value)} size="small" sx={{ flex:1, maxWidth:400 }} />
          <Typography variant="h6" fontWeight={700} color="primary">{filtered.length} records</Typography>
        </CardContent>
      </Card>
      <DataGrid
        rows={filtered.slice().reverse()} columns={columns} autoHeight rowHeight={56}
        pageSizeOptions={[25,50,100]}
        initialState={{ pagination:{ paginationModel:{ pageSize:25 } } }}
        sx={{ bgcolor:"#fff", border:"1px solid #E8E8E8", borderRadius:3 }}
        getRowId={row => row.id}
        slots={{ noRowsOverlay: () => (
          <Box sx={{ py:6, textAlign:"center" }}>
            <Typography color="text.disabled">No records found</Typography>
          </Box>
        )}}
      />
    </Box>
  );
}
