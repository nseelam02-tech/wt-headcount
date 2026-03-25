import { useState, useMemo, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import BusinessIcon from "@mui/icons-material/Business";
import { useAppState } from "../../core/state/AppState";

/** Renders contractor name with the matching portion highlighted in orange. */
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <Box
        component="span"
        sx={{ color: "primary.main", fontWeight: 700, textDecoration: "underline", textDecorationColor: "primary.light" }}
      >
        {text.slice(idx, idx + query.length)}
      </Box>
      {text.slice(idx + query.length)}
    </>
  );
}

const MIN_SEARCH = 3;

export function ContractorManagementScreen() {
  const {
    selectedProject,
    assignedContractors,
    availableContractors,
    assignContractor,
    removeContractor,
    goToScreen,
  } = useAppState();

  // ── Search state — debounced 300 ms, min 3 chars ──────────────────────────
  const [rawQuery, setRawQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(rawQuery), 300);
    return () => clearTimeout(t);
  }, [rawQuery]);

  const activeQuery = debouncedQuery.length >= MIN_SEARCH ? debouncedQuery : "";
  const charsLeft = rawQuery.length > 0 && rawQuery.length < MIN_SEARCH ? MIN_SEARCH - rawQuery.length : 0;

  // ── Filtered available list (search applies only to Available) ────────────
  const filteredAvailable = useMemo(() => {
    if (!activeQuery) return availableContractors;
    const q = activeQuery.toLowerCase();
    return availableContractors.filter(
      c => c.name.toLowerCase().includes(q) || (c.code ?? "").toLowerCase().includes(q),
    );
  }, [availableContractors, activeQuery]);

  // ── Snackbar feedback ─────────────────────────────────────────────────────
  const [snack, setSnack] = useState<string | null>(null);

  // ── Confirm-remove dialog ─────────────────────────────────────────────────
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const pendingContractor = pendingRemoveId
    ? assignedContractors.find(c => c.id === pendingRemoveId)
    : undefined;

  const handleAdd = (contractorId: string) => {
    const c = availableContractors.find(x => x.id === contractorId);
    assignContractor(contractorId);
    if (c) setSnack(`"${c.name}" added to project`);
  };

  const handleRemoveConfirm = () => {
    if (!pendingRemoveId) return;
    const c = assignedContractors.find(x => x.id === pendingRemoveId);
    removeContractor(pendingRemoveId);
    setPendingRemoveId(null);
    if (c) setSnack(`"${c.name}" removed from project`);
  };

  // ── Responsive ────────────────────────────────────────────────────────────
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileTab, setMobileTab] = useState(0);

  if (!selectedProject) {
    return <Typography color="text.secondary">Select a project to manage contractors.</Typography>;
  }

  // ── Assigned panel ────────────────────────────────────────────────────────
  const assignedPanel = (
    <Paper sx={{ border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
        <GroupsIcon sx={{ fontSize: 18, color: "primary.main" }} />
        <Typography variant="subtitle1" fontWeight={700}>Assigned Contractors</Typography>
        <Chip
          label={assignedContractors.length}
          size="small"
          color="primary"
          sx={{ ml: "auto", height: 22, fontSize: "0.75rem" }}
        />
      </Box>
      <Divider />
      <List disablePadding>
        {assignedContractors.length === 0 ? (
          <ListItem sx={{ py: 4, flexDirection: "column", alignItems: "center", gap: 0.8 }}>
            <BusinessIcon sx={{ fontSize: 36, color: "text.disabled" }} />
            <Typography variant="body2" color="text.disabled" textAlign="center">
              No contractors assigned yet.
              <br />
              Use the Available list to add contractors.
            </Typography>
          </ListItem>
        ) : (
          assignedContractors.map(c => (
            <ListItem
              key={c.id}
              divider
              sx={{ pr: "110px" }}
              secondaryAction={
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => setPendingRemoveId(c.id)}
                  sx={{ minWidth: 88 }}
                >
                  Remove
                </Button>
              }
            >
              <ListItemText
                primary={c.name}
                secondary={c.code ? `Code: ${c.code}` : undefined}
                primaryTypographyProps={{ fontWeight: 500 }}
                secondaryTypographyProps={{ fontSize: "0.75rem" }}
              />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );

  // ── Available panel ───────────────────────────────────────────────────────
  const availablePanel = (
    <Paper sx={{ border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
        <BusinessIcon sx={{ fontSize: 18, color: "text.secondary" }} />
        <Typography variant="subtitle1" fontWeight={700}>Available Contractors</Typography>
        <Chip
          label={activeQuery ? filteredAvailable.length : availableContractors.length}
          size="small"
          variant="outlined"
          sx={{ ml: "auto", height: 22, fontSize: "0.75rem" }}
        />
      </Box>
      <Divider />

      {/* Search */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
        <Box
          component="input"
          // MUI TextField inline to keep JSX compact
          sx={{ display: "none" }}
        />
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            px: 1.2,
            bgcolor: "background.paper",
            "&:focus-within": { borderColor: "primary.main", boxShadow: "0 0 0 2px rgba(232,89,12,0.15)" },
          }}
        >
          <SearchIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1, flexShrink: 0 }} />
          <Box
            component="input"
            type="text"
            placeholder="Search contractors…"
            value={rawQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRawQuery(e.target.value)}
            sx={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "0.875rem",
              fontFamily: "inherit",
              py: 1,
              bgcolor: "transparent",
              color: "text.primary",
              "&::placeholder": { color: "text.disabled" },
            }}
          />
        </Stack>
        {charsLeft > 0 && (
          <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: "block" }}>
            Type {charsLeft} more character{charsLeft > 1 ? "s" : ""} to search…
          </Typography>
        )}
      </Box>

      {/* Scrollable list */}
      <Divider />
      <Box sx={{ maxHeight: { xs: 320, md: 440 }, overflowY: "auto" }}>
        <List disablePadding>
          {rawQuery.length > 0 && rawQuery.length < MIN_SEARCH ? (
            /* waiting for min chars */
            <ListItem sx={{ py: 2 }}>
              <ListItemText
                primary="Keep typing to search…"
                primaryTypographyProps={{ color: "text.disabled", textAlign: "center", fontSize: "0.875rem" }}
              />
            </ListItem>
          ) : filteredAvailable.length === 0 ? (
            <ListItem sx={{ py: 2 }}>
              <ListItemText
                primary={rawQuery ? `No results for "${rawQuery}"` : "All contractors are already assigned"}
                primaryTypographyProps={{ color: "text.disabled", textAlign: "center", fontSize: "0.875rem" }}
              />
            </ListItem>
          ) : (
            filteredAvailable.map(c => (
              <ListItem
                key={c.id}
                divider
                sx={{ pr: "90px" }}
                secondaryAction={
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => handleAdd(c.id)}
                    sx={{ minWidth: 60 }}
                  >
                    Add
                  </Button>
                }
              >
                <ListItemText
                  primary={<HighlightMatch text={c.name} query={activeQuery} />}
                  secondary={c.code ? `Code: ${c.code}` : undefined}
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ fontSize: "0.75rem" }}
                />
              </ListItem>
            ))
          )}
        </List>
      </Box>
    </Paper>
  );

  return (
    <Stack spacing={2}>
      {/* Header */}
      <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center" gap={1.5}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Contractor Management</Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedProject.name} · {selectedProject.projectNo}
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => goToScreen("flow-overview")}>Back to Flow</Button>
      </Box>

      {/* ── Mobile: tabs ─────────────────────────────────────────────────── */}
      {isMobile ? (
        <Box>
          <Tabs
            value={mobileTab}
            onChange={(_, v: number) => setMobileTab(v)}
            sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
          >
            <Tab
              label={
                <Box display="flex" alignItems="center" gap={0.8}>
                  Assigned
                  <Chip
                    label={assignedContractors.length}
                    size="small"
                    color="primary"
                    sx={{ height: 18, fontSize: "0.7rem", pointerEvents: "none" }}
                  />
                </Box>
              }
            />
            <Tab
              label={
                <Box display="flex" alignItems="center" gap={0.8}>
                  Available
                  <Chip
                    label={availableContractors.length}
                    size="small"
                    variant="outlined"
                    sx={{ height: 18, fontSize: "0.7rem", pointerEvents: "none" }}
                  />
                </Box>
              }
            />
          </Tabs>
          {mobileTab === 0 ? assignedPanel : availablePanel}
        </Box>
      ) : (
        /* ── Desktop: 60 / 40 split ────────────────────────────────────── */
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 0.67fr",
            gap: 2,
            alignItems: "start",
          }}
        >
          {assignedPanel}
          {availablePanel}
        </Box>
      )}

      {/* ── Confirm remove dialog ─────────────────────────────────────────── */}
      <Dialog
        open={!!pendingRemoveId}
        onClose={() => setPendingRemoveId(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Remove Contractor?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove{" "}
            <strong>{pendingContractor?.name}</strong>
            {pendingContractor?.code && <> (Code: {pendingContractor.code})</>} from{" "}
            <strong>{selectedProject.name}</strong>?
            <br />
            <br />
            This will unlink the contractor from this project. Existing headcount records will not be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingRemoveId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleRemoveConfirm}>
            Yes, Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar feedback ─────────────────────────────────────────────── */}
      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnack(null)} severity="success" variant="filled" sx={{ width: "100%" }}>
          {snack}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
