import {
    Drawer,
    Toolbar,
    Typography,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SettingsIcon from "@mui/icons-material/Settings";

import { useNavigate, useLocation } from "react-router-dom";
import CompanyLogo from "../components/Common/CompanyLogo";

const drawerWidth = 260;

function Sidebar({ mobileOpen, onClose, settings }) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            text: "Dashboard",
            icon: <DashboardIcon />,
            path: "/dashboard",
        },
        {
            text: "Produtos",
            icon: <InventoryIcon />,
            path: "/products",
        },
        {
            text: "Categorias",
            icon: <CategoryIcon />,
            path: "/categories",
        },
        {
            text: "Fornecedores",
            icon: <LocalShippingIcon />,
            path: "/suppliers",
        },
        {
            text: "Movimentações",
            icon: <SwapHorizIcon />,
            path: "/movements",
        },
        {
            text: "Configurações",
            icon: <SettingsIcon />,
            path: "/settings",
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    const handleNavigate = (path) => {
        navigate(path);
        onClose?.();
    };

    const drawerContent = (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Toolbar>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        minWidth: 0,
                    }}
                >
                    <CompanyLogo
                        companyName={settings?.companyName}
                        logoUrl={settings?.logoUrl}
                        size={38}
                        sx={{ flexShrink: 0 }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight={900}
                            noWrap
                        >
                            {settings?.companyName || "Sistema de Estoque"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.68)" }} noWrap>
                            Gestão de estoque
                        </Typography>
                    </Box>
                </Box>
            </Toolbar>

            <Divider sx={{ borderColor: "#334155" }} />

            <List sx={{ mt: 2 }}>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.text}
                        selected={
                            location.pathname === item.path
                        }
                        onClick={() => handleNavigate(item.path)}
                        sx={{
                            mx: 1,
                            borderRadius: 2,
                            mb: 1,

                            "&.Mui-selected": {
                                backgroundColor:
                                    "#1976d2",
                            },

                            "&.Mui-selected:hover": {
                                backgroundColor:
                                    "#1565c0",
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{ color: "white" }}
                        >
                            {item.icon}
                        </ListItemIcon>

                        <ListItemText
                            primary={item.text}
                        />
                    </ListItemButton>
                ))}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            <Divider sx={{ borderColor: "#334155" }} />

            <List>
                <ListItemButton
                    onClick={handleLogout}
                >
                    <ListItemIcon
                        sx={{ color: "white" }}
                    >
                        <LogoutIcon />
                    </ListItemIcon>

                    <ListItemText primary="Sair" />
                </ListItemButton>
            </List>
        </Box>
    );

    const paperSx = {
        width: drawerWidth,
        boxSizing: "border-box",
        background: "linear-gradient(180deg,#0f172a,#1e293b)",
        color: "white",
    };

    return (
        <>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": paperSx,
                }}
            >
                {drawerContent}
            </Drawer>

            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", md: "block" },
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": paperSx,
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
}

export default Sidebar;
