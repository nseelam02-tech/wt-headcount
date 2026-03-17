import {
  Box, Card, CardContent, Typography, Chip, Tabs, Tab,
  Table, TableBody, TableCell, TableHead, TableRow,
  Avatar, Tooltip,
} from "@mui/material";
import BluetoothIcon         from "@mui/icons-material/Bluetooth";
import BluetoothConnectedIcon from "@mui/icons-material/BluetoothConnected";
import TabletIcon             from "@mui/icons-material/Tablet";
import QrCodeScannerIcon      from "@mui/icons-material/QrCodeScanner";
import CheckCircleIcon        from "@mui/icons-material/CheckCircle";
import CancelIcon             from "@mui/icons-material/Cancel";
import AirportShuttleIcon     from "@mui/icons-material/AirportShuttle";
import { useState }           from "react";
import type { BLEEmployee }   from "../types";
import type { Site }          from "../types";
import { ORANGE }             from "../utils/constants";

// ─── Method labels & icons ───────────────────────────────────────────────────
const METHOD_META = {
  ble_hardware: {
    label: "Hardware Auto",
    desc:  "Badge automatically detected by BLE reader at site entrance",
    icon:  <BluetoothConnectedIcon sx={{ fontSize:16 }} />,
    color: "#2E7D32",
    bg:    "rgba(46,125,50,0.08)",
  },
  ble_manual: {
    label: "Manual Tap",
    desc:  "Employee taps badge to tablet / kiosk at site office",
    icon:  <TabletIcon sx={{ fontSize:16 }} />,
    color: "#1565C0",
    bg:    "rgba(21,101,192,0.08)",
  },
  qr_scan: {
    label: "QR Scan",
    desc:  "Supervisor scans worker QR code on phone (fallback)",
    icon:  <QrCodeScannerIcon sx={{ fontSize:16 }} />,
    color: ORANGE,
    bg:    "rgba(232,89,12,0.08)",
  },
} as const;

const STATUS_META = {
  active:  { label:"On Site",  color:"success" as const, icon:<CheckCircleIcon sx={{ fontSize:14 }} /> },
  absent:  { label:"Absent",   color:"error"   as const, icon:<CancelIcon sx={{ fontSize:14 }} /> },
  offsite: { label:"Off Site", color:"warning" as const, icon:<AirportShuttleIcon sx={{ fontSize:14 }} /> },
};

interface Props {
  bleEmployees: BLEEmployee[];
  sites:        Site[];
}

// ─── Method pill ─────────────────────────────────────────────────────────────
function MethodBadge({ method }: { method: BLEEmployee["method"] }) {
  const m = METHOD_META[method];
  return (
    <Tooltip title={m.desc} arrow>
      <Box sx={{ display:"inline-flex", alignItems:"center", gap:0.5, px:1, py:0.3, borderRadius:1, bgcolor:m.bg, color:m.color, fontSize:11, fontWeight:600, cursor:"default", whiteSpace:"nowrap" }}>
        {m.icon}
        <span>{m.label}</span>
      </Box>
    </Tooltip>
  );
}

