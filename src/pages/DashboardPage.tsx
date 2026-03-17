import {
  Box, Card, CardContent, Typography, Chip,
  Table, TableBody, TableCell, TableHead, TableRow,
  LinearProgress,
} from "@mui/material";
import PeopleIcon     from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { Site, WorkerSubmission } from "../types";
import { ORANGE } from "../utils/constants";

import type { BLEEmployee } from "../types";
interface Props { sites: Site[]; workers: WorkerSubmission[]; bleEmployees?: BLEEmployee[] }

function StatCard({ label, value, sub, accent }: { label:string; value:number|string; sub:string; accent?:boolean }) {
  return (
    <Card sx={{ borderTop:`3px solid ${accent?ORANGE:"#E8E8E8"}` }}>
      <CardContent sx={{ p:2.5 }}>
        <Typography variant="h3" fontWeight={800} color={accent?"primary":"text.primary"} lineHeight={1}>{value}</Typography>
        <Typography variant="body2" fontWeight={600} sx={{ mt:1, textTransform:"uppercase", letterSpacing:0.5, fontSize:11 }}>{label}</Typography>
        <Typography variant="caption" color="text.secondary">{sub}</Typography>
      </CardContent>
    </Card>
  );
}

export function DashboardPage({ sites, workers, bleEmployees = [] }: Props) {
  const bleActive = bleEmployees.filter(e => e.status === "active").length;
  const activeSites = sites.filter(s => s.active).length;
  const tradeCounts = workers.reduce<Record<string,number>>((a,w) => ({ ...a, [w.trade]:(a[w.trade]||0)+1 }), {});
  const maxTrade    = Math.max(...Object.values(tradeCounts), 1);

  return (
    <Box>
      <Box sx={{ mb:3 }}>
        <Typography variant="h5" fontWeight={700}>Live Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date().toLocaleDateString("en-US",{ weekday:"long", month:"long", day:"numeric", year:"numeric" })}
        </Typography>
      </Box>

      {/* Stats — 2 cols mobile, 4 cols desktop */}
      <Box sx={{ display:"grid", gridTemplateColumns:{ xs:"1fr 1fr", md:"repeat(4,1fr)" }, gap:2, mb:3 }}>
        <StatCard accent label="Total On Site"  value={workers.length + bleActive} sub={`${workers.length} QR + ${bleActive} BLE`} />
        <StatCard label="Active Sites"   value={activeSites}    sub={`of ${sites.length} total`} />
        <StatCard label="Checked In"     value={workers.length} sub="Since 6:00 AM" />
        <StatCard label="Checked Out"    value={0}              sub="End of day" />
      </Box>

      {/* Two col — stacks on mobile */}
      <Box sx={{ display:"grid", gridTemplateColumns:{ xs:"1fr", md:"1.5fr 1fr" }, gap:2, mb:3 }}>
        {/* Headcount by site */}
        <Card>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>Headcount by Site</Typography>
            {sites.map(s => {
              const count = workers.filter(w=>w.siteId===s.id).length;
              const pct   = workers.length > 0 ? (count/workers.length)*100 : 0;
              return (
                <Box key={s.id} sx={{ mb:2.5 }}>
                  <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", mb:0.5 }}>
                    <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
                      <LocationOnIcon sx={{ fontSize:14, color:"text.secondary" }} />
                      <Typography variant="body2" fontWeight={500}>{s.name}</Typography>
                      {!s.active && <Chip label="Paused" size="small" sx={{ height:18, fontSize:10 }} />}
                    </Box>
                    <Typography variant="h6" fontWeight={700} color="primary">{count}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={pct} sx={{ height:6, borderRadius:3, bgcolor:"#F0F0F0", "& .MuiLinearProgress-bar":{ bgcolor:ORANGE, borderRadius:3 } }} />
                  <Typography variant="caption" color="text.secondary">{s.location}</Typography>
                </Box>
              );
            })}
            {workers.length===0 && <Typography variant="body2" color="text.disabled" sx={{ py:2, textAlign:"center" }}>No registrations yet today</Typography>}
          </CardContent>
        </Card>

        {/* Trade breakdown */}
        <Card>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>Trade Breakdown</Typography>
            {Object.keys(tradeCounts).length===0 ? (
              <Typography variant="body2" color="text.disabled" sx={{ py:2, textAlign:"center" }}>No data yet</Typography>
            ) : (
              Object.entries(tradeCounts).sort((a,b)=>b[1]-a[1]).map(([trade,n]) => (
                <Box key={trade} sx={{ mb:1.5 }}>
                  <Box sx={{ display:"flex", justifyContent:"space-between", mb:0.5 }}>
                    <Typography variant="body2">{trade}</Typography>
                    <Typography variant="body2" fontWeight={600}>{n}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={(n/maxTrade)*100} sx={{ height:4, borderRadius:2, bgcolor:"#F0F0F0", "& .MuiLinearProgress-bar":{ bgcolor:ORANGE } }} />
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Registrations table */}
      <Card>
        <CardContent sx={{ p:0 }}>
          <Box sx={{ p:2, borderBottom:"1px solid #F0F0F0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <Typography variant="subtitle1" fontWeight={600}>Today's Registrations</Typography>
            <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
              <PeopleIcon sx={{ fontSize:16, color:"text.secondary" }} />
              <Typography variant="body2" color="text.secondary">{workers.length} workers</Typography>
            </Box>
          </Box>
          <Box sx={{ overflowX:"auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["Worker","Trade","Site","Employer","OSHA","Check-In"].map(h=>(
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {workers.slice().reverse().map(w => (
                  <TableRow key={w.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{w.firstName} {w.lastName}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily:"monospace" }}>{w.workerId}</Typography>
                    </TableCell>
                    <TableCell><Chip label={w.trade} size="small" color="primary" variant="outlined" sx={{ fontSize:11 }} /></TableCell>
                    <TableCell><Typography variant="body2">{w.site}</Typography></TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{w.employer}</Typography></TableCell>
                    <TableCell><Chip label={`OSHA ${w.oshaCard}`} size="small" color={w.oshaCard==="none"?"default":"success"} sx={{ fontSize:10 }} /></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontFamily:"monospace" }}>{w.checkIn}</Typography></TableCell>
                  </TableRow>
                ))}
                {workers.length===0 && (
                  <TableRow><TableCell colSpan={6} sx={{ textAlign:"center", py:4, color:"text.disabled" }}>No registrations yet today</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
