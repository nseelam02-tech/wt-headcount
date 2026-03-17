import { createTheme } from "@mui/material/styles";

export const wtTheme = createTheme({
  palette: {
    primary:    { main:"#E8590C", dark:"#C44800", light:"#FF7A35", contrastText:"#fff" },
    secondary:  { main:"#1A1A1A" },
    background: { default:"#F5F5F5", paper:"#FFFFFF" },
    text:       { primary:"#1A1A1A", secondary:"#666666" },
    success:    { main:"#2E7D32" },
    error:      { main:"#C62828" },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    button: { fontWeight:600, textTransform:"none" as const, letterSpacing:0.3 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiAppBar: {
      defaultProps:   { elevation:0 },
      styleOverrides: { root:{ borderBottom:"none" } },
    },
    MuiButton: {
      defaultProps:   { disableElevation:true },
      styleOverrides: {
        root: { borderRadius:8, padding:"9px 20px", fontWeight:600, fontSize:"0.875rem" },
        containedPrimary: { "&:hover":{ backgroundColor:"#C44800" } },
      },
    },
    MuiTextField: {
      defaultProps: { variant:"outlined" as const, size:"small" as const, fullWidth:true },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius:8, backgroundColor:"#fff",
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor:"#E8590C" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor:"#E8590C", borderWidth:2 },
        },
      },
    },
    MuiSelect:  { defaultProps: { size:"small" as const } },
    MuiCard:    { defaultProps:{ elevation:0 }, styleOverrides:{ root:{ border:"1px solid #E8E8E8", borderRadius:12 } } },
    MuiPaper:   { defaultProps:{ elevation:0 }, styleOverrides:{ root:{ borderRadius:12 } } },
    MuiChip:    { styleOverrides:{ root:{ borderRadius:6, fontWeight:500, fontSize:"0.75rem" } } },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            fontWeight:600, fontSize:"0.75rem", textTransform:"uppercase" as const,
            letterSpacing:"0.08em", color:"#888", backgroundColor:"#FAFAFA", borderBottom:"2px solid #E8E8E8",
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { "&:hover":{ backgroundColor:"#FAFAFA" }, "&:last-child td":{ borderBottom:0 } },
      },
    },
    MuiDrawer: {
      styleOverrides: { paper:{ background:"#1A1A1A", color:"#fff", borderRight:"none" } },
    },
    MuiDialog: {
      styleOverrides: { paper:{ borderRadius:16, border:"1px solid #E8E8E8" } },
    },
    MuiDialogTitle: {
      styleOverrides: { root:{ fontWeight:700, fontSize:"1.1rem", paddingBottom:8 } },
    },
    MuiTab: {
      styleOverrides: { root:{ fontWeight:600, textTransform:"none" as const, fontSize:"0.875rem", minHeight:44 } },
    },
    MuiCheckbox: { defaultProps:{ color:"primary" as const } },
    MuiRadio:    { defaultProps:{ color:"primary" as const } },
    MuiSnackbar: { defaultProps:{ anchorOrigin:{ vertical:"bottom" as const, horizontal:"center" as const } } },
  },
});
