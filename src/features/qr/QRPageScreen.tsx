import { QRCodeSVG } from "qrcode.react";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useAppState } from "../../core/state/AppState";

export function QRPageScreen() {
  const { selectedProject, publicFormUrl, goToScreen } = useAppState();

  if (!selectedProject) {
    return <Typography color="text.secondary">Select a project to generate QR.</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" gap={1.5}>
        <Box>
          <Typography variant="h5" fontWeight={700}>QR Generation</Typography>
          <Typography variant="body2" color="text.secondary">Generate a public onboarding QR for {selectedProject.name}</Typography>
        </Box>
        <Button variant="outlined" onClick={() => goToScreen("flow-overview")}>Back to Flow</Button>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider", display: "grid", placeItems: "center" }}>
          <QRCodeSVG value={publicFormUrl} size={180} includeMargin={true} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="subtitle2" fontWeight={700}>Public Orientation Link</Typography>
            <Paper sx={{ mt: 1.5, p: 1.2, bgcolor: "grey.100" }}>
              <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-all" }}>{publicFormUrl}</Typography>
            </Paper>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button variant="contained" color="primary" onClick={() => goToScreen("worker-form")}>Open Form Preview</Button>
              <Button variant="outlined" onClick={() => navigator.clipboard.writeText(publicFormUrl)}>Copy Link</Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
