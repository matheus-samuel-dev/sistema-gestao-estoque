import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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

import AuthFooter from "../../components/Auth/AuthFooter";
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
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });

  const passwordError = touched.password && password.length < 6
    ? "A senha deve ter pelo menos 6 caracteres."
    : "";
  const confirmPasswordError = touched.confirmPassword && !confirmPassword
    ? "Confirme sua senha."
    : touched.confirmPassword && password !== confirmPassword
      ? "As senhas não conferem."
      : "";
  const isFormValid = Boolean(token) && password.length >= 6 && password === confirmPassword;

  const handleSubmit = async () => {
    setTouched({ password: true, confirmPassword: true });
    if (!isFormValid) return;

    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await resetPassword(token, password);
      setMessage(response.message || "Senha redefinida com sucesso.");
      setTimeout(() => navigate("/login"), 1800);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        "Não foi possível redefinir a senha. O link pode estar expirado ou já utilizado."
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordInputProps = {
    startAdornment: (
      <InputAdornment position="start">
        <Lock sx={{ color: "#6b7280" }} />
      </InputAdornment>
    ),
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
          Nova senha
        </Typography>
        <Typography
          sx={{ textAlign: "center", color: "text.secondary", mt: 1, mb: 3 }}
        >
          Crie uma nova senha para acessar sua conta.
        </Typography>

        {!token && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Link inválido. Solicite uma nova recuperação de senha.
          </Alert>
        )}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth
          label="Nova senha"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, password: true }))}
          error={Boolean(passwordError)}
          helperText={passwordError}
          slotProps={{
            input: {
              ...passwordInputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": { minHeight: 54, borderRadius: 2 },
          }}
        />

        <TextField
          fullWidth
          label="Confirmar senha"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, confirmPassword: true }))}
          error={Boolean(confirmPasswordError)}
          helperText={confirmPasswordError}
          slotProps={{ input: passwordInputProps }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": { minHeight: 54, borderRadius: 2 },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !isFormValid}
          sx={{
            minHeight: 54,
            borderRadius: 2,
            fontWeight: 800,
            textTransform: "none",
            bgcolor: "#1669e8",
            "&:hover": { bgcolor: "#0f5fd6" },
          }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Redefinir senha"}
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

export default ResetPassword;
