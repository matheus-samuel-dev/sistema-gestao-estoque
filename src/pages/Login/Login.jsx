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

function CubeLogo({ size = 78 }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 96 96"
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        filter: "drop-shadow(0 10px 20px rgba(37,99,235,.35))",
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
      component="svg"
      viewBox="0 0 48 48"
      aria-hidden="true"
      sx={{
        width: 23,
        height: 23,
        display: "block",
      }}
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z"
      />
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
          width: 54,
          height: 54,
          borderRadius: 3,
          background:
            "linear-gradient(135deg, rgba(37,99,235,.36), rgba(14,165,233,.2))",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.16)",
          color: "#9bd3ff",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          "& svg": {
            fontSize: 29,
          },
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: 16,
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "rgba(255,255,255,.82)",
            mt: 0.35,
            fontSize: 15,
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
  const [rememberMe, setRememberMe] = useState(true);

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

      const response = await login(email, password);

      persistToken(response.token);
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

        persistToken(response.token);
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
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
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
          height: "100vh",
          px: {
            lg: 7,
            xl: 9,
          },
          py: 4,
          color: "#fff",
          backgroundImage: `
            linear-gradient(90deg, rgba(3,10,30,.98), rgba(5,18,48,.92), rgba(5,20,54,.76)),
            url(${warehouseBg})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            maxWidth: 680,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              mb: 3,
            }}
          >
            <CubeLogo />

            <Box>
              <Typography
                sx={{
                  fontSize: 34,
                  fontWeight: 900,
                  letterSpacing: 0,
                  lineHeight: 1.04,
                }}
              >
                Sistema de
              </Typography>

              <Typography
                sx={{
                  fontSize: 40,
                  fontWeight: 900,
                  letterSpacing: 0,
                  lineHeight: 1.05,
                  color: "#2563eb",
                }}
              >
                Gestão de Estoque
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: 82,
              height: 4,
              bgcolor: "#2f80ff",
              borderRadius: 999,
              mb: 2.7,
            }}
          />

          <Typography
            sx={{
              color: "rgba(255,255,255,.88)",
              fontSize: 19,
              lineHeight: 1.45,
              maxWidth: 610,
              mb: 3.4,
            }}
          >
            Tenha controle total do seu estoque em tempo real,
            acompanhe movimentações e tome decisões com base em
            dados precisos.
          </Typography>

          <Stack spacing={2.35}>
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
          height: "100vh",
          display: "grid",
          gridTemplateRows: "1fr auto",
          alignItems: "center",
          justifyItems: "center",
          px: {
            xs: 2,
            sm: 4,
            lg: 6,
          },
          py: 2.4,
          bgcolor: "#f8fafc",
          overflow: "hidden",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 650,
            px: {
              xs: 2.6,
              sm: 5,
            },
            py: {
              xs: 2.8,
              sm: 3.7,
            },
            borderRadius: 4,
            bgcolor: "#fff",
            border: "1px solid rgba(15,23,42,.06)",
            boxShadow:
              "0 20px 60px rgba(15,23,42,.12), 0 2px 8px rgba(15,23,42,.04)",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              mb: 2.8,
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                mx: "auto",
                borderRadius: "50%",
                bgcolor: "#eff6ff",
                display: "grid",
                placeItems: "center",
                color: "#1d70d8",
                mb: 1.7,
                "& svg": {
                  fontSize: 37,
                },
              }}
            >
              <Lock />
            </Box>

            <Typography
              sx={{
                fontSize: {
                  xs: 26,
                  sm: 31,
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
                mt: 0.8,
                fontSize: 17,
              }}
            >
              Acesse sua conta para continuar
            </Typography>
          </Box>

          <Typography
            sx={{
              fontWeight: 800,
              color: "#111827",
              mb: 0.8,
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
              mb: 1.8,
              "& .MuiOutlinedInput-root": {
                height: 54,
                borderRadius: 2,
                bgcolor: "#fff",
              },
            }}
          />

          <Typography
            sx={{
              fontWeight: 800,
              color: "#111827",
              mb: 0.8,
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
                height: 54,
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
              mt: 1.6,
              mb: 2.2,
              flexWrap: "wrap",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                  sx={{
                    color: "#2563eb",
                    py: 0.5,
                    "&.Mui-checked": {
                      color: "#2563eb",
                    },
                  }}
                />
              }
              label="Lembrar meu acesso"
              sx={{
                color: "#4b5563",
                m: 0,
              }}
            />

            <Link
              component="button"
              type="button"
              onClick={() => navigate("/forgot-password")}
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
              height: 58,
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
              my: 2.25,
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
              height: 56,
              borderRadius: 2,
              borderColor: "#d1d5db",
              color: "#1f2937",
              fontSize: 17,
              fontWeight: 800,
              textTransform: "none",
              bgcolor: "#fff",
              display: "flex",
              alignItems: "center",
              "& .MuiButton-startIcon": {
                display: "inline-flex",
                alignItems: "center",
                mr: 1.4,
              },
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
          spacing={1.2}
          sx={{
            width: "100%",
            maxWidth: 650,
            alignItems: "center",
            textAlign: "center",
            color: "#6b7280",
            pt: 1.8,
            fontSize: 14,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Security sx={{ color: "#1d70d8", fontSize: 22 }} />
            Seus dados estão protegidos com segurança avançada
          </Box>

          <Typography sx={{ fontSize: 14 }}>
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

          <Typography sx={{ fontSize: 14 }}>
            Versão 1.0.0
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

export default Login;
