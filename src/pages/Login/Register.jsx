import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import AuthBrandPanel from "../../components/Auth/AuthBrandPanel";
import AuthFooter from "../../components/Auth/AuthFooter";
import { register } from "../../services/authService";
import { isValidEmail } from "../../utils/validators";
import { isStrongPassword } from "../../utils/validators";
import PasswordStrength from "../../components/Auth/PasswordStrength";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [touched, setTouched] = useState({});

  const fieldErrors = {
    name: formData.name.trim().length < 3 ? "Informe um nome com pelo menos 3 caracteres." : "",
    email: !isValidEmail(formData.email) ? "Informe um e-mail válido." : "",
    password: !isStrongPassword(formData.password) ? "Use 8 caracteres com maiúscula, minúscula, número e símbolo." : "",
    confirmPassword: !formData.confirmPassword
      ? "Confirme sua senha."
      : formData.password !== formData.confirmPassword
        ? "As senhas não conferem."
        : "",
  };
  const isFormValid = Object.values(fieldErrors).every((value) => !value);

  const updateField = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
    setError("");
  };

  const validate = () => {
    if (!formData.name.trim()) return "Informe seu nome.";
    if (!isValidEmail(formData.email)) return "Informe um e-mail válido.";
    if (formData.password.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    if (formData.password !== formData.confirmPassword) return "As senhas não conferem.";
    return "";
  };

  const handleSubmit = async () => {
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      setSuccess("Conta criada com sucesso! Redirecionando para o login...");
      setTimeout(() => navigate("/login"), 1600);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        "Não foi possível criar a conta. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    mb: 1.5,
    "& .MuiOutlinedInput-root": { minHeight: 52, borderRadius: 2 },
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: { xs: "auto", lg: "100dvh" },
        minHeight: "100dvh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
        bgcolor: "#f8fafc",
        overflow: { xs: "visible", lg: "hidden" },
      }}
    >
      <AuthBrandPanel />

      <Box
        component="main"
        sx={{
          height: { xs: "auto", lg: "100dvh" },
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 2.5, sm: 3, lg: 1.5 },
          overflowY: { xs: "auto", lg: "hidden" },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 650,
            px: { xs: 2.5, sm: 5 },
            py: { xs: 3, sm: 4 },
            borderRadius: 3,
            border: "1px solid rgba(15,23,42,.06)",
            boxShadow:
              "0 20px 60px rgba(15,23,42,.12), 0 2px 8px rgba(15,23,42,.04)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 2.5 }}>
            <Box
              sx={{
                width: 68,
                height: 68,
                mx: "auto",
                mb: 1.5,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                bgcolor: "#eff6ff",
                color: "#1669e8",
              }}
            >
              <Person sx={{ fontSize: 37 }} />
            </Box>
            <Typography
              sx={{ fontSize: { xs: 27, sm: 31 }, fontWeight: 900, color: "#0f172a" }}
            >
              Criar conta
            </Typography>
            <Typography sx={{ color: "#6b7280", mt: 0.5 }}>
              Preencha seus dados para começar
            </Typography>
          </Box>

          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            fullWidth
            label="Nome"
            autoComplete="name"
            value={formData.name}
            onChange={updateField("name")}
            onBlur={() => setTouched((current) => ({ ...current, name: true }))}
            error={Boolean(touched.name && fieldErrors.name)}
            helperText={touched.name && fieldErrors.name}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start"><Person /></InputAdornment>
                ),
              },
            }}
            sx={inputSx}
          />

          <TextField
            fullWidth
            label="E-mail"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={updateField("email")}
            onBlur={() => setTouched((current) => ({ ...current, email: true }))}
            error={Boolean(touched.email && fieldErrors.email)}
            helperText={touched.email && fieldErrors.email}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start"><Email /></InputAdornment>
                ),
              },
            }}
            sx={inputSx}
          />

          <TextField
            fullWidth
            label="Senha"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={formData.password}
            onChange={updateField("password")}
            onBlur={() => setTouched((current) => ({ ...current, password: true }))}
            error={Boolean(touched.password && fieldErrors.password)}
            helperText={touched.password && fieldErrors.password}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start"><Lock /></InputAdornment>
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
            sx={inputSx}
          />

          <PasswordStrength password={formData.password} />

          <TextField
            fullWidth
            label="Confirmar senha"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={updateField("confirmPassword")}
            onBlur={() => setTouched((current) => ({ ...current, confirmPassword: true }))}
            error={Boolean(touched.confirmPassword && fieldErrors.confirmPassword)}
            helperText={touched.confirmPassword && fieldErrors.confirmPassword}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start"><Lock /></InputAdornment>
                ),
              },
            }}
            sx={{ ...inputSx, mb: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || Boolean(success) || !isFormValid}
            sx={{
              minHeight: 54,
              borderRadius: 2,
              bgcolor: "#1669e8",
              fontWeight: 900,
              textTransform: "none",
              fontSize: 16,
              "&:hover": { bgcolor: "#0f5fd6" },
            }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Criar minha conta"}
          </Button>

          <Typography sx={{ mt: 2, textAlign: "center", color: "#6b7280" }}>
            Já possui uma conta?{" "}
            <Link
              component="button"
              type="button"
              onClick={() => navigate("/login")}
              sx={{ color: "#1669e8", fontWeight: 800, verticalAlign: "baseline" }}
            >
              Entrar
            </Link>
          </Typography>

          <AuthFooter />
        </Paper>
      </Box>
    </Box>
  );
}

export default Register;
