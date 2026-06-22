import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Email, LockReset } from "@mui/icons-material";

import AuthFooter from "../../components/Auth/AuthFooter";
import { requestPasswordReset } from "../../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await requestPasswordReset(email.trim());
      setMessage(
        response.message ||
        "Se este e-mail estiver cadastrado, enviaremos as instruções de redefinição."
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        "Não foi possível solicitar a recuperação. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        width: "100vw",
        height: { xs: "auto", lg: "100dvh" },
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        bgcolor: "#f8fafc",
        px: { xs: 2, sm: 4 },
        py: { xs: 3, sm: 4, lg: 1.5 },
        overflowX: "hidden",
        overflowY: { xs: "auto", lg: "hidden" },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 540,
          px: { xs: 2.5, sm: 5 },
          py: { xs: 3, sm: 5 },
          borderRadius: 3,
          border: "1px solid rgba(15,23,42,.06)",
          boxShadow:
            "0 20px 60px rgba(15,23,42,.12), 0 2px 8px rgba(15,23,42,.04)",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            mx: "auto",
            mb: 2,
            borderRadius: "50%",
            bgcolor: "#eff6ff",
            color: "#1d70d8",
            display: "grid",
            placeItems: "center",
          }}
        >
          <LockReset sx={{ fontSize: 38 }} />
        </Box>

        <Typography
          variant="h4"
          sx={{ textAlign: "center", fontWeight: 900, color: "#0f172a" }}
        >
          Recuperar senha
        </Typography>
        <Typography
          sx={{ textAlign: "center", color: "text.secondary", mt: 1, mb: 3 }}
        >
          Informe seu e-mail para receber um link de redefinição.
        </Typography>

        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "#6b7280" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": { minHeight: 54, borderRadius: 2 },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !email.trim()}
          sx={{
            minHeight: 54,
            borderRadius: 2,
            fontWeight: 800,
            textTransform: "none",
            bgcolor: "#1669e8",
            "&:hover": { bgcolor: "#0f5fd6" },
          }}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Enviar link de redefinição"
          )}
        </Button>

        <Button
          fullWidth
          variant="text"
          onClick={() => navigate("/login")}
          sx={{ mt: 1.5, textTransform: "none", fontWeight: 700 }}
        >
          Voltar para o login
        </Button>

        <AuthFooter />
      </Paper>
    </Box>
  );
}

export default ForgotPassword;
