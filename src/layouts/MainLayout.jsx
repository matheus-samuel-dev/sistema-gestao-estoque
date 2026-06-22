import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflowX: "hidden" }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { xs: "100%", md: "calc(100% - 260px)" },
          backgroundColor: "#f5f7fb",
        }}
      >
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <Box
          sx={{
            p: { xs: 1.5, sm: 2, md: 3 },
            mt: "64px",
            minWidth: 0,
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;
