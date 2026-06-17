import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  Email,
  Lock,
  Security,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import AuthBrandPanel from "../../components/Auth/AuthBrandPanel";
import { login } from "../../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const persistToken = (token) => {
    if (rememberMe) {
      localStorage.setItem("token", token);
      sessionStorage.removeItem("token");
      return;
    }

    sessionStorage.setItem("token", token);
    localStorage.removeItem("token");
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await login(email.trim(), password);

      persistToken(response.token);
      navigate("/dashboard");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        "Usuário ou senha inválidos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
        bgcolor: "#f8fafc",
        overflowX: "hidden",
      }}
    >
      <AuthBrandPanel />

      <Box
        component="main"
        sx={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 2.5, sm: 4 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 650 }}>
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              px: { xs: 2.5, sm: 5 },
              py: { xs: 3, sm: 4 },
              borderRadius: 3,
              bgcolor: "#fff",
              border: "1px solid rgba(15,23,42,.06)",
              boxShadow:
                "0 20px 60px rgba(15,23,42,.12), 0 2px 8px rgba(15,23,42,.04)",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  mx: "auto",
                  mb: 1.7,
                  borderRadius: "50%",
                  bgcolor: "#eff6ff",
                  color: "#1d70d8",
                  display: "grid",
                  placeItems: "center",
                  "& svg": { fontSize: 37 },
                }}
              >
                <Lock />
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: 27, sm: 31 },
                  fontWeight: 900,
                  color: "#0f172a",
                  lineHeight: 1.15,
                }}
              >
                Bem-vindo de volta!
              </Typography>
              <Typography sx={{ color: "#6b7280", mt: 0.8, fontSize: 17 }}>
                Acesse sua conta para continuar
              </Typography>
            </Box>

            {error && (
              <Typography
                role="alert"
                sx={{
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#fef2f2",
                  color: "#b91c1c",
                }}
              >
                {error}
              </Typography>
            )}

            <Typography sx={{ fontWeight: 800, color: "#111827", mb: 0.8 }}>
              E-mail
            </Typography>
            <TextField
              fullWidth
              placeholder="seu@email.com"
              type="email"
              autoComplete="email"
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
                mb: 1.8,
                "& .MuiOutlinedInput-root": { minHeight: 54, borderRadius: 2 },
              }}
            />

            <Typography sx={{ fontWeight: 800, color: "#111827", mb: 0.8 }}>
              Senha
            </Typography>
            <TextField
              fullWidth
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#6b7280" }} />
                    </InputAdornment>
                  ),
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
                "& .MuiOutlinedInput-root": { minHeight: 54, borderRadius: 2 },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1.5,
                mt: 1.5,
                mb: 2.2,
                flexWrap: "wrap",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    sx={{
                      color: "#2563eb",
                      py: 0.5,
                      "&.Mui-checked": { color: "#2563eb" },
                    }}
                  />
                }
                label="Lembrar meu acesso"
                sx={{ color: "#4b5563", m: 0 }}
              />

              <Link
                component="button"
                type="button"
                onClick={() => navigate("/forgot-password")}
                underline="none"
                sx={{ color: "#2563eb", fontWeight: 700 }}
              >
                Esqueceu sua senha?
              </Link>
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              disabled={loading || !email.trim() || !password}
              startIcon={!loading && <Lock />}
              sx={{
                minHeight: 56,
                borderRadius: 2,
                fontSize: 17,
                fontWeight: 900,
                textTransform: "none",
                bgcolor: "#1669e8",
                boxShadow: "0 12px 24px rgba(22,105,232,.22)",
                "&:hover": { bgcolor: "#0f5fd6" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Entrar no Sistema"
              )}
            </Button>

            <Typography
              sx={{ mt: 1.8, textAlign: "center", color: "#6b7280", fontSize: 15 }}
            >
              Não possui uma conta?{" "}
              <Link
                component="button"
                type="button"
                onClick={() => navigate("/register")}
                sx={{ color: "#1669e8", fontWeight: 800, verticalAlign: "baseline" }}
              >
                Criar conta
              </Link>
            </Typography>

            <Box
              sx={{
                mt: 2.2,
                pt: 2,
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                color: "#64748b",
                textAlign: "center",
                fontSize: 14,
              }}
            >
              <Security sx={{ color: "#1d70d8", fontSize: 21 }} />
              Acesso interno seguro para usuários cadastrados.
            </Box>
          </Paper>

          <Typography
            sx={{ mt: 2, textAlign: "center", color: "#64748b", fontSize: 13 }}
          >
            © 2026 Sistema de Gestão de Estoque · Versão 1.0.0
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
