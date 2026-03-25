import { Box, Button, FormControlLabel, Paper, Stack, Switch, Typography } from "@mui/material";
import { useAppState } from "../../core/state/AppState";

export function NotificationPreferencesScreen() {
  const { notificationPrefs, setNotificationPreference, goToScreen } = useAppState();

  return (
    <Stack spacing={2}>
      <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" gap={1.5}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Notification Preferences</Typography>
          <Typography variant="body2" color="text.secondary">Configure app notifications for daily operations.</Typography>
        </Box>
        <Button variant="outlined" onClick={() => goToScreen("flow-overview")}>Back to Flow</Button>
      </Box>

      <Paper sx={{ maxWidth: 560, p: 2, border: "1px solid", borderColor: "divider" }}>
        <FormControlLabel
          control={
            <Switch
              checked={notificationPrefs.dailySummaryEmail}
              onChange={e => setNotificationPreference("dailySummaryEmail", e.target.checked)}
              color="primary"
            />
          }
          label="Daily summary email"
          sx={{ width: "100%", justifyContent: "space-between", m: 0, py: 1, borderBottom: "1px solid", borderColor: "divider" }}
          labelPlacement="start"
        />

        <FormControlLabel
          control={
            <Switch
              checked={notificationPrefs.workerOnboardingNotifications}
              onChange={e => setNotificationPreference("workerOnboardingNotifications", e.target.checked)}
              color="primary"
            />
          }
          label="Worker onboarding notifications"
          sx={{ width: "100%", justifyContent: "space-between", m: 0, py: 1 }}
          labelPlacement="start"
        />
      </Paper>
    </Stack>
  );
}
