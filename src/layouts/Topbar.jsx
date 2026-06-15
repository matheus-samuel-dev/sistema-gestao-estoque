import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

function Topbar() {
  return (
    <AppBar
      elevation={1}
      position="fixed"
      sx={{
        backgroundColor: "white",
        color: "#111827",
        width: "calc(100% - 260px)",
        ml: "260px",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          fontWeight="bold"
        >
          Sistema de Estoque
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton>
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