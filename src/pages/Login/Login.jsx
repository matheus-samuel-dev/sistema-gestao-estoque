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
  Checkbox,
  Divider,
  FormControlLabel,
  Link,
  Stack,
} from "@mui/material";

import {
  BarChart,
  Category,
  Email,
  Inventory2,
  Lock,
  Security,
  SwapHoriz,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { useGoogleLogin } from "@react-oauth/google";

import warehouseBg from "../../assets/banner_login_projeto.png";
import { googleLogin, login } from "../../services/authService";

function CubeLogo({ size = 86 }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 96 96"
      sx={{
        width: size,
        height: size,
        flex: "0 0 auto",
        filter: "drop-shadow(0 12px 22px rgba(37,99,235,.35))",
      }}
    >
      <defs>
        <linearGradient
          id="cubeGradient"
          x1="12"
          y1="10"
          x2="82"
          y2="88"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>

      <path
        d="M48 7 86 28v41L48 90 10 69V28L48 7Z"
        fill="url(#cubeGradient)"
      />
      <path
        d="M48 7 86 28 48 49 10 28 48 7Z"
        fill="#3b82f6"
      />
      <path
        d="M48 49 86 28v41L48 90V49Z"
        fill="#2563eb"
      />
      <path
        d="M48 49 10 28v41l38 21V49Z"
        fill="#1d4ed8"
      />
      <path
        d="M25 30 48 17l23 13M48 49v31M25 41v18l13 7V48l-13-7ZM58 43l14-8v18l-14 8V43Z"
        fill="none"
        stroke="#06142f"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6"
      />
      <path
        d="M25 30 48 43 71 30"
        fill="none"
        stroke="#93c5fd"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        opacity=".9"
      />
    </Box>
  );
}

