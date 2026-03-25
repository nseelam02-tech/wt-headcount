import { Box, Button, Grid, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { StatCard } from "../../components/ui/StatCard";
import { useAppState } from "../../core/state/AppState";

export function DashboardScreen() {
  const { selectedProject, dashboardTotals, goToScreen } = useAppState();

  if (!selectedProject) {
    return (
      <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
        <Typography color="text.secondary">No project selected.</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" gap={1.5} mb={2.5}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Project Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedProject.name} | {selectedProject.cmicCode} | {selectedProject.location}
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button variant="outlined" onClick={() => goToScreen("manual-headcount")}>Manual Entry</Button>
          <Button variant="outlined" onClick={() => goToScreen("flow-overview")}>Open Flow</Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <StatCard label="Total Headcount Today" value={dashboardTotals.totalToday} tone="accent" />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <StatCard label="Contractors Reporting" value={dashboardTotals.breakdown.length} />
        </Grid>
      </Grid>

      <Paper sx={{ mt: 2.5, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography variant="subtitle2" color="text.secondary">Contractor Breakdown</Typography>
        </Box>
        <List disablePadding>
          {dashboardTotals.breakdown.length === 0 && (
            <ListItem>
              <ListItemText primary="No headcount events for today." primaryTypographyProps={{ color: "text.secondary" }} />
            </ListItem>
          )}
          {dashboardTotals.breakdown.map(item => (
            <ListItem key={item.contractorId} divider secondaryAction={<Typography fontWeight={700}>{item.total}</Typography>}>
              <ListItemText primary={item.contractorName} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
