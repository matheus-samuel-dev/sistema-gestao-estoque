import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Box,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";

function Topbar({ onMenuClick }) {
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

        <Avatar
          sx={{
            ml: 2,
            width: 36,
            height: 36,
          }}
        >
          M
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
