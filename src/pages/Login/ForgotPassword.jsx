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

      const response = await requestPasswordReset(email);

      setMessage(
        response.message ||
        "Se o e-mail estiver cadastrado, enviaremos um link de redefinição."
      );
    } catch {
      setError(
        "Não foi possível solicitar a recuperação. Verifique o e-mail e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        bgcolor: "#f8fafc",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 520,
          p: {
            xs: 3,
            sm: 5,
          },
          borderRadius: 4,
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
          fontWeight={900}
          textAlign="center"
          color="#0f172a"
        >
          Recuperar senha
        </Typography>

        <Typography
          textAlign="center"
          color="text.secondary"
          mt={1}
          mb={3}
        >
          Informe seu e-mail para receber um link de redefinição.
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="E-mail"
          placeholder="seu@email.com"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: "#6b7280" }} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !email.trim()}
          sx={{
            height: 54,
            borderRadius: 2,
            fontWeight: 800,
            textTransform: "none",
            bgcolor: "#1669e8",
            "&:hover": {
              bgcolor: "#0f5fd6",
            },
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
          sx={{
            mt: 1.5,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Voltar para o login
        </Button>
      </Paper>
    </Box>
  );
}

export default ForgotPassword;
