import { useState } from "react";
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, InputAdornment, IconButton, Avatar,
} from "@mui/material";
import VisibilityIcon    from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ORANGE } from "../utils/constants";

interface Props { onLogin: (username: string, password: string) => boolean }

const DEMO = [
  { u:"admin", p:"admin123", label:"Admin" },
];

export function LoginPage({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState(false);
  const [loading,  setLoading]  = useState(false);

  const attempt = () => {
    setError(false);
    setLoading(true);
    setTimeout(() => {
      const ok = onLogin(username.trim(), password);
      if (!ok) { setError(true); setLoading(false); }
    }, 400);
  };

  return (
    <Box sx={{
      minHeight: "100dvh",
      bgcolor: "#F5F5F5",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      p: 2,
    }}>
      <Box sx={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar sx={{ bgcolor: ORANGE, width: 56, height: 56, fontSize: 14, fontWeight: 700, mx: "auto", mb: 2, boxShadow: `0 4px 20px ${ORANGE}44` }}>
            HC
          </Avatar>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Head Count
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Whiting-Turner Workforce Management
          </Typography>
        </Box>

        {/* Card */}
        <Card sx={{ borderTop: `3px solid ${ORANGE}` }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2.5}>
              Sign In
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                Invalid credentials — use admin / admin123
              </Alert>
            )}

            <TextField
              label="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === "Enter" && attempt()}
              placeholder="admin"
              sx={{ mb: 2 }}
            />

            <TextField
              label="Password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && attempt()}
              placeholder="••••••••"
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw(!showPw)} edge="end" size="small">
                      {showPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={attempt}
              disabled={loading || !username || !password}
              sx={{ py: 1.25, fontSize: "0.95rem", fontWeight: 600 }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </CardContent>
        </Card>

        {/* Demo accounts */}
        <Card sx={{ mt: 1.5 }}>
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              Demo
            </Typography>
            {DEMO.map(d => (
              <Box
                key={d.u}
                onClick={() => { setUsername(d.u); setPassword(d.p); }}
                sx={{ display:"flex", alignItems:"center", gap:2, mt:1, p:1, borderRadius:1, cursor:"pointer", "&:hover": { bgcolor:"#FFF7F4" } }}
              >
                <Typography variant="body2" sx={{ color: ORANGE, fontFamily:"monospace", fontWeight:600, minWidth:80 }}>{d.u}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily:"monospace", minWidth:70 }}>{d.p}</Typography>
                <Typography variant="caption" color="text.secondary">{d.label}</Typography>
              </Box>
            ))}
            <Typography variant="caption" color="text.disabled" sx={{ display:"block", mt:1 }}>
              Click to auto-fill
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="caption" color="text.disabled" sx={{ display:"block", textAlign:"center", mt: 2 }}>
          📱 Install as PWA — iOS Safari → Share → Add to Home Screen
        </Typography>
      </Box>
    </Box>
  );
}
