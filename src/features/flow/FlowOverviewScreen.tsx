import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import GroupsIcon from "@mui/icons-material/Groups";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RouterIcon from "@mui/icons-material/Router";
import BluetoothIcon from "@mui/icons-material/Bluetooth";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import { useAppState } from "../../core/state/AppState";

// ── Types ──────────────────────────────────────────────────────────────────────
type StepStatus = "done" | "pending" | "warning" | "optional";

interface StepDef {
  title: string;
  description: string;
  status: StepStatus;
  statusLabel?: string;
  primaryAction: { label: string; onClick: () => void; icon?: React.ReactElement };
  secondaryAction?: { label: string; onClick: () => void; icon?: React.ReactElement };
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeReceiverId(value: string): string {
  return value.trim().toLowerCase();
}

// ── Status dot ─────────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: StepStatus }) {
  const color = { done: "#2e7d32", pending: "#9e9e9e", warning: "#ed6c02", optional: "#9e9e9e" }[status];
  const Icon = status === "done" ? CheckCircleIcon : status === "warning" ? WarningAmberIcon : RadioButtonUncheckedIcon;
  return <Icon sx={{ fontSize: 18, color, flexShrink: 0 }} />;
}

// ── Step row ───────────────────────────────────────────────────────────────────
function StepRow({ step, index }: { step: StepDef; index: number }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 1.5, sm: 2 },
        px: 2,
        py: 1.8,
      }}
    >
      {/* Left: number + status */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexShrink: 0 }}>
        <Typography
          variant="caption"
          sx={{ width: 18, fontWeight: 700, color: "text.disabled", textAlign: "center" }}
        >
          {index + 1}
        </Typography>
        <StatusDot status={step.status} />
      </Stack>

      {/* Middle: text */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
          <Typography variant="body2" fontWeight={600}>{step.title}</Typography>
          {step.statusLabel && (
            <Chip
              label={step.statusLabel}
              size="small"
              color={step.status === "done" ? "success" : step.status === "warning" ? "warning" : "default"}
              variant={step.status === "done" ? "filled" : "outlined"}
              sx={{ height: 18, fontSize: "0.65rem", fontWeight: 500 }}
            />
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.2 }}>
          {step.description}
        </Typography>
      </Box>

      {/* Right: actions */}
      <Stack direction="row" spacing={1} flexShrink={0} sx={{ mt: { xs: 0.5, sm: 0 } }}>
        {step.secondaryAction && (
          <Button
            size="small"
            variant="outlined"
            onClick={step.secondaryAction.onClick}
            startIcon={step.secondaryAction.icon}
            sx={{ fontSize: "0.75rem" }}
          >
            {step.secondaryAction.label}
          </Button>
        )}
        <Button
          size="small"
          variant="contained"
          onClick={step.primaryAction.onClick}
          startIcon={step.primaryAction.icon}
          sx={{ fontSize: "0.75rem" }}
        >
          {step.primaryAction.label}
        </Button>
      </Stack>
    </Box>
  );
}

