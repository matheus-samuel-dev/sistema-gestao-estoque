import { Box, Typography } from "@mui/material";
import { Security } from "@mui/icons-material";

function AuthFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 1.8,
        color: "#64748b",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.8,
          mb: 0.7,
          fontSize: 13,
        }}
      >
        <Security sx={{ color: "#1d70d8", fontSize: 18 }} />
        Seus dados estão protegidos com segurança avançada
      </Box>

      <Typography sx={{ fontSize: 12.5, lineHeight: 1.55 }}>
        © 2026 Sistema de Gestão de Estoque. Todos os direitos reservados.
        <br />
        Desenvolvido com{" "}
        <Box component="span" sx={{ color: "#ef4444" }}>
          ♥
        </Box>{" "}
        usando React, Spring Boot e PostgreSQL.
      </Typography>
    </Box>
  );
}

export default AuthFooter;
