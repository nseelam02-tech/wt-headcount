import { useState } from "react";
import { Alert, Box, Button, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { useAppState } from "../../core/state/AppState";

export function ManualHeadcountScreen() {
  const { selectedProject, assignedContractors, addManualHeadcount, goToScreen } = useAppState();
  const [contractorId, setContractorId] = useState("");
  const [count, setCount] = useState<number>(0);
  const [saved, setSaved] = useState(false);

  if (!selectedProject) {
    return <Typography color="text.secondary">Select a project before entering manual headcount.</Typography>;
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractorId || count <= 0) return;
    addManualHeadcount(contractorId, count);
    setSaved(true);
    setCount(0);
    setContractorId("");
  };

  return (
    <Stack spacing={2}>
      <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" gap={1.5}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Manual Headcount Entry</Typography>
          <Typography variant="body2" color="text.secondary">Verify incoming feed and correct with manual contractor totals.</Typography>
        </Box>
        <Button variant="outlined" onClick={() => goToScreen("dashboard")}>Back to Dashboard</Button>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ border: "1px solid", borderColor: "divider" }}>Manual headcount saved.</Alert>
      )}

      <Paper component="form" onSubmit={onSubmit} sx={{ p: 2, maxWidth: 560, border: "1px solid", borderColor: "divider" }}>
        <Stack spacing={2}>
          <TextField
            select
            label="Contractor"
            value={contractorId}
            onChange={e => setContractorId(e.target.value)}
            required
          >
            <MenuItem value="">Select contractor</MenuItem>
            {assignedContractors.map(contractor => (
              <MenuItem key={contractor.id} value={contractor.id}>{contractor.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Worker Count"
            type="number"
            value={count || ""}
            onChange={e => setCount(Number(e.target.value))}
            inputProps={{ min: 1 }}
            required
          />

          <Button type="submit" variant="contained" color="primary">Save Manual Entry</Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
