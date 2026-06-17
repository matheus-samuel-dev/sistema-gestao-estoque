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
  Inventory2,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import warehouseBg from "../../assets/banner_login_projeto.png";
import { register } from "../../services/authService";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const updateField = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
    setError("");
  };

  const validate = () => {
    if (!formData.name.trim()) {
      return "Informe seu nome.";
    }

    if (!EMAIL_PATTERN.test(formData.email.trim())) {
      return "Informe um e-mail válido.";
    }

    if (formData.password.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "As senhas não conferem.";
    }

    return "";
  };

  const handleSubmit = async () => {
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

      setTimeout(() => {
        navigate("/login");
      }, 1600);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        "Não foi possível criar a conta. Tente novamente."
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
        gridTemplateColumns: {
          xs: "1fr",
          lg: "42% 58%",
        },
        bgcolor: "#f8fafc",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: {
            xs: "none",
            lg: "flex",
          },
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          px: 7,
          color: "#fff",
          backgroundImage: `
            linear-gradient(90deg, rgba(3,10,30,.98), rgba(5,18,48,.88)),
            url(${warehouseBg})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box sx={{ maxWidth: 520 }}>
          <Box
            sx={{
              width: 82,
              height: 82,
              display: "grid",
              placeItems: "center",
              borderRadius: 3,
              bgcolor: "#1669e8",
              mb: 3,
              boxShadow: "0 18px 34px rgba(22,105,232,.3)",
            }}
          >
            <Inventory2 sx={{ fontSize: 46 }} />
          </Box>

          <Typography
            sx={{
              fontSize: 40,
              fontWeight: 900,
              lineHeight: 1.08,
            }}
          >
            Comece a organizar seu estoque
          </Typography>

          <Typography
            sx={{
              mt: 2.5,
              color: "rgba(255,255,255,.82)",
              fontSize: 18,
              lineHeight: 1.55,
            }}
          >
            Crie sua conta para gerenciar produtos, categorias e movimentações em um só lugar.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          height: "100vh",
          display: "grid",
          placeItems: "center",
          px: {
            xs: 2,
            sm: 4,
          },
          py: 2,
          overflow: "hidden",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 590,
            px: {
              xs: 3,
              sm: 5,
            },
            py: {
              xs: 3,
              sm: 4,
            },
            borderRadius: 4,
            border: "1px solid rgba(15,23,42,.06)",
            boxShadow:
              "0 20px 60px rgba(15,23,42,.12), 0 2px 8px rgba(15,23,42,.04)",
          }}
        >
          <Box textAlign="center" mb={2.5}>
            <Box
              sx={{
                width: 66,
                height: 66,
                mx: "auto",
                mb: 1.5,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                bgcolor: "#eff6ff",
                color: "#1669e8",
              }}
            >
              <Person sx={{ fontSize: 36 }} />
            </Box>

            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 900,
                color: "#0f172a",
              }}
            >
              Criar conta
            </Typography>

            <Typography color="text.secondary" mt={0.5}>
              Preencha seus dados para começar
            </Typography>
          </Box>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Nome"
            value={formData.name}
            onChange={updateField("name")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1.5 }}
          />

          <TextField
            fullWidth
            label="E-mail"
            type="email"
            value={formData.email}
            onChange={updateField("email")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1.5 }}
          />

          <TextField
            fullWidth
            label="Senha"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={updateField("password")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1.5 }}
          />

          <TextField
            fullWidth
            label="Confirmar senha"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={updateField("confirmPassword")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || Boolean(success)}
            sx={{
              height: 54,
              borderRadius: 2,
              bgcolor: "#1669e8",
              fontWeight: 900,
              textTransform: "none",
              fontSize: 16,
              "&:hover": {
                bgcolor: "#0f5fd6",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Criar minha conta"
            )}
          </Button>

          <Typography
            sx={{
              mt: 2,
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            Já possui uma conta?{" "}
            <Link
              component="button"
              type="button"
              onClick={() => navigate("/login")}
              sx={{
                color: "#1669e8",
                fontWeight: 800,
                verticalAlign: "baseline",
              }}
            >
              Entrar
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default Register;
