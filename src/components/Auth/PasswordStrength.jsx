import { Box, LinearProgress, Typography } from "@mui/material";
import { getPasswordStrength } from "../../utils/validators";

export default function PasswordStrength({ password }) {
  const strength = getPasswordStrength(password);
  if (!password) return null;
  return (
    <Box sx={{ mt: -0.5, mb: 1.5 }}>
      <LinearProgress variant="determinate" value={strength.score * 20} color={strength.color} sx={{ height: 6, borderRadius: 3 }} />
      <Typography variant="caption" color={`${strength.color}.main`}>
        Senha {strength.label.toLowerCase()}: use 8 caracteres, maiúscula, minúscula, número e símbolo.
      </Typography>
    </Box>
  );
}
