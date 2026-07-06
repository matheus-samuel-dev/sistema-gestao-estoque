import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";
import CompanyLogo from "../components/Common/CompanyLogo";

function Topbar({ onMenuClick, settings }) {
  return (
    <AppBar
      elevation={1}
      position="fixed"
      sx={{
        backgroundColor: "white",
        color: "#111827",
        width: { xs: "100%", md: "calc(100% - 260px)" },
        ml: { xs: 0, md: "260px" },
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          aria-label="Abrir menu"
          onClick={onMenuClick}
          sx={{ display: { xs: "inline-flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton aria-label="Notificações">
          <NotificationsNoneIcon />
        </IconButton>

        <CompanyLogo companyName={settings?.companyName} logoUrl={settings?.logoUrl} size={36} sx={{ ml: 2 }} />
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