// ── Section card ───────────────────────────────────────────────────────────────
function SectionCard({
  title,
  subtitle,
  badge,
  steps,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  steps: StepDef[];
}) {
  return (
    <Box>
      <Stack direction="row" alignItems="flex-end" justifyContent="space-between" mb={1}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
          <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
        </Box>
        {badge && (
          <Chip size="small" label={badge} variant="outlined" sx={{ fontSize: "0.7rem", height: 20 }} />
        )}
      </Stack>
      <Paper sx={{ border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        {steps.map((step, i) => (
          <Box key={step.title}>
            <StepRow step={step} index={i} />
            {i < steps.length - 1 && <Divider sx={{ mx: 2 }} />}
          </Box>
        ))}
      </Paper>
    </Box>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────────
export function FlowOverviewScreen() {
  const {
    selectedProject,
    assignedContractors,
    workers,
    headcountEvents,
    dashboardTotals,
    receiverConfig,
    configureReceiver,
    goToScreen,
  } = useAppState();

  const [showReceiverForm, setShowReceiverForm] = useState(false);
  const [minutes, setMinutes] = useState<number>(receiverConfig.autoBadgeOutMinutes || 90);
  const [mappingMethod, setMappingMethod] = useState<"qr" | "manual">("qr");
  const [receiverIdInput, setReceiverIdInput] = useState<string>(receiverConfig.primaryReceiverId);
  const [receiverError, setReceiverError] = useState<string>("");
  const [scanSuccess, setScanSuccess] = useState<string>("");
  const [receiverSaved, setReceiverSaved] = useState(false);

  const handleToggleReceiverForm = () => {
    setShowReceiverForm(prev => {
      const next = !prev;
      if (next) {
        setMinutes(receiverConfig.autoBadgeOutMinutes || 90);
        setReceiverIdInput(receiverConfig.primaryReceiverId);
        setReceiverError("");
        setScanSuccess("");
      }
      return next;
    });
  };

  const handleSaveReceiver = () => {
    const normalized = normalizeReceiverId(receiverIdInput);

    if (!UUID_REGEX.test(normalized)) {
      setReceiverError("Enter a valid UUID (example: 123e4567-e89b-12d3-a456-426614174000).");
      return;
    }

    const alreadyMapped = receiverConfig.mappedReceiverIds.some(
      id => normalizeReceiverId(id) === normalized,
    );

    if (alreadyMapped && normalizeReceiverId(receiverConfig.primaryReceiverId) !== normalized) {
      setReceiverError("This receiver is already mapped for this jobsite.");
      return;
    }

    setReceiverError("");
    configureReceiver(minutes, normalized);
    setShowReceiverForm(false);
    setReceiverSaved(true);
    setTimeout(() => setReceiverSaved(false), 3000);
  };

  const handleSimulateQrScan = () => {
    const simulated = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    setMappingMethod("qr");
    setReceiverIdInput(simulated);
    setReceiverError("");
    setScanSuccess("QR value captured. Review and save mapping.");
  };

  if (!selectedProject) {
    return <Typography color="text.secondary">Select a project to start.</Typography>;
  }

  const hasContractors = assignedContractors.length > 0;
  const workerCount    = workers.filter(w => w.projectId === selectedProject.id).length;
  const hasWorkers     = workerCount > 0;
  const bleToday       = headcountEvents.filter(e => e.projectId === selectedProject.id && e.source === "BLE").length;
  const totalToday     = dashboardTotals.totalToday;

  const setupSteps: StepDef[] = [
    {
      title: "Contractors",
      description: hasContractors
        ? `${assignedContractors.length} sub-contractor${assignedContractors.length > 1 ? "s" : ""} assigned`
        : "No contractors assigned — add at least one to proceed",
      status: hasContractors ? "done" : "warning",
      statusLabel: hasContractors ? `${assignedContractors.length} assigned` : "Required",
      primaryAction: { label: "Manage", onClick: () => goToScreen("contractor-management") },
    },
    {
      title: "QR Code",
      description: "Permanent QR per jobsite — workers scan once to submit orientation form",
      status: "done",
      statusLabel: "Ready",
      primaryAction: { label: "View QR", onClick: () => goToScreen("qr-page"), icon: <QrCode2Icon /> },
      secondaryAction: { label: "Share", onClick: () => goToScreen("qr-page") },
    },
    {
      title: "Worker Orientation",
      description: hasWorkers
        ? `${workerCount} worker${workerCount > 1 ? "s" : ""} registered via orientation form`
        : "Workers scan QR and submit onboarding — no app required",
      status: hasWorkers ? "done" : "pending",
      statusLabel: hasWorkers ? `${workerCount} registered` : "Waiting",
      primaryAction: { label: "Preview Form", onClick: () => goToScreen("worker-form"), icon: <GroupsIcon /> },
    },
    {
      title: "Collect & Verify",
      description: totalToday > 0
        ? `${totalToday} entries today — review and sign off`
        : "No headcount entries yet today",
      status: totalToday > 0 ? "warning" : "pending",
      statusLabel: totalToday > 0 ? `${totalToday} today` : undefined,
      primaryAction: { label: "Dashboard", onClick: () => goToScreen("dashboard"), icon: <DashboardIcon /> },
      secondaryAction: { label: "Manual Entry", onClick: () => goToScreen("manual-headcount"), icon: <EditNoteIcon /> },
    },
  ];

  const dailySteps: StepDef[] = [
    {
      title: "BLE Auto-Capture",
      description: bleToday > 0
        ? `${bleToday} BLE event${bleToday > 1 ? "s" : ""} captured today`
        : "Workers with beacons are captured automatically on entry",
      status: bleToday > 0 ? "done" : "optional",
      statusLabel: bleToday > 0 ? `${bleToday} today` : "Automatic",
      primaryAction: { label: "View Data", onClick: () => goToScreen("dashboard"), icon: <BluetoothIcon /> },
    },
    {
      title: "Adjust Contractors",
      description: `${hasContractors ? assignedContractors.length + " assigned" : "None assigned"} — add or remove as scope changes`,
      status: hasContractors ? "done" : "pending",
      statusLabel: hasContractors ? `${assignedContractors.length} assigned` : undefined,
      primaryAction: { label: "Manage", onClick: () => goToScreen("contractor-management") },
    },
    {
      title: "New Worker Onboarding",
      description: "Same permanent QR works for all new workers arriving after Day 1",
      status: "optional",
      statusLabel: "As needed",
      primaryAction: { label: "Open QR", onClick: () => goToScreen("qr-page"), icon: <QrCode2Icon /> },
    },
    {
      title: "Verify Headcount",
      description: totalToday > 0
        ? `${totalToday} entries today — validate totals and correct any gaps`
        : "No entries yet — add manual counts if BLE hasn't fired",
      status: totalToday > 0 ? "warning" : "pending",
      statusLabel: totalToday > 0 ? "Verify" : undefined,
      primaryAction: { label: "Dashboard", onClick: () => goToScreen("dashboard"), icon: <DashboardIcon /> },
      secondaryAction: { label: "Manual Entry", onClick: () => goToScreen("manual-headcount"), icon: <EditNoteIcon /> },
    },
  ];

  const doneCount = setupSteps.filter(s => s.status === "done").length;

  return (
    <Stack spacing={3}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <Box>
        <Typography variant="h5" fontWeight={700}>Jobsite Flow</Typography>
        <Typography variant="body2" color="text.secondary">
          {selectedProject.cmicCode} · {selectedProject.name} · {selectedProject.location}
        </Typography>
      </Box>

      {/* ── BLE Receiver ───────────────────────────────────────────────── */}
      <Paper sx={{ border: "1px solid", borderColor: receiverConfig.configured ? "divider" : "warning.light", overflow: "hidden" }}>
        <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
          <RouterIcon sx={{ fontSize: 18, color: receiverConfig.configured ? "success.main" : "warning.main", flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight={600}>BLE Receiver</Typography>
            <Typography variant="caption" color="text.secondary">
              {receiverConfig.configured
                ? `Primary: ${receiverConfig.primaryReceiverId || "not set"} · ${receiverConfig.mappedReceiverIds.length} mapped · Auto badge-out ${receiverConfig.autoBadgeOutMinutes} min`
                : "Not configured — use QR mapping (primary) or manual UUID (fallback)"}
            </Typography>
          </Box>
          {receiverConfig.configured && (
            <Chip label="Configured" size="small" color="success" variant="filled" sx={{ height: 18, fontSize: "0.65rem" }} />
          )}
          <Button
            size="small"
            variant="outlined"
            color={receiverConfig.configured ? "inherit" : "warning"}
            onClick={handleToggleReceiverForm}
            sx={{ ml: 1, fontSize: "0.75rem" }}
          >
            {showReceiverForm ? "Cancel" : receiverConfig.configured ? "Edit" : "Configure"}
          </Button>
        </Box>

        <Collapse in={showReceiverForm}>
          <Divider />
          <Box sx={{ px: 2, py: 2, bgcolor: "grey.50" }}>
            {receiverSaved && <Alert severity="success" sx={{ mb: 1.5 }}>Saved.</Alert>}
            {scanSuccess && <Alert severity="info" sx={{ mb: 1.5 }}>{scanSuccess}</Alert>}

            <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
              <Button
                size="small"
                variant={mappingMethod === "qr" ? "contained" : "outlined"}
                startIcon={<QrCodeScannerIcon />}
                onClick={() => {
                  setMappingMethod("qr");
                  setReceiverError("");
                }}
              >
                QR Scan
              </Button>
              <Button
                size="small"
                variant={mappingMethod === "manual" ? "contained" : "outlined"}
                startIcon={<KeyboardAltIcon />}
                onClick={() => {
                  setMappingMethod("manual");
                  setReceiverError("");
                }}
              >
                Manual Entry
              </Button>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "flex-end" }}>
              <TextField
                label="Auto badge-out (minutes)"
                type="number"
                value={minutes}
                onChange={e => setMinutes(Number(e.target.value))}
                inputProps={{ min: 15, step: 5 }}
                helperText="Workers inactive longer than this are automatically badged out"
                sx={{ maxWidth: 280 }}
                size="small"
              />

              <TextField
                label={mappingMethod === "qr" ? "Scanned Receiver UUID" : "Receiver UUID (manual)"}
                value={receiverIdInput}
                onChange={e => {
                  setReceiverIdInput(e.target.value);
                  setReceiverError("");
                  setScanSuccess("");
                }}
                placeholder="123e4567-e89b-12d3-a456-426614174000"
                error={!!receiverError}
                helperText={receiverError || (mappingMethod === "qr"
                  ? "Scan QR and paste the receiver UUID, then save."
                  : "Manual fallback when QR is unavailable.")}
                sx={{ minWidth: { xs: "100%", sm: 360 } }}
                size="small"
              />

              {mappingMethod === "qr" && (
                <Button variant="outlined" onClick={handleSimulateQrScan} size="small">
                  Simulate QR
                </Button>
              )}

              <Button variant="contained" onClick={handleSaveReceiver} size="small">
                Map Receiver
              </Button>
            </Stack>

            {receiverConfig.mappedReceiverIds.length > 0 && (
              <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 1.5 }}>
                {receiverConfig.mappedReceiverIds.map(id => (
                  <Chip
                    key={id}
                    label={id === receiverConfig.primaryReceiverId ? `${id} (primary)` : id}
                    size="small"
                    variant={id === receiverConfig.primaryReceiverId ? "filled" : "outlined"}
                    color={id === receiverConfig.primaryReceiverId ? "primary" : "default"}
                    sx={{ fontSize: "0.65rem", mb: 0.75 }}
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Collapse>
      </Paper>

      {/* ── Day 1 Setup ────────────────────────────────────────────────── */}
      <SectionCard
        title="Day 1 — Job Setup"
        subtitle="Complete once when starting a new jobsite"
        badge={`${doneCount} / ${setupSteps.length} done`}
        steps={setupSteps}
      />

      {/* ── Daily Operations ───────────────────────────────────────────── */}
      <SectionCard
        title="Daily Operations"
        subtitle="Repeat each day to track and verify workforce headcount"
        steps={dailySteps}
      />

      <Paper sx={{ border: "1px solid", borderColor: "divider", p: 1.25 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
          <Typography variant="caption" color="text.secondary">
            Configure reminders and onboarding alerts.
          </Typography>
          <Button
            size="small"
            variant="text"
            startIcon={<NotificationsActiveIcon />}
            onClick={() => goToScreen("notifications")}
            sx={{ fontSize: "0.75rem" }}
          >
            Notification Preferences
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
