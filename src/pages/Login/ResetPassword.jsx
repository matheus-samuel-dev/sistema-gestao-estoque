import { useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  Lock,
  LockReset,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { resetPassword } from "../../services/authService";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await resetPassword(token, password);

      setMessage(
        response.message ||
        "Senha redefinida com sucesso."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Não foi possível redefinir a senha. O link pode estar expirado ou já utilizado."
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
          Nova senha
        </Typography>

        <Typography
          textAlign="center"
          color="text.secondary"
          mt={1}
          mb={3}
        >
          Crie uma nova senha para acessar sua conta.
        </Typography>

        {!token && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Link inválido. Solicite uma nova recuperação de senha.
          </Alert>
        )}

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
          label="Nova senha"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: "#6b7280" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Confirmar senha"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(event.target.value)
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: "#6b7280" }} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={
            loading ||
            !token ||
            password.length < 6 ||
            !confirmPassword
          }
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
            "Redefinir senha"
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

export default ResetPassword;
