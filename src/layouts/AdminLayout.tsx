import { useState, useEffect } from "react";
import {
  Box, AppBar, Toolbar, IconButton, Typography, Drawer,
  List, ListItemButton, ListItemIcon, ListItemText, Divider,
  BottomNavigation, BottomNavigationAction, Paper,
  useMediaQuery, useTheme,
} from "@mui/material";
import MenuIcon          from "@mui/icons-material/Menu";
import GridOnIcon        from "@mui/icons-material/GridOn";
import DashboardIcon     from "@mui/icons-material/Dashboard";
import QrCode2Icon       from "@mui/icons-material/QrCode2";
import StorageIcon       from "@mui/icons-material/Storage";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon        from "@mui/icons-material/Logout";
import type { AdminTab, Site, WorkerSubmission, HeadcountRow } from "../types";
import { ORANGE } from "../utils/constants";

const DRAWER_WIDTH = 240;
const COLLAPSED_DRAWER_WIDTH = 76;

interface NavItem { id: AdminTab; label: string;  icon: React.ReactElement }
const ALL_NAV_ITEMS: NavItem[] = [
  { id:"dashboard", label:"Dashboard",  icon:<DashboardIcon />     },
  { id:"headcount", label:"Headcount",  icon:<GridOnIcon />        },
  { id:"qrManager", label:"Onboarding",   icon:<QrCode2Icon />       },
  { id:"cmic",      label:"CMIC Data",  icon:<StorageIcon />       },
  { id:"access",    label:"Access",      icon:<ManageAccountsIcon /> },
];

interface Props {
  allowedTabs:       AdminTab[];
  defaultTab?:       AdminTab;
  roleLabel:         string;
  sites:    Site[];
  workers:  WorkerSubmission[];
  hcRows:   HeadcountRow[];
  onAddSite:          (s: Site) => void;
  onUpdateSite:       (id: string, p: Partial<Site>) => void;
  onDeleteSite:       (id: string) => void;
  onAddHcRow:         (r: HeadcountRow) => void;
  onDeleteHcRow:      (id: string) => void;
  onLogout:           () => void;
  // page components passed in
  renderPage: (tab: AdminTab) => React.ReactNode;
}

export function AdminLayout({ allowedTabs, defaultTab, roleLabel, onLogout, renderPage }: Props) {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tab,       setTab]       = useState<AdminTab>(defaultTab ?? allowedTabs[0] ?? "dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [now,       setNow]       = useState(new Date());
  const navItems = ALL_NAV_ITEMS.filter(item => allowedTabs.includes(item.id));
  const drawerWidth = isMobile ? DRAWER_WIDTH : (desktopCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleNav = (id: AdminTab) => {
    setTab(id);
    setMobileOpen(false);
  };

  const activeTab = navItems.some(n => n.id === tab) ? tab : (navItems[0]?.id ?? "dashboard");
  const activeLabel = navItems.find(n => n.id === activeTab)?.label ?? "Dashboard";

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#1A1A1A" }}>
      {/* Sidebar top controls */}
      <Box sx={{ p: 1, borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: desktopCollapsed ? "center" : "space-between" }}>
        <IconButton
          size="small"
          sx={{ color: "rgba(255,255,255,0.8)" }}
          onClick={() => {
            if (isMobile) {
              setMobileOpen(false);
            } else {
              setDesktopCollapsed(prev => !prev);
            }
          }}
        >
          <MenuIcon />
        </IconButton>
        {!desktopCollapsed && (
          <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600 }}>
            {roleLabel}
          </Typography>
        )}
      </Box>

      {/* Nav */}
      <List sx={{ flex: 1, pt: 1.5 }}>
        {navItems.map(item => (
          <ListItemButton
            key={item.id}
            selected={activeTab === item.id}
            onClick={() => handleNav(item.id)}
            sx={{
              mx: 1, mb: 0.5, borderRadius: 2,
              justifyContent: desktopCollapsed ? "center" : "flex-start",
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
            {!desktopCollapsed && <ListItemText primary={item.label} />}
          </ListItemButton>
        ))}
      </List>

      {/* Sign out */}
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <List>
        <ListItemButton onClick={onLogout} sx={{ mx: 1, mb: 1, borderRadius: 2, justifyContent: desktopCollapsed ? "center" : "flex-start", "& .MuiListItemIcon-root": { color: "rgba(255,255,255,0.4)", minWidth: 38 }, "& .MuiListItemText-primary": { color: "rgba(255,255,255,0.4)", fontSize: 14 } }}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          {!desktopCollapsed && <ListItemText primary="Sign Out" />}
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100dvh", overflow: "hidden" }}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
              overflowX: "hidden",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}>
          {drawerContent}
        </Drawer>
      )}

      {/* Main */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <AppBar position="static" color="primary">
          <Toolbar sx={{ minHeight: 56 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
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
          {renderPage(activeTab)}
        </Box>

        {/* Mobile bottom nav */}
        {isMobile && navItems.length > 0 && (
          <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, borderTop: `2px solid ${ORANGE}`, borderRadius: 0 }} elevation={0}>
            <BottomNavigation value={activeTab} onChange={(_, v) => setTab(v)} showLabels sx={{ bgcolor: "#1A1A1A", height: 60 }}>
              {navItems.slice(0, 5).map(item => (
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
