import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import { useAppState } from "../../core/state/AppState";

export function LoginScreen() {
  const { login } = useAppState();

  return (
    <Paper sx={{ mx: "auto", maxWidth: 560, p: 4, border: "1px solid", borderColor: "divider" }}>
      <Typography variant="h5" fontWeight={700}>Employee Sign In</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
        Azure AD integration will be enabled in production. This environment uses mock login.
      </Typography>

      <Alert severity="info" sx={{ mt: 3, bgcolor: "grey.100", color: "text.primary", border: "1px solid", borderColor: "divider" }}>
        Allowed user type: WT internal employees only. External workers use the public QR onboarding form.
      </Alert>

      <Box sx={{ mt: 3 }}>
        <Button fullWidth variant="contained" color="primary" onClick={login}>
          Continue with Mock Azure AD
        </Button>
      </Box>
    </Paper>
  );
}
