import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import {
  Inventory2,
  Category,
  BarChart,
  SwapHoriz,
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from "@mui/icons-material";

import { login } from "../../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await login(email, password);

      localStorage.setItem("token", response.token);

      navigate("/products");
    } catch (error) {
      alert("Usuário ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
      }}
    >
      {/* Painel Esquerdo */}

      <Box
        sx={{
          width: { xs: 0, md: "50%" },
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          p: 8,
          color: "#fff",
          background:
            "linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)",
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          mb={2}
        >
          Sistema de Gestão
          <br />
          de Estoque
        </Typography>

        <Typography
          variant="h6"
          sx={{ opacity: 0.85 }}
          mb={5}
        >
          Controle produtos, categorias e movimentações
          em uma plataforma profissional.
        </Typography>

        <List>
          <ListItem disablePadding>
            <ListItemIcon>
              <Inventory2 sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Cadastro de Produtos" />
          </ListItem>

          <ListItem disablePadding>
            <ListItemIcon>
              <Category sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Controle de Categorias" />
          </ListItem>

          <ListItem disablePadding>
            <ListItemIcon>
              <SwapHoriz sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Movimentações de Estoque" />
          </ListItem>

          <ListItem disablePadding>
            <ListItemIcon>
              <BarChart sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard Analítico" />
          </ListItem>
        </List>
      </Box>

      {/* Formulário */}

      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f4f6f8",
          p: 3,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: "100%",
            maxWidth: 500,
            p: 5,
            borderRadius: 4,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            align="center"
            gutterBottom
          >
            Bem-vindo
          </Typography>

          <Typography
            align="center"
            color="text.secondary"
            mb={4}
          >
            Entre para acessar o sistema
          </Typography>

          <TextField
            fullWidth
            label="E-mail"
            margin="normal"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Senha"
            type={
              showPassword ? "text" : "password"
            }
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword
                      ? <VisibilityOff />
                      : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 3,
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress
                size={24}
                color="inherit"
              />
            ) : (
              "Entrar"
            )}
          </Button>

          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            mt={4}
          >
            Desenvolvido com React + Spring Boot
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;