import { useState, useEffect } from "react";
import {
  Box, AppBar, Toolbar, IconButton, Typography, Drawer,
  List, ListItemButton, ListItemIcon, ListItemText, Divider,
  Avatar, BottomNavigation, BottomNavigationAction, Paper,
  useMediaQuery, useTheme,
} from "@mui/material";
import MenuIcon          from "@mui/icons-material/Menu";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import GridOnIcon        from "@mui/icons-material/GridOn";
import DashboardIcon     from "@mui/icons-material/Dashboard";
import QrCode2Icon       from "@mui/icons-material/QrCode2";
import BluetoothIcon      from "@mui/icons-material/Bluetooth";
import ListAltIcon       from "@mui/icons-material/ListAlt";
import LogoutIcon        from "@mui/icons-material/Logout";
import type { AdminTab, Site, WorkerSubmission, HeadcountRow, FormConfig, BLEEmployee } from "../types";
import { ORANGE } from "../utils/constants";

const DRAWER_WIDTH = 240;

interface NavItem { id: AdminTab; label: string;  icon: React.ReactElement }
const NAV_ITEMS: NavItem[] = [
  { id:"scan",      label:"Scan QR",    icon:<QrCodeScannerIcon /> },
  { id:"headcount", label:"Headcount",  icon:<GridOnIcon />        },
  { id:"dashboard", label:"Dashboard",  icon:<DashboardIcon />     },
  { id:"qrManager", label:"QR Manager", icon:<QrCode2Icon />       },
  { id:"log",       label:"Workers",    icon:<ListAltIcon />       },
  { id:"ble",       label:"BLE Badges",  icon:<BluetoothIcon />     },
];

interface Props {
  sites:    Site[];
  workers:  WorkerSubmission[];
  hcRows:   HeadcountRow[];
  onAddSite:          (s: Site) => void;
  onUpdateSite:       (id: string, p: Partial<Site>) => void;
  onDeleteSite:       (id: string) => void;
  onUpdateFormConfig: (siteId: string, cfg: FormConfig) => void;
  onAddHcRow:         (r: HeadcountRow) => void;
  onDeleteHcRow:      (id: string) => void;
  bleEmployees:       BLEEmployee[];
  onPreview:          (site: Site) => void;
  onLogout:           () => void;
  // page components passed in
  renderPage: (tab: AdminTab) => React.ReactNode;
}

export function AdminLayout({ onLogout, renderPage, bleEmployees: _ble }: Props) {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tab,       setTab]       = useState<AdminTab>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [now,       setNow]       = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleNav = (id: AdminTab) => {
    setTab(id);
    setMobileOpen(false);
  };

  const activeLabel = NAV_ITEMS.find(n => n.id === tab)?.label ?? "Dashboard";

  const DrawerContent = () => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#1A1A1A" }}>
      {/* Brand */}
      <Box sx={{ p: 2.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ bgcolor: ORANGE, width: 36, height: 36, fontSize: 11, fontWeight: 700 }}>HC</Avatar>
          <Box>
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1 }}>
              Head Count
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: 10, mt: 0.3 }}>
              Whiting-Turner
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Live counter */}
      <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${ORANGE}` }}>
        <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", mb: 0.5 }}>
          On Site Now
        </Typography>
        <Typography sx={{ color: "#fff", fontSize: 36, fontWeight: 800, lineHeight: 1 }}>
          —
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: 11, mt: 0.5, fontFamily: "monospace" }}>
          {now.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", second:"2-digit" })}
        </Typography>
      </Box>

      {/* Nav */}
      <List sx={{ flex: 1, pt: 1 }}>
        {NAV_ITEMS.map(item => (
          <ListItemButton
            key={item.id}
            selected={tab === item.id}
            onClick={() => handleNav(item.id)}
            sx={{
              mx: 1, mb: 0.5, borderRadius: 2,
              "&.Mui-selected": {
                bgcolor: ORANGE,
                "& .MuiListItemIcon-root": { color: "#fff" },
                "& .MuiListItemText-primary": { color: "#fff", fontWeight: 600 },
                "&:hover": { bgcolor: "#C44800" },
              },
              "& .MuiListItemIcon-root": { color: "rgba(255,255,255,0.4)", minWidth: 38 },
              "& .MuiListItemText-primary": { color: "rgba(255,255,255,0.7)", fontSize: 14 },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      {/* Sign out */}
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <List>
        <ListItemButton onClick={onLogout} sx={{ mx: 1, mb: 1, borderRadius: 2, "& .MuiListItemIcon-root": { color: "rgba(255,255,255,0.4)", minWidth: 38 }, "& .MuiListItemText-primary": { color: "rgba(255,255,255,0.4)", fontSize: 14 } }}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100dvh", overflow: "hidden" }}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, flexShrink: 0, "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }}>
          <DrawerContent />
        </Drawer>
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}>
          <DrawerContent />
        </Drawer>
      )}

      {/* Main */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <AppBar position="static" color="primary">
          <Toolbar sx={{ minHeight: 56 }}>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 32, height: 32, fontSize: 10, fontWeight: 700, mr: 1.5, border: "1.5px solid rgba(255,255,255,0.6)" }}>HC</Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 16, flexGrow: 1 }}>{activeLabel}</Typography>
            <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "monospace", display: { xs:"none", sm:"block" } }}>
              {now.toLocaleTimeString()}
            </Typography>
            <Box sx={{ ml: 2, textAlign: "right", display: { xs:"none", md:"block" } }}>
              <Typography sx={{ fontWeight: 800, fontSize: 16, lineHeight: 1, letterSpacing: 2, color: "#fff" }}>WT</Typography>
              <Typography sx={{ fontSize: 7, color: "rgba(255,255,255,0.7)", letterSpacing: 2 }}>WHITING-TURNER</Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box
          sx={{
            flex: 1, overflowY: "auto", p: { xs: 2, md: 3 },
            pb: isMobile ? "70px" : 3,
            bgcolor: "background.default",
          }}
        >
          {renderPage(tab)}
        </Box>

        {/* Mobile bottom nav */}
        {isMobile && (
          <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, borderTop: `2px solid ${ORANGE}`, borderRadius: 0 }} elevation={0}>
            <BottomNavigation value={tab} onChange={(_, v) => setTab(v)} showLabels sx={{ bgcolor: "#1A1A1A", height: 60 }}>
              {NAV_ITEMS.slice(0, 5).map(item => (
                <BottomNavigationAction
                  key={item.id} label={item.label} value={item.id} icon={item.icon}
                  sx={{
                    color: "rgba(255,255,255,0.4)", fontSize: 10, minWidth: 0,
                    "&.Mui-selected": { color: ORANGE },
                    "& .MuiBottomNavigationAction-label": { fontSize: "9px !important" },
                  }}
                />
              ))}
            </BottomNavigation>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
