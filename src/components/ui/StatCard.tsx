import { Paper, Typography } from "@mui/material";

interface StatCardProps {
  label: string;
  value: string | number;
  tone?: "default" | "accent";
}

export function StatCard({ label, value, tone = "default" }: StatCardProps) {
  const isAccent = tone === "accent";
  return (
    <Paper
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: isAccent ? "primary.light" : "divider",
        bgcolor: isAccent ? "rgba(232,89,12,0.08)" : "background.paper",
      }}
    >
      <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: 0.9, color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography variant="h4" fontWeight={700} color={isAccent ? "primary.main" : "text.primary"} sx={{ mt: 1 }}>
        {value}
      </Typography>
    </Paper>
  );
}
