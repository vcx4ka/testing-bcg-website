import { createTheme } from "@mui/material/styles";

// Verified official UVA brand colors (brand.virginia.edu/design-assets/colors):
// Jefferson Blue #232D4B, UVA Orange #E57200. Everything else here is a
// derived/best-effort palette pending exact SDS brand values.
const theme = createTheme({
  palette: {
    primary: { main: "#232d4b" },
    secondary: { main: "#e57200" },
    background: { default: "#ffffff" },
  },
  typography: {
    // Libre Franklin substitutes for Franklin Gothic (SDS's primary brand
    // font), which isn't available as a free web font.
    fontFamily: '"Libre Franklin", -apple-system, sans-serif',
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
});

export default theme;
