import { useState, type ReactNode } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppState } from "../core/state/AppState";

const DRAWER_WIDTH = 280;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, selectedProject, logout, goToProjectSelection, goToScreen } = useAppState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const userInitials = user
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "";

  type NavItem = { label: string; onClick: () => void; icon: ReactNode; danger?: boolean };
  const navItems: NavItem[] = user
    ? [
        {
          label: selectedProject ? `Project: ${selectedProject.cmicCode}` : "Select Project",
          onClick: goToProjectSelection,
          icon: <FolderSpecialIcon />,
        },
        ...(selectedProject
          ? [
              {
                label: "Flow Overview",
                onClick: () => goToScreen("flow-overview"),
                icon: <AccountTreeIcon />,
              },
              {
                label: "Dashboard",
                onClick: () => goToScreen("dashboard"),
                icon: <DashboardIcon />,
              },
            ]
          : []),
        { label: "Sign Out", onClick: logout, icon: <LogoutIcon />, danger: true },
      ]
    : [];

  const handleNavItem = (fn: () => void) => {
    setDrawerOpen(false);
    fn();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top App Bar ─────────────────────────────────────────────────── */}
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
      >
        <Container maxWidth="lg" disableGutters>
          <Toolbar sx={{ px: { xs: 2, md: 3 }, minHeight: { xs: 56, md: 64 } }}>
            {/* Mobile: hamburger */}
            {isMobile && user && (
              <IconButton
                edge="start"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 1 }}
                aria-label="Open navigation menu"
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Brand */}
            <Box sx={{ flexGrow: isMobile ? 1 : 0, mr: isMobile ? 0 : 3 }}>
              <Typography variant="h6" fontWeight={700} noWrap>
                WT Headcount
              </Typography>
              {!isMobile && (
                <Typography variant="caption" color="text.secondary" display="block" noWrap>
                  Construction Workforce Tracking
                </Typography>
              )}
            </Box>

            {/* Desktop nav buttons */}
            {!isMobile && user && (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: "auto" }}>
                <Button variant="outlined" size="small" onClick={goToProjectSelection}>
                  {selectedProject ? `Project: ${selectedProject.cmicCode}` : "Select Project"}
                </Button>
                {selectedProject && (
                  <>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => goToScreen("flow-overview")}
                    >
                      Flow
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => goToScreen("dashboard")}
                    >
                      Dashboard
                    </Button>
                  </>
                )}
                <Button variant="contained" color="primary" size="small" onClick={logout}>
                  Sign Out
                </Button>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "primary.main",
                    fontSize: "0.75rem",
                    ml: 0.5,
                  }}
                >
                  {userInitials}
                </Avatar>
              </Stack>
            )}

            {/* Mobile: user avatar chip beside hamburger */}
            {isMobile && user && (
              <Avatar
                sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "0.75rem" }}
              >
                {userInitials}
              </Avatar>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* ── Mobile Navigation Drawer ─────────────────────────────────────── */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: DRAWER_WIDTH, bgcolor: "background.paper" } }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              WT Headcount
            </Typography>
            {user && (
              <Typography variant="caption" color="text.secondary">
                {user.name}
              </Typography>
            )}
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Active project banner */}
        {selectedProject && (
          <Box sx={{ px: 2, py: 1.2, bgcolor: "primary.main" }}>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
              Active Project
            </Typography>
            <Typography variant="body2" fontWeight={700} color="white" noWrap>
              {selectedProject.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
              {selectedProject.cmicCode} · {selectedProject.location}
            </Typography>
          </Box>
        )}

        <Divider />

        {/* Nav items */}
        <List disablePadding sx={{ flex: 1 }}>
          {navItems.map(item => (
            <ListItemButton
              key={item.label}
              onClick={() => handleNavItem(item.onClick)}
              sx={{
                py: 1.5,
                color: item.danger ? "error.main" : "text.primary",
              }}
            >
              <ListItemIcon
                sx={{
                  color: item.danger ? "error.main" : "primary.main",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 500, fontSize: "0.9rem" }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* ── Page Content ─────────────────────────────────────────────────── */}
      <Container
        component="main"
        maxWidth="lg"
        sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, md: 3 }, flex: 1 }}
      >
        {children}
      </Container>
    </Box>
  );
}
