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

import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 260;

function Sidebar() {
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
            text: "Movimentações",
            icon: <SwapHorizIcon />,
            path: "/movements",
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,

                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    background:
                        "linear-gradient(180deg,#0f172a,#1e293b)",
                    color: "white",
                },
            }}
        >
            <Toolbar>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    Sistema de Estoque
                </Typography>
            </Toolbar>

            <Divider sx={{ borderColor: "#334155" }} />

            <List sx={{ mt: 2 }}>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.text}
                        selected={
                            location.pathname === item.path
                        }
                        onClick={() =>
                            navigate(item.path)
                        }
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
        </Drawer>
    );
}

export default Sidebar;
