import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAppState } from "../../core/state/AppState";

const LANGUAGE_OPTIONS = ["English", "Spanish"];

export function PublicWorkerFormScreen() {
  const { selectedProject, assignedContractors, submitWorkerOnboarding, goToScreen } = useAppState();
  const [isWtEmployee, setIsWtEmployee] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [contractorId, setContractorId] = useState("");
  const [hardHatSticker, setHardHatSticker] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("English");
  const [safetyAck, setSafetyAck] = useState(false);
  const [signature, setSignature] = useState("");
  const [saved, setSaved] = useState(false);

  if (!selectedProject) {
    return <Typography color="text.secondary">Select a project before opening the worker form.</Typography>;
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fullName = `${firstName} ${lastName}`.trim();
    if (!fullName || !role.trim() || !contractorId || !safetyAck || !signature.trim()) return;

    submitWorkerOnboarding({
      name: fullName,
      title: role.trim(),
      trade: role.trim(),
      contractorId,
      phone: phone.trim(),
      email: email.trim(),
      photoName: hardHatSticker.trim(),
      language,
      certifications: [
        hardHatSticker.trim() ? `Hard Hat Sticker: ${hardHatSticker.trim()}` : "",
        emergencyName.trim() ? `Emergency Contact: ${emergencyName.trim()}` : "",
        emergencyPhone.trim() ? `Emergency Phone: ${emergencyPhone.trim()}` : "",
        isWtEmployee ? "WT Employee" : "",
      ].filter(Boolean),
    });

    setSaved(true);
    setIsWtEmployee(false);
    setFirstName("");
    setLastName("");
    setRole("");
    setContractorId("");
    setHardHatSticker("");
    setPhone("");
    setEmergencyName("");
    setEmergencyPhone("");
    setEmail("");
    setLanguage("English");
    setSafetyAck(false);
    setSignature("");
  };

  return (
    <Stack spacing={2.5}>
      <Paper sx={{ p: 1.5, border: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} gap={1}>
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>NEW USER REGISTRATION AND SAFETY ORIENTATION FORM</Typography>
            <Typography variant="caption" color="text.secondary">
              JOBSITE: {selectedProject.cmicCode} {selectedProject.name.toUpperCase()}
            </Typography>
          </Box>
          <Button variant="outlined" onClick={() => goToScreen("flow-overview")}>Back to Flow</Button>
        </Stack>
      </Paper>

      {saved && (
        <Alert severity="success" sx={{ border: "1px solid", borderColor: "divider" }}>
          Worker registration submitted successfully.
        </Alert>
      )}

      <Paper component="form" onSubmit={onSubmit} sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
        <FormControlLabel
          control={<Checkbox checked={isWtEmployee} onChange={e => setIsWtEmployee(e.target.checked)} />}
          label={
            <Typography variant="body2">
              Are you a Whiting-Turner employee? / Eres un trabajador de Whiting-Turner?
            </Typography>
          }
          sx={{ mb: 1 }}
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Company/Compania"
              value={contractorId}
              onChange={e => setContractorId(e.target.value)}
              required
              fullWidth
            >
              <MenuItem value="">Please Select Company / Favor de Seleccionar tu Compania</MenuItem>
              {assignedContractors.map(contractor => (
                <MenuItem key={contractor.id} value={contractor.id}>{contractor.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Hard Hat Sticker Number / Numero de Sticker del Casco"
              value={hardHatSticker}
              onChange={e => setHardHatSticker(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Role/Papel"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Phone / Ingrese Tu Numero Telefonico"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="First Name / Ingrese tu Primer Nombre"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Last Name / Ingrese tu Apellido"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Emergency Contact Name / Contacto en Caso de Emergencia"
              value={emergencyName}
              onChange={e => setEmergencyName(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Emergency Contact Phone / Telefono de Emergencia"
              value={emergencyPhone}
              onChange={e => setEmergencyPhone(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Email / Correo electronico"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Language / Idioma"
              value={language}
              onChange={e => setLanguage(e.target.value)}
              fullWidth
            >
              {LANGUAGE_OPTIONS.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Paper variant="outlined" sx={{ p: 1.5, bgcolor: "grey.50" }}>
              <FormControlLabel
                control={<Checkbox checked={safetyAck} onChange={e => setSafetyAck(e.target.checked)} />}
                label={
                  <Typography variant="caption" color="text.secondary">
                    I have read and agree to the site safety orientation and project rules. / He leido y comprendo la orientacion de seguridad del sitio y reglas del proyecto.
                  </Typography>
                }
              />
            </Paper>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Enter your Signature / Ingrese su Firma"
              value={signature}
              onChange={e => setSignature(e.target.value)}
              required
              multiline
              minRows={5}
              placeholder="Type full name as signature"
              fullWidth
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Submit / Mandar
        </Button>
      </Paper>
    </Stack>
  );
}
