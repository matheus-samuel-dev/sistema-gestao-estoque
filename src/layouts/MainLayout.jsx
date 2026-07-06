import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import OnboardingDialog from "../components/Onboarding/OnboardingDialog";
import { getSettings } from "../services/settingsService";

function MainLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [settings, setSettings] = useState(null);
  const hasToken = Boolean(localStorage.getItem("token") || sessionStorage.getItem("token"));

  useEffect(() => {
    if (!hasToken) {
      navigate("/login", { replace: true });
    }
  }, [hasToken, navigate]);

  useEffect(() => {
    if (!hasToken) return undefined;

    const loadSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
        setShowOnboarding(data.onboardingCompleted === false);
      } catch {
        setShowOnboarding(false);
      }
    };
    loadSettings();

    window.addEventListener("settings:updated", loadSettings);
    return () => window.removeEventListener("settings:updated", loadSettings);
  }, [hasToken]);

  if (!hasToken) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflowX: "hidden" }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        settings={settings}
      />

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { xs: "100%", md: "calc(100% - 260px)" },
          backgroundColor: "#f5f7fb",
        }}
      >
        <Topbar onMenuClick={() => setMobileOpen(true)} settings={settings} />

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
      <OnboardingDialog open={showOnboarding} onDone={() => setShowOnboarding(false)} />
    </Box>
  );
}

export default MainLayout;