function GoogleMark() {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-grid",
        placeItems: "center",
        width: 24,
        height: 24,
        fontSize: 22,
        fontWeight: 700,
        fontFamily: "Arial, sans-serif",
        color: "#4285f4",
      }}
    >
      G
    </Box>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: 58,
          height: 58,
          borderRadius: 3,
          background:
            "linear-gradient(135deg, rgba(37,99,235,.34), rgba(14,165,233,.18))",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.16)",
          color: "#9bd3ff",
          display: "grid",
          placeItems: "center",
          "& svg": {
            fontSize: 31,
          },
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: 17,
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "rgba(255,255,255,.82)",
            mt: 0.5,
            fontSize: 16,
          }}
        >
          {desc}
        </Typography>
      </Box>
    </Box>
  );
}

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await login(email, password);

      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch {
      alert("Usuário ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  const startGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);

        const response = await googleLogin(
          tokenResponse.access_token
        );

        localStorage.setItem("token", response.token);
        navigate("/dashboard");
      } catch (error) {
        console.error(error);
        alert("Erro ao autenticar com Google");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setGoogleLoading(false);
      alert("Erro ao autenticar com Google");
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "1fr 1fr",
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
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          px: {
            lg: 9,
            xl: 12,
          },
          py: 7,
          color: "#fff",
          backgroundImage: `
            linear-gradient(90deg, rgba(3,10,30,.98), rgba(5,18,48,.9), rgba(5,20,54,.72)),
            url(${warehouseBg})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 22% 12%, rgba(37,99,235,.2), transparent 36%)",
            pointerEvents: "none",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            maxWidth: 720,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              mb: 4,
            }}
          >
            <CubeLogo />

            <Box>
              <Typography
                sx={{
                  fontSize: 38,
                  fontWeight: 900,
                  letterSpacing: 0,
                  lineHeight: 1.05,
                }}
              >
                Sistema de
              </Typography>

              <Typography
                sx={{
                  fontSize: 44,
                  fontWeight: 900,
                  letterSpacing: 0,
                  lineHeight: 1.08,
                  color: "#2563eb",
                }}
              >
                Gestão de Estoque
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: 88,
              height: 4,
              bgcolor: "#2f80ff",
              borderRadius: 999,
              mb: 3.5,
            }}
          />

          <Typography
            sx={{
              color: "rgba(255,255,255,.88)",
              fontSize: 21,
              lineHeight: 1.5,
              maxWidth: 650,
              mb: 4.5,
            }}
          >
            Tenha controle total do seu estoque em tempo real,
            acompanhe movimentações e tome decisões com base em
            dados precisos.
          </Typography>

          <Stack spacing={3}>
            <Feature
              icon={<Inventory2 />}
              title="Cadastro de Produtos"
              desc="Gerencie seus produtos e informações."
            />

            <Feature
              icon={<Category />}
              title="Controle de Categorias"
              desc="Organize por categorias e subcategorias."
            />

            <Feature
              icon={<SwapHoriz />}
              title="Movimentações"
              desc="Entradas, saídas e transferências."
            />

            <Feature
              icon={<BarChart />}
              title="Dashboard Analítico"
              desc="Relatórios e gráficos para melhores decisões."
            />
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: {
            xs: 2,
            sm: 4,
          },
          py: 5,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 650,
            px: {
              xs: 3,
              sm: 6,
            },
            py: {
              xs: 4,
              sm: 6,
            },
            borderRadius: 4,
            bgcolor: "#fff",
            border: "1px solid rgba(15,23,42,.06)",
            boxShadow:
              "0 24px 70px rgba(15,23,42,.12), 0 2px 8px rgba(15,23,42,.04)",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              mb: 4.5,
            }}
          >
            <Box
              sx={{
                width: 88,
                height: 88,
                mx: "auto",
                borderRadius: "50%",
                bgcolor: "#eff6ff",
                display: "grid",
                placeItems: "center",
                color: "#1d70d8",
                mb: 2.5,
                "& svg": {
                  fontSize: 44,
                },
              }}
            >
              <Lock />
            </Box>

            <Typography
              sx={{
                fontSize: {
                  xs: 28,
                  sm: 34,
                },
                fontWeight: 900,
                color: "#0f172a",
                lineHeight: 1.15,
              }}
            >
              Bem-vindo de volta!
            </Typography>

            <Typography
              sx={{
                color: "#6b7280",
                mt: 1.2,
                fontSize: 18,
              }}
            >
              Acesse sua conta para continuar
            </Typography>
          </Box>

          <Typography
            sx={{
              fontWeight: 800,
              color: "#111827",
              mb: 1,
            }}
          >
            E-mail
          </Typography>

          <TextField
            fullWidth
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
            sx={{
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                height: 58,
                borderRadius: 2,
                bgcolor: "#fff",
              },
            }}
          />

          <Typography
            sx={{
              fontWeight: 800,
              color: "#111827",
              mb: 1,
            }}
          >
            Senha
          </Typography>

          <TextField
            fullWidth
            placeholder="••••••••"
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
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 58,
                borderRadius: 2,
                bgcolor: "#fff",
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mt: 2.5,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  sx={{
                    color: "#2563eb",
                    "&.Mui-checked": {
                      color: "#2563eb",
                    },
                  }}
                />
              }
              label="Lembrar meu acesso"
              sx={{
                color: "#4b5563",
              }}
            />

            <Link
              href="#"
              underline="none"
              sx={{
                color: "#2563eb",
                fontWeight: 700,
              }}
            >
              Esqueceu sua senha?
            </Link>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={loading}
            startIcon={!loading && <Lock />}
            sx={{
              height: 64,
              borderRadius: 2,
              fontSize: 17,
              fontWeight: 900,
              textTransform: "none",
              bgcolor: "#1669e8",
              boxShadow: "0 12px 24px rgba(22,105,232,.22)",
              "&:hover": {
                bgcolor: "#0f5fd6",
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={24}
                color="inherit"
              />
            ) : (
              "Entrar no Sistema"
            )}
          </Button>

          <Divider
            sx={{
              my: 3.5,
              color: "#6b7280",
              "&::before, &::after": {
                borderColor: "#e5e7eb",
              },
            }}
          >
            ou continue com
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={() => {
              setGoogleLoading(true);
              startGoogleLogin();
            }}
            disabled={googleLoading}
            startIcon={
              googleLoading ? undefined : <GoogleMark />
            }
            sx={{
              height: 62,
              borderRadius: 2,
              borderColor: "#d1d5db",
              color: "#1f2937",
              fontSize: 17,
              fontWeight: 800,
              textTransform: "none",
              bgcolor: "#fff",
              "&:hover": {
                borderColor: "#9ca3af",
                bgcolor: "#f9fafb",
              },
            }}
          >
            {googleLoading ? (
              <CircularProgress size={22} />
            ) : (
              "Continuar com Google"
            )}
          </Button>
        </Paper>

        <Stack
          spacing={2}
          sx={{
            width: "100%",
            maxWidth: 650,
            alignItems: "center",
            textAlign: "center",
            mt: 3,
            color: "#6b7280",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: 16,
            }}
          >
            <Security sx={{ color: "#1d70d8" }} />
            Seus dados estão protegidos com segurança avançada
          </Box>

          <Typography sx={{ fontSize: 15 }}>
            © 2026 Sistema de Gestão de Estoque. Todos os direitos
            reservados.
            <br />
            Desenvolvido com{" "}
            <Box
              component="span"
              sx={{
                color: "#ef4444",
                fontWeight: 800,
              }}
            >
              ♥
            </Box>{" "}
            usando React, Spring Boot e PostgreSQL.
          </Typography>

          <Typography sx={{ fontSize: 15 }}>
            Versão 1.0.0
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

export default Login;