// ─── Employee card (grid view) ───────────────────────────────────────────────
function EmployeeCard({ emp }: { emp: BLEEmployee }) {
  const st = STATUS_META[emp.status];
  return (
    <Card sx={{
      border: `1px solid ${emp.status === "active" ? "rgba(46,125,50,0.25)" : "#E8E8E8"}`,
      bgcolor: emp.status === "active" ? "rgba(46,125,50,0.03)" : "#fff",
      height: "100%",
    }}>
      <CardContent sx={{ p:2, "&:last-child":{ pb:2 } }}>
        {/* Avatar + status */}
        <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", mb:1.5 }}>
          <Avatar sx={{ width:40, height:40, bgcolor: emp.status==="active" ? "#2E7D32" : "#CCC", fontSize:15, fontWeight:700 }}>
            {emp.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
          </Avatar>
          <Chip
            icon={st.icon}
            label={st.label}
            size="small"
            color={st.color}
            sx={{ fontSize:10, height:22 }}
          />
        </Box>

        {/* Name + role */}
        <Typography variant="body2" fontWeight={700} noWrap>{emp.name}</Typography>
        <Typography variant="caption" color="text.secondary" noWrap sx={{ display:"block" }}>{emp.role}</Typography>
        <Typography variant="caption" color="text.disabled" noWrap sx={{ display:"block", mb:1.5 }}>{emp.dept}</Typography>

        {/* Check-in time */}
        <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", mb:1 }}>
          <Typography variant="caption" color="text.secondary">Check-in</Typography>
          <Typography variant="caption" sx={{ fontFamily:"monospace", fontWeight:600, color: emp.checkIn ? "#2E7D32" : "#CCC" }}>
            {emp.checkIn || "—"}
          </Typography>
        </Box>

        {emp.checkOut && (
          <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", mb:1 }}>
            <Typography variant="caption" color="text.secondary">Check-out</Typography>
            <Typography variant="caption" sx={{ fontFamily:"monospace", fontWeight:600, color:ORANGE }}>
              {emp.checkOut}
            </Typography>
          </Box>
        )}

        {/* Badge ID */}
        <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", mb:1.5 }}>
          <Typography variant="caption" color="text.secondary">Badge</Typography>
          <Typography variant="caption" sx={{ fontFamily:"monospace", color:ORANGE, fontSize:10 }}>{emp.badgeId}</Typography>
        </Box>

        {/* Method */}
        <MethodBadge method={emp.method} />
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function BLEPage({ bleEmployees, sites }: Props) {
  const [tab,        setTab]        = useState(0);
  const [siteFilter, setSiteFilter] = useState("all");

  const activeSites = sites.filter(s => s.active);

  const filtered = bleEmployees.filter(e => siteFilter === "all" || e.siteId === siteFilter);

  const onSite  = filtered.filter(e => e.status === "active").length;
  const absent  = filtered.filter(e => e.status === "absent").length;
  const offsite = filtered.filter(e => e.status === "offsite").length;

  const byMethod = {
    ble_hardware: filtered.filter(e => e.method === "ble_hardware").length,
    ble_manual:   filtered.filter(e => e.method === "ble_manual").length,
    qr_scan:      filtered.filter(e => e.method === "qr_scan").length,
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb:3 }}>
        <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:0.5 }}>
          <BluetoothIcon sx={{ color: ORANGE }} />
          <Typography variant="h5" fontWeight={700}>BLE Badge Attendance</Typography>
          <Box sx={{ display:"flex", alignItems:"center", gap:0.5, ml:1, px:1.5, py:0.3, borderRadius:2, bgcolor:"rgba(46,125,50,0.1)", border:"1px solid rgba(46,125,50,0.3)" }}>
            <Box sx={{ width:7, height:7, borderRadius:"50%", bgcolor:"#2E7D32", animation:"pulse 2s infinite" }} />
            <Typography sx={{ fontSize:11, fontWeight:600, color:"#2E7D32" }}>BLE Scanning Active</Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Whiting-Turner employees — automatic attendance via Bluetooth Low Energy
        </Typography>
      </Box>

      {/* How it works — 3 method cards */}
      <Box sx={{ display:"grid", gridTemplateColumns:{ xs:"1fr", sm:"1fr 1fr 1fr" }, gap:1.5, mb:3 }}>
        {(Object.keys(METHOD_META) as BLEEmployee["method"][]).map(key => {
          const m = METHOD_META[key];
          return (
            <Card key={key} sx={{ borderTop:`3px solid ${m.color}` }}>
              <CardContent sx={{ p:2, "&:last-child":{pb:2} }}>
                <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:1 }}>
                  <Box sx={{ color:m.color }}>{m.icon}</Box>
                  <Typography variant="subtitle2" fontWeight={700} color={m.color}>{m.label}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display:"block", lineHeight:1.5, mb:1.5 }}>
                  {m.desc}
                </Typography>
                <Typography variant="h4" fontWeight={800} color={m.color}>{byMethod[key]}</Typography>
                <Typography variant="caption" color="text.secondary">employees today</Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Stats row */}
      <Box sx={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1.5, mb:3 }}>
        {[
          { label:"On Site",  value:onSite,  color:"#2E7D32" },
          { label:"Absent",   value:absent,  color:"#C62828" },
          { label:"Off Site", value:offsite, color:ORANGE    },
        ].map(s => (
          <Card key={s.label}>
            <CardContent sx={{ p:2, "&:last-child":{pb:2}, textAlign:"center" }}>
              <Typography variant="h3" fontWeight={800} color={s.color}>{s.value}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform:"uppercase", letterSpacing:0.5, fontWeight:600 }}>{s.label}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Site filter tabs */}
      <Card sx={{ mb:2 }}>
        <Tabs
          value={siteFilter}
          onChange={(_, v) => setSiteFilter(v)}
          sx={{ px:2, "& .MuiTab-root":{ minHeight:44, fontSize:13 } }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={`All Sites (${bleEmployees.length})`} value="all" />
          {activeSites.map(s => (
            <Tab
              key={s.id}
              label={`${s.name} (${bleEmployees.filter(e=>e.siteId===s.id).length})`}
              value={s.id}
            />
          ))}
        </Tabs>
      </Card>

      {/* View toggle */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb:2, "& .MuiTab-root":{ minHeight:36 } }}>
        <Tab label="Card View" />
        <Tab label="Table View" />
      </Tabs>

      {/* Card View */}
      {tab === 0 && (
        <Box sx={{ display:"grid", gridTemplateColumns:{ xs:"1fr 1fr", sm:"repeat(3,1fr)", md:"repeat(4,1fr)", lg:"repeat(5,1fr)" }, gap:1.5 }}>
          {filtered.map(emp => <EmployeeCard key={emp.id} emp={emp} />)}
          {filtered.length === 0 && (
            <Box sx={{ gridColumn:"span 5", py:6, textAlign:"center" }}>
              <Typography color="text.disabled">No employees for this site</Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Table View */}
      {tab === 1 && (
        <Card>
          <Box sx={{ overflowX:"auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["Employee","Role","Department","Site","Badge ID","Status","Check-In","Check-Out","Method"].map(h => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(emp => {
                  const st = STATUS_META[emp.status];
                  return (
                    <TableRow key={emp.id}>
                      <TableCell>
                        <Box sx={{ display:"flex", alignItems:"center", gap:1.5 }}>
                          <Avatar sx={{ width:30, height:30, bgcolor: emp.status==="active"?"#2E7D32":"#CCC", fontSize:11 }}>
                            {emp.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>{emp.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell><Typography variant="body2">{emp.role}</Typography></TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{emp.dept}</Typography></TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{emp.site}</Typography></TableCell>
                      <TableCell><Typography variant="caption" sx={{ fontFamily:"monospace", color:ORANGE }}>{emp.badgeId}</Typography></TableCell>
                      <TableCell>
                        <Chip icon={st.icon} label={st.label} size="small" color={st.color} sx={{ fontSize:10, height:22 }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily:"monospace", color: emp.checkIn?"#2E7D32":"#CCC", fontWeight:600 }}>
                          {emp.checkIn||"—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily:"monospace", color: emp.checkOut?ORANGE:"#CCC", fontWeight:600 }}>
                          {emp.checkOut||"—"}
                        </Typography>
                      </TableCell>
                      <TableCell><MethodBadge method={emp.method} /></TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign:"center", py:4, color:"text.disabled" }}>No records</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Card>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </Box>
  );
}
