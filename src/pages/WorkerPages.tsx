import { useState } from "react";
import {
  Box, Button, Typography, Card, CardContent,
  TextField, Select, MenuItem, FormControl, InputLabel,
  FormGroup, FormControlLabel, Checkbox, RadioGroup,
  Radio, Alert, Stepper, Step, StepLabel, Chip,
  LinearProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { Site, WorkerSubmission } from "../types";
import { BASE_FIELDS, TRADES, YEARS_EXP, ORANGE } from "../utils/constants";

// ─── Worker Form Page ─────────────────────────────────────────────────────────
interface FormProps {
  site: Site;
  onSubmit: (data: Omit<WorkerSubmission,"id"|"workerId"|"submittedAt"|"checkIn"|"site">) => void;
}

type FormState = {
  firstName:string; lastName:string; phone:string;
  emergencyName:string; emergencyPhone:string;
  trade:string; employer:string; supervisor:string; yearsExp:string;
  oshaCard:string; firstAid:boolean; siteSafety:boolean; forklift:boolean;
  scaffold:boolean; confined:boolean; fallProt:boolean;
  extraCerts:Record<string,boolean>;
  ppeConfirm:boolean; safetyAck:boolean; drugAck:boolean; signature:string;
};

const STEPS = ["Personal Info","Safety Certs","Acknowledgment"];

export function WorkerFormPage({ site, onSubmit }: FormProps) {
  const cfg     = site.formConfig;
  const enabled = new Set(cfg.enabledFields);
  const has     = (id: string) => enabled.has(id);
  const allTrades = [...TRADES, ...cfg.customTradeOptions].filter((v,i,a) => a.indexOf(v) === i);

  const [step,  setStep]  = useState(0);
  const [busy,  setBusy]  = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [f, setF] = useState<FormState>({
    firstName:"", lastName:"", phone:"", emergencyName:"", emergencyPhone:"",
    trade:"", employer:"", supervisor:"", yearsExp:"",
    oshaCard:"none", firstAid:false, siteSafety:false, forklift:false,
    scaffold:false, confined:false, fallProt:false,
    extraCerts:{}, ppeConfirm:false, safetyAck:false, drugAck:false, signature:"",
  });

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setF(p => ({ ...p, [k]: v }));
    setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  };

  const validate = (s: number) => {
    const e: Record<string,string> = {};
    if (s === 0) {
      if (!f.firstName.trim())                     e.firstName = "Required";
      if (!f.lastName.trim())                      e.lastName  = "Required";
      if (has("trade") && !f.trade)               e.trade     = "Required";
      if (has("employer") && !f.employer.trim())  e.employer  = "Required";
    }
    if (s === 2) {
      if (has("ppeConfirm") && !f.ppeConfirm)  e.ppeConfirm = "Required";
      if (has("safetyAck")  && !f.safetyAck)   e.safetyAck  = "Required";
      if (has("drugAck")    && !f.drugAck)      e.drugAck    = "Required";
      if (has("signature")  && !f.signature.trim()) e.signature = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const submit = () => {
    if (!validate(2)) return;
    setBusy(true);
    setTimeout(() => onSubmit({ ...f, siteId: site.id }), 500);
  };

  const safetyFields = BASE_FIELDS.filter(b => b.section === "safety" && has(b.id) && b.type === "checkbox");
  const hasSafety = safetyFields.length > 0 || has("oshaCard") || cfg.extraCerts.length > 0;

  return (
    <Box sx={{ minHeight:"100dvh", bgcolor:"#F5F5F5" }}>
      {/* Topbar */}
      <Box sx={{ bgcolor: ORANGE, py:1.5, px:2.5, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <Typography sx={{ color:"#fff", fontWeight:600, fontSize:16 }}>Worker Registration</Typography>
        <Box sx={{ textAlign:"right" }}>
          <Typography sx={{ fontWeight:900, fontSize:16, color:"#fff", letterSpacing:3, lineHeight:1 }}>WT</Typography>
          <Typography sx={{ fontSize:7, color:"rgba(255,255,255,0.8)", letterSpacing:2 }}>WHITING-TURNER</Typography>
        </Box>
      </Box>

      {/* Site banner */}
      <Box sx={{ bgcolor:"#1A1A1A", px:2.5, py:1.5 }}>
        <Typography sx={{ color:"#fff", fontWeight:600, fontSize:14 }}>{site.name}</Typography>
        <Typography sx={{ color:"rgba(255,255,255,0.5)", fontSize:11 }}>{site.address} · {site.projectNo}</Typography>
      </Box>

      <Box sx={{ maxWidth:680, mx:"auto", p:{ xs:2, sm:3 }, pb: 6 }}>
        {/* Stepper */}
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={step} alternativeLabel>
            {STEPS.map(label => (
              <Step key={label}>
                <StepLabel sx={{ "& .MuiStepLabel-label": { fontSize:12 } }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <LinearProgress
            variant="determinate"
            value={((step + 1) / STEPS.length) * 100}
            sx={{ mt:1.5, height:4, borderRadius:2, bgcolor:"#E8E8E8", "& .MuiLinearProgress-bar": { bgcolor: ORANGE } }}
          />
        </Box>

        {/* Step 0 — Personal Info */}
        {step === 0 && (
          <Card>
            <CardContent sx={{ p: { xs:2, sm:3 } }}>
              <Typography variant="h6" fontWeight={600} mb={2.5}>Personal & Employment</Typography>
              <Box sx={{ display:"grid", gridTemplateColumns:{ xs:"1fr", sm:"1fr 1fr" }, gap:2 }}>
                {has("firstName") && (
                  <TextField label="First Name *" value={f.firstName} onChange={e => set("firstName", e.target.value)} error={!!errors.firstName} helperText={errors.firstName} />
                )}
                {has("lastName") && (
                  <TextField label="Last Name *" value={f.lastName} onChange={e => set("lastName", e.target.value)} error={!!errors.lastName} helperText={errors.lastName} />
                )}
                {has("phone") && (
                  <TextField label="Mobile Phone" type="tel" value={f.phone} onChange={e => set("phone", e.target.value)} />
                )}
                {has("emergencyName") && (
                  <TextField label="Emergency Contact Name" value={f.emergencyName} onChange={e => set("emergencyName", e.target.value)} />
                )}
                {has("emergencyPhone") && (
                  <TextField label="Emergency Contact Phone" type="tel" value={f.emergencyPhone} onChange={e => set("emergencyPhone", e.target.value)} />
                )}
                {has("trade") && (
                  <FormControl size="small" fullWidth error={!!errors.trade}>
                    <InputLabel>Trade / Craft *</InputLabel>
                    <Select value={f.trade} onChange={e => set("trade", e.target.value)} label="Trade / Craft *">
                      {allTrades.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </Select>
                    {errors.trade && <Typography variant="caption" color="error" sx={{ ml:1.5, mt:0.3 }}>{errors.trade}</Typography>}
                  </FormControl>
                )}
                {has("employer") && (
                  <TextField label="Employer / Company" value={f.employer} onChange={e => set("employer", e.target.value)} error={!!errors.employer} helperText={errors.employer} />
                )}
                {has("supervisor") && (
                  <TextField label="Supervisor on Site" value={f.supervisor} onChange={e => set("supervisor", e.target.value)} />
                )}
                {has("yearsExp") && (
                  <FormControl size="small" fullWidth>
                    <InputLabel>Years of Experience</InputLabel>
                    <Select value={f.yearsExp} onChange={e => set("yearsExp", e.target.value)} label="Years of Experience">
                      {YEARS_EXP.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                    </Select>
                  </FormControl>
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Step 1 — Safety */}
        {step === 1 && hasSafety && (
          <Card>
            <CardContent sx={{ p:{ xs:2, sm:3 } }}>
              <Typography variant="h6" fontWeight={600} mb={2.5}>Safety Certifications</Typography>

              {has("oshaCard") && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" fontWeight={500} mb={1} color="text.secondary" sx={{ textTransform:"uppercase", fontSize:11, letterSpacing:0.8 }}>
                    OSHA Card
                  </Typography>
                  <RadioGroup row value={f.oshaCard} onChange={e => set("oshaCard", e.target.value)}>
                    {[["none","None"],["10","OSHA 10"],["30","OSHA 30"],["500","OSHA 500"]].map(([v,l]) => (
                      <FormControlLabel key={v} value={v} control={<Radio size="small" />} label={<Typography variant="body2">{l}</Typography>} />
                    ))}
                  </RadioGroup>
                </Box>
              )}

              {safetyFields.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight={500} mb={1} color="text.secondary" sx={{ textTransform:"uppercase", fontSize:11, letterSpacing:0.8 }}>
                    Certifications Held
                  </Typography>
                  <FormGroup>
                    {safetyFields.map(field => (
                      <FormControlLabel
                        key={field.id}
                        control={<Checkbox checked={!!f[field.id as keyof FormState]} onChange={e => set(field.id as keyof FormState, e.target.checked as any)} size="small" />}
                        label={<Typography variant="body2">{field.label}</Typography>}
                      />
                    ))}
                  </FormGroup>
                </Box>
              )}

              {cfg.extraCerts.length > 0 && (
                <Box>
                  <Typography variant="body2" fontWeight={500} mb={1} color="text.secondary" sx={{ textTransform:"uppercase", fontSize:11, letterSpacing:0.8 }}>
                    Site-Specific Certs
                  </Typography>
                  <FormGroup>
                    {cfg.extraCerts.map(cert => (
                      <FormControlLabel
                        key={cert}
                        control={<Checkbox checked={!!f.extraCerts[cert]} onChange={e => setF(p => ({ ...p, extraCerts: { ...p.extraCerts, [cert]: e.target.checked } }))} size="small" />}
                        label={<Typography variant="body2">{cert}</Typography>}
                      />
                    ))}
                  </FormGroup>
                </Box>
              )}

              {cfg.requireCertUpload && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  This site requires certificate copies. Bring physical documents to the site office.
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {step === 1 && !hasSafety && (
          <Card>
            <CardContent sx={{ p:3, textAlign:"center" }}>
              <Typography color="text.secondary">No safety certifications configured for this site.</Typography>
            </CardContent>
          </Card>
        )}

        {/* Step 2 — PPE & Acknowledgment */}
        {step === 2 && (
          <Card>
            <CardContent sx={{ p:{ xs:2, sm:3 } }}>
              <Typography variant="h6" fontWeight={600} mb={0.5}>PPE & Safety Acknowledgment</Typography>
              <Typography variant="body2" color="text.secondary" mb={2.5}>
                Target Zero — Whiting-Turner is committed to zero injuries on every job site.
              </Typography>

              {(errors.ppeConfirm || errors.safetyAck || errors.drugAck) && (
                <Alert severity="error" sx={{ mb: 2 }}>All acknowledgments are required.</Alert>
              )}

              <FormGroup sx={{ mb: 2.5 }}>
                {has("ppeConfirm") && (
                  <FormControlLabel
                    control={<Checkbox checked={f.ppeConfirm} onChange={e => set("ppeConfirm", e.target.checked)} size="small" color="primary" />}
                    label={<Typography variant="body2">I confirm I have all required PPE — hard hat, safety glasses, hi-vis, steel-toe boots</Typography>}
                    sx={{ mb: 1, alignItems:"flex-start" }}
                  />
                )}
                {has("safetyAck") && (
                  <FormControlLabel
                    control={<Checkbox checked={f.safetyAck} onChange={e => set("safetyAck", e.target.checked)} size="small" color="primary" />}
                    label={<Typography variant="body2">I will complete site-specific safety orientation before beginning work</Typography>}
                    sx={{ mb: 1, alignItems:"flex-start" }}
                  />
                )}
                {has("drugAck") && (
                  <FormControlLabel
                    control={<Checkbox checked={f.drugAck} onChange={e => set("drugAck", e.target.checked)} size="small" color="primary" />}
                    label={<Typography variant="body2">I am not under the influence of drugs or alcohol and consent to random testing</Typography>}
                    sx={{ alignItems:"flex-start" }}
                  />
                )}
              </FormGroup>

              {has("signature") && (
                <TextField
                  label="Print Full Name as Signature *"
                  value={f.signature}
                  onChange={e => set("signature", e.target.value)}
                  error={!!errors.signature}
                  helperText={errors.signature || "Type your full legal name"}
                  inputProps={{ style: { fontStyle:"italic", fontFamily:"Georgia, serif", fontSize:16 } }}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <Box sx={{ display:"flex", gap:2, mt: 2.5 }}>
          {step > 0 && (
            <Button variant="outlined" onClick={back} sx={{ flex:1 }}>Back</Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button variant="contained" onClick={next} sx={{ flex:2 }}>Next Step →</Button>
          ) : (
            <Button variant="contained" onClick={submit} disabled={busy} sx={{ flex:2, py:1.25 }}>
              {busy ? "Submitting…" : "Submit Registration →"}
            </Button>
          )}
        </Box>

        <Typography variant="caption" color="text.disabled" sx={{ display:"block", textAlign:"center", mt: 2 }}>
          By submitting you confirm all information is accurate · Whiting-Turner Contracting Co.
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Success Page ─────────────────────────────────────────────────────────────
interface SuccessProps { worker: WorkerSubmission; site: Site; onDone: () => void }

export function SuccessPage({ worker, site, onDone }: SuccessProps) {
  return (
    <Box sx={{ minHeight:"100dvh", bgcolor:"#F5F5F5", display:"flex", flexDirection:"column" }}>
      {/* Topbar */}
      <Box sx={{ bgcolor: ORANGE, py:1.5, px:2.5 }}>
        <Typography sx={{ color:"#fff", fontWeight:600, fontSize:16 }}>Head Count</Typography>
      </Box>

      <Box sx={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", p: 3 }}>
        <CheckCircleIcon sx={{ fontSize:72, color:"success.main", mb: 2 }} />
        <Typography variant="h5" fontWeight={700} mb={0.5}>Attendance Recorded</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Welcome, {worker.firstName} {worker.lastName}
        </Typography>

        <Card sx={{ width:"100%", maxWidth:400, borderTop:`3px solid ${ORANGE}` }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ display:"grid", gridTemplateColumns:"1fr 1fr", bgcolor:"#FAFAFA", px:2.5, py:1.5, borderBottom:"1px solid #F0F0F0" }}>
              {["Name","Worker ID"].map(h => (
                <Typography key={h} variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform:"uppercase", letterSpacing:1 }}>{h}</Typography>
              ))}
            </Box>
            <Box sx={{ display:"grid", gridTemplateColumns:"1fr 1fr", px:2.5, py:2, borderBottom:"1px solid #F0F0F0" }}>
              <Typography fontWeight={600} fontSize={16}>{worker.firstName}</Typography>
              <Typography fontWeight={700} fontSize={15} color="primary" sx={{ fontFamily:"monospace" }}>{worker.workerId}</Typography>
            </Box>
            <Box sx={{ display:"grid", gridTemplateColumns:"1fr 1fr", px:2.5, py:2, borderBottom:"1px solid #F0F0F0" }}>
              <Box>
                <Typography variant="body2">{site.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontFamily:"monospace" }}>{worker.checkIn}</Typography>
                <Typography variant="caption" color="text.secondary">Check-In</Typography>
              </Box>
            </Box>
            <Box sx={{ px:2.5, py:1.5, bgcolor:"#FAFAFA", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <Box sx={{ display:"flex", alignItems:"center", gap:0.75 }}>
                <Box sx={{ width:8, height:8, borderRadius:"50%", bgcolor:"success.main" }} />
                <Typography variant="body2" color="success.main" fontWeight={600}>Logged</Typography>
              </Box>
              <Chip label="TARGET ZERO" size="small" sx={{ bgcolor: ORANGE, color:"#fff", fontSize:9, height:18, fontWeight:700, letterSpacing:1 }} />
            </Box>
          </CardContent>
        </Card>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5, textAlign:"center" }}>
          Show this screen to your supervisor before starting work.
        </Typography>
        <Button variant="outlined" onClick={onDone} sx={{ mt: 2 }}>
          Return to Portal →
        </Button>
      </Box>
    </Box>
  );
}
