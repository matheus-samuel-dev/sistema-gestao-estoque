import { Box, Stack, Typography } from "@mui/material";
import {
  BarChart,
  Category,
  Inventory2,
  SwapHoriz,
} from "@mui/icons-material";

import warehouseBg from "../../assets/banner_login_projeto.png";

export function CubeLogo({ size = 78 }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 96 96"
      aria-label="Logo do Sistema de Gestão de Estoque"
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        filter: "drop-shadow(0 10px 20px rgba(37,99,235,.35))",
      }}
    >
      <defs>
        <linearGradient
          id="authCubeGradient"
          x1="12"
          y1="10"
          x2="82"
          y2="88"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>

      <path
        d="M48 7 86 28v41L48 90 10 69V28L48 7Z"
        fill="url(#authCubeGradient)"
      />
      <path d="M48 7 86 28 48 49 10 28 48 7Z" fill="#3b82f6" />
      <path d="M48 49 86 28v41L48 90V49Z" fill="#2563eb" />
      <path d="M48 49 10 28v41l38 21V49Z" fill="#1d4ed8" />
      <path
        d="M25 30 48 17l23 13M48 49v31M25 41v18l13 7V48l-13-7ZM58 43l14-8v18l-14 8V43Z"
        fill="none"
        stroke="#06142f"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6"
      />
      <path
        d="M25 30 48 43 71 30"
        fill="none"
        stroke="#93c5fd"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        opacity=".9"
      />
    </Box>
  );
}

function Feature({ icon, title, description }) {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Box
        sx={{
          width: 54,
          height: 54,
          borderRadius: 2,
          background:
            "linear-gradient(135deg, rgba(37,99,235,.36), rgba(14,165,233,.2))",
          color: "#9bd3ff",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          "& svg": { fontSize: 29 },
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>
          {title}
        </Typography>
        <Typography
          sx={{ color: "rgba(255,255,255,.82)", mt: 0.35, fontSize: 15 }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

function AuthBrandPanel() {
  return (
    <Box
      component="aside"
      sx={{
        display: { xs: "none", lg: "flex" },
        minHeight: "100dvh",
        alignItems: "center",
        px: { lg: 7, xl: 9 },
        py: 4,
        color: "#fff",
        backgroundImage: `
          linear-gradient(90deg, rgba(3,10,30,.98), rgba(5,18,48,.92), rgba(5,20,54,.76)),
          url(${warehouseBg})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box sx={{ maxWidth: 680 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 3 }}>
          <CubeLogo />
          <Box>
            <Typography
              sx={{ fontSize: 34, fontWeight: 900, lineHeight: 1.04 }}
            >
              Sistema de
            </Typography>
            <Typography
              sx={{
                fontSize: 40,
                fontWeight: 900,
                lineHeight: 1.05,
                color: "#2563eb",
              }}
            >
              Gestão de Estoque
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{ width: 82, height: 4, bgcolor: "#2f80ff", borderRadius: 999, mb: 2.7 }}
        />

        <Typography
          sx={{
            color: "rgba(255,255,255,.88)",
            fontSize: 19,
            lineHeight: 1.45,
            maxWidth: 610,
            mb: 3.4,
          }}
        >
          Tenha controle total do seu estoque em tempo real, acompanhe
          movimentações e tome decisões com base em dados precisos.
        </Typography>

        <Stack spacing={2.35}>
          <Feature
            icon={<Inventory2 />}
            title="Cadastro de Produtos"
            description="Gerencie seus produtos e informações."
          />
          <Feature
            icon={<Category />}
            title="Controle de Categorias"
            description="Organize por categorias e subcategorias."
          />
          <Feature
            icon={<SwapHoriz />}
            title="Movimentações"
            description="Entradas, saídas e transferências."
          />
          <Feature
            icon={<BarChart />}
            title="Dashboard Analítico"
            description="Relatórios e gráficos para melhores decisões."
          />
        </Stack>
      </Box>
    </Box>
  );
}

export default AuthBrandPanel;
